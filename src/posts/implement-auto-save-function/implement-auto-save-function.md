---
date: "2025-06-25T00:00:00+09:00"
title: "클라이언트에서 안전한 자동 저장 기능을 구현해보자!"
slug: "implement-auto-save-function"
categories: ["Frontend", "React", "Typescript"]
tags: ["Frontend", "React", "Typescript"]
keywords: ["Frontend", "React", "Typescript"]
comments: true
draft: false
---

최근 유저가 폼 페이지에서 어떤 값을 입력할 때 그 값을 자동 저장해야하는 요구사항을 구현하였다.
사실 많은 폼에서 자동 저장 기능을 필요로 한다. 짧게 완성할 수 있는 폼이라면 필요가 없겠지만 긴 내용을 작성해야 하거나, 특히 중간에 유실되면 치명적인 사항일수록 더욱 그렇다.

자동 저장하는 방법도 주기적으로 저장하는 방식, 유저가 입력한 직후 저장하는 방식 등의 여러가지 방법이 있겠지만 유저가 **입력한 직후 저장하는 방식**을 사용하였다.
주기적으로 저장하는 방식은 유저가 브라우저를 닫지 않은 채 자리를 비우거나, 다음 저장 주기가 돌아오기전에 브라우저가 종료될 수 있기 때문에 유저의 입력이 끝난 직후 저장을 수행하는게 가장 확실한 방법이다.
물론 입력 직후라고 해도 약간의 디바운스를 걸어줄 필요는 있다.

어쨌든 입력 직후 자동 저장 기능을 구현하기 위해 공통 모듈을 하나 만들어 보았는데, 이유는 저장 요청들의 **race condition**을 관리해 줄 필요가 있어서이다.
입력 직후에 저장을 트리거할 경우, 잦은 입력에 의해 저장도 잦게 일어나게 된다.
이 때, 이전 저장 요청이 새로운 저장 요청보다 혹 늦게 완료되는 경우 데이터가 꼬여버릴 수 있기 때문이다.

## 자동 저장 인터페이스 설계

먼저 안정적인 자동 저장을 기능을 구현하기 위해 필요한 **몇 가지 규칙**을 생각해보았다.

1. 입력 직후, `{N}ms` 동안 입력 이벤트가 발생하지 않을 때 저장 수행 (디바운싱)
2. 저장이 진행 중일 때 새로운 입력 요청이 들어오면 보관하였다가 저장 완료 후 수행 (동시성 관리)
    - 저장하지 않고 유실되는 데이터가 생기거나, 저장 순서가 꼬여 데이터가 꼬이는 일이 없도록 보장

이후 위 규칙을 만족하는 자동 저장 인터페이스를 제공하는 클래스가 **어떤 상태**를 가져야할지 생각해보았다.

1. debounce를 위한 NodeJS Timer를 저장할 상태 
2. debounce 타임을 저장할 상태
    - 외부에서 값을 설정하기 위해 생성자 매개변수로 받는다.
3. 저장 중 여부에 대한 boolean 상태
4. 저장 중에 들어오는 새 저장 요청을 보관할 상태

위 내용들을 코드로 작성해보면 다음과 같다.

```typescript
class TaskRunner<T> {
    private debouncedTimer: NodeJS.Timeout | null = null;
    private isRunning: boolean = false;
    private bufferedTask: Task<T> | null = null;

    constructor(private readonly debounceMs: number = 0) {}
}
```

그리고 **필요한 메서드**에 대한 요구사항을 정의해보았다.

1. 클래스 인스턴스가 저장 요청 시 호출할 public 메서드, 이 메서드에 저장 로직이 담길 것이다.
2. 클래스 내부에서 실제 저장을 일으킬 때 사용할 private 메서드
3. 모든 작업이 수행된 후 상태 초기화를 위해 호출할 private 메서드

그리고 메서드가 인자로 받을 task 의 인터페이스가 필요하다.
단순히 저장 요청에 대한 콜백함수를 전달하게 할 수도 있지만, `onComplete`와 같은 다른 액션도 받을 수 있게 유연하게 객체로 구성해보려고 한다.

```typescript
interface Task<T> {
    run: () => Promise<T>;
    onComplete?: (result: T) => void;
}

class TaskRunner<T> {
    // ...

    public async schedule(task: Task<T>): Promise<void> {}

    private async execute(task: Task<T>): Promise<void> {}

    private reset() {}
}
```

최종적인 인터페이스는 다음과 같다.

```typescript
interface Task<T> {
    run: () => Promise<T>;
    onComplete?: (result: T) => void;
    // other actions..
}

class TaskRunner<T> {
    private debouncedTimer: NodeJS.Timeout | null = null;
    private isRunning: boolean = false;
    private bufferedTask: Task<T> | null = null;

    constructor(private readonly debounceMs: number = 0) {}

    public async schedule(task: Task<T>): Promise<void> {}

    private async execute(task: Task<T>): Promise<void> {}

    private reset() {}
}
```

## 메서드의 세부 동작 과정

아쉽게도 실제 코드를 첨부할 수 없어 주석으로 어떤 동작을 해야하는지만 서술해보았다.

schedule 메서드는 무엇을 해야할까? 들어온 저장 요청을 n초 후 실행하는 것이다.
또한 예약된 타이머가 존재하는지 확인하여 디바운스 타임 내에 들어온 요청이라면 타이머를 새로 갈아줄 필요가 있다.

```typescript
class TaskRunner<T> {
    public async schedule(task: Task<T>): Promise<void> {
        // 1. 타이머 상태에 타이머가 존재하는지 확인 후 존재한다면 타이머를 clear

        return new Promise((res, rej) => {
            // 2. setTimeout API를 이용하여 this.runTask 호출을 예약
        })
    }
}
```

다음으로 execute 메서드이다.
이 메서드에서 실제 저장 요청 실행, 예약된 태스크가 있는지 확인하고 실행 등의 동작을 수행한다.

```typescript
class TaskRunner<T> {
    private async execute(task: Task<T>): Promise<void> {
        if () {
            // 1. 이미 실행중인 태스크가 있다면 새 태스크를 bufferedTask에 저장
            return;
        }

        try {
            // 2. 없다면 isRunning을 true로 만들고 task 객체의 run 메서드를 실행
            // 3. run 메서드 종료 후 task 객체에 onComplete가 존재한다면 실행
            // 4. 이제 bufferedTask를 확인 후 존재한다면 runTask를 재귀적으로 호출
            // 5. 마지막으로 bufferedTask, debouncedTimer 모두 비어있다면 reset 메서드를 호출
        } catch() {
            // handle error here
        }
    }
}
```

## 실제 사용 사례

해당 클래스를 사용하여 실제 자동 저장을 구현하는 사례를 살펴보자.
유저의 입력 직후 저장을 시도하므로 input 태그의 onChange 핸들러에서 인스턴스의 schedule 메서드를 호출하기만 하면 된다. 

```typescript
const taskRunnerRef = useRef(new TaskRunner<Value[]>(1000));

const handleChangeInput = async () => {
    await taskRunnerRef.current.schedule({
        run: () => {
            // ..
            await onSave(formValues);
        },
        onComplete: () => {
            // ..
            increaseSaveCount();
            toast.success('Saved success.');
        }
    });
}

return (
    <Input onChange={handleChangeInput} />
)
```

## 태스크 예약 방식 개선

현재 `bufferedTask` 의 인터페이스는 `Task<T> | null` 로, 하나의 태스크만 버퍼링되는 구조이다.
그러나 만약 저장이 진행되는 동안 여러 예약 요청이 들어오면 어떻게 될까?
예를 들면 저장 요청1 이 실행되는 5초 동안 1초 간격으로 요청 2, 3, 4 가 들어오는 경우이다.

현재 구현은 가장 마지막으로 들어온 요청만 가지고 있는 구조이다.
나의 사례의 경우, 가장 나중 요청이 이전 요청의 데이터까지 모두 가지고 있어, 가장 마지막 예약 요청만 실행해도 문제가 없었다.
즉, 요청4가 요청2, 3 에서 저장하려던 내용을 가지고 있어, 요청 4만 성공하면 되는 상황이다.
이는 폼 내부적으로 매 저장 요청마다 `dirtyFields` 상태에서 저장할 내용을 가져오고, 모든 저장 요청이 끝나야만 `dirtyFields`를 초기화하기 때문에 가능했었다.

만약 이런 구조가 아니라면, `bufferedTask` 를 큐와 같은 자료구조로 관리하여 여러 요청들을 저장하여 순차적으로 실행하거나 하는 방식으로 구현해볼 수 있다.
그러나 예약된 태스크들을 하나씩 순차적으로 실행하면 무결성은 보장이 되지만 시간이 오래 걸릴 수 있고, `Promise.all` 과 같은 방식으로 병렬적으로 실행한다면 여러 태스크들이 같은 내용을 수정할 경우 데이터가 꼬이게 될 것이다.
데이터의 무결성을 보장하면서도 버퍼가 많이 쌓이지 않는 구조를 잘 고민해봐야할 것이다.

## 결론

이 글에서는 자동 저장이라는 요구사항을 해결하기 위해 `TaskRunner`를 설계했지만, 사실 이 모듈은 자동 저장에 국한되지 않고 순차적으로 비동기 작업을 처리하는데 보편적으로 사용할 수 있다.
이런 이유로 클래스명을 TaskRunner라고 범용적으로 지었다. 자동 저장은 이 모듈이 해결할 수 있는 문제 중 하나일 뿐이다.
그리고 이 모듈의 핵심은 **race condition** 이 일어나지 않게 여러 태스크들을 순차적으로 처리해주는 것에 있다.

클라이언트를 개발하다보면 비슷한 요구사항을 자주 마주할 수 있는데, 자동 저장 이외에도 '검색 API 호출', '파일 순차 업로드' 등이 있다.
일반적인 작업이라면 단순한 디바운스만으로도 요구사항을 처리할 수 있겠지만, 자동 저장과 같이 race condition이 절대 일어나지 않아야 하는 상황이라면 얘기가 다르다.
이외에도 에러 핸들링, 태스크 실행 실패 시 재시도 매커니즘 등의 기능을 추가로 구현해볼 수 있을 듯 하다:)

