---
date: "2025-11-01T00:00:00+09:00"
title: "안전한 자동 저장 모듈 설계하기"
tags: ["React", "Typescript"]
keywords: ["frontend", "react", "typescript", "프론트엔드", "리액트", "타입스크립트", "자동저장", "Form"]
comments: true
draft: false
---

SaaS 서비스를 개발하다 보면 Form 화면을 개발할 때가 굉장히 많다.
그리고 Form 화면에서의 UX를 설계 하다 보면, 자동 저장 기능 요구사항이 들어오는 경우가 빈번하다.

자동 저장은 짧고 빠르게 완성할 수 있는 폼이라면 필요가 없겠지만, 긴 내용을 작성해야 하거나 중간에 유실되면 치명적인 사항이면 꼭 필요하다.
그래서 이 반복적인 `자동 저장 플로우를 처리해주는 유틸 모듈`을 하나 만들어보려고 한다.

# 구현 전략

## 자동 저장 시점 결정하기

Form 입력값의 자동 저장 시점은 크게 2가지로 추려볼 수 있다.

1. 주기적으로 저장 수행
2. 유저 입력 이벤트에 맞춰 저장 수행

개인적으로 주기적 저장보다 입력 이벤트에 맞춰 저장하는 것이 더 좋다고 생각하여 2번 전략을 선택하였다.
데이터를 주기적으로 저장하면 유저가 브라우저를 닫지 않고 자리를 비우거나, 다음 저장 주기가 돌아오기 전에 브라우저가 종료되는 등의 문제가 발생할 수 있으므로,
유저의 입력 시점에 맞춰 저장하는 방식이 더 확실한 방법이다.
다만 입력 이벤트는 매우 빈번하게 발생하므로, debounce 처리를 해주어 어느 정도 데이터를 모아서 저장하는 것이 필요하다.

## 안정적인 자동 저장을 위한 기능 정의

그 다음으로 안정적으로 자동 저장을 수행하기 위해 필요한 몇 가지 기능을 정의해보았다.

1. `Debouncing`: 입력 직후, `{N}ms` 동안 입력 이벤트가 발생하지 않을 때 저장 수행
2. `Buffering`: 저장이 진행 중일 때 새로운 저장 요청이 들어오면 보관하였다가 저장 완료 후 수행
3. `Error Handling`: 에러 발생 시 핸들링 및 대기중인 버퍼를 끝까지 처리

다음 섹션에서 어떻게 구현했는지를 살펴보도록 하자.

# 인터페이스 설계

## 상태 설계

위에서 정의한 기능을 포함하기 위해 자동 저장 모듈이 **어떤 상태**를 가져야할지 생각해보았다.

1. `buffer`: 저장 중에 들어오는 새 저장 요청을 보관할 상태
2. `isBusy`: 비동기 Task가 실행 중인지 나타내는 상태
3. `delayTimer`: debounce 처리를 위한 Timer 상태
4. `delayMS`: debounce 간격 상태
5. `onError`: Error 핸들러

위 내용들을 코드로 작성해보면 다음과 같다.

```typescript
type Task<T> = () => Promise<T>;

interface TaskOptions {
  delayMS?: number;
  onError?: (error: unknown) => void;
}

export class DeferredTaskBuffer<T> {
  private buffer: Task<T> | null;
  private isBusy: boolean;
  private delayTimer: NodeJS.Timeout | null;
  private delayMS: number;
  private onError: ((error: unknown) => void) | undefined;

  constructor(options: TaskOptions) {
    this.buffer = null;
    this.isBusy = false;
    this.delayTimer = null;
    this.delayMS = options.delayMS ?? 1000;
    this.onError = options.onError;
  }
}
```

## 메서드 설계

다음으로 필요한 메서드를 정의해보았다.

1. `schedule`: 저장 이벤트 발생 시 호출할 public 메서드
2. `run`: 클래스 내부적으로 지연(debounce)이후 호출할 private 메서드

### schedule

schedule 요청은 무엇을 해야할까? 바로 들어온 Task를 `debounceMS` 이후에 실행하는 것이다.
이를 위해 debounce 타이머를 걸어주고, 그 사이에 새로운 Task가 들어오면 기존 타이머를 버리고 새로 스케쥴링한다.

타이머가 끝나면 `run()`으로 Task를 실행하면 되는데, 만약 진행중인 Task가 있다면 Buffer에 보관한다.
나중에 진행중인 Task가 끝나면, Bufffer에 있는 태스크가 연달아 실행되야 할 것이다.

```typescript
export class DeferredTaskBuffer<T> {
  public schedule(task: Task<T>) {
    // debounce timer가 실행중이면 새 timer로 갱신
    if (this.delayTimer) {
      clearTimeout(this.delayTimer);
    }

    this.delayTimer = setTimeout(async () => {
      this.delayTimer = null;
      // 저장이 진행중이면 buffer에 보관
      if (this.isBusy) {
        this.buffer = task;
        return;
      }
      await this.run(task);
    }, this.delayMS);
  }
}
```

### run

debounce 타이머가 종료되어 실제로 Task를 실행해야할 때, 내부적으로 호출하는 메서드이다.

1. 비동기 요청이 진행중임을 나타내기 위해 `isBusy=true`를 걸고 Task를 실행
2. Task 종료 이후 Buffer를 확인하고 재귀적으로 `run`을 호출하여 Buffer 처리
3. 모든 예약된 Task가 끝나면 busy 상태 초기화

```ts
export class DeferredTaskBuffer<T> {
  // ..
  private async run(task: Task<T>) {
    this.isBusy = true;
    try {
      await task();
    } catch (error) {
      this.onError?.(error);
    } finally {
      const nextTask = this.buffer;
      this.buffer = null;

      // 버퍼에 값이 존재하면 이어서 실행
      if (nextTask) {
        await this.run(nextTask);
      } else {
        this.isBusy = false;
      }
    }
  }
}
```

# 실제 Form에서 활용하기

해당 클래스를 사용하여 실제 자동 저장을 구현하는 사례를 간단히 살펴보자.
유저가 입력한 직후 저장을 시도할 것이므로, input 태그의 onChange 핸들러에서 인스턴스의 schedule 메서드를 호출하기만 하면 된다.

```typescript
const taskBufferRef = useRef(new DeferredTaskBuffer<FormValue[]>({}));

const handleChangeInput = () => {
  taskBufferRef.current.schedule(async () => {
    // ..
    await onSave(formValues);
  });
};

return <Input onChange={handleChangeInput} />;
```

# 버퍼를 큐로 관리하기?

현재 `buffer` 상태의 타입은 `Task<T> | null` 로, 하나의 태스크만 버퍼링되는 구조이다.

그러나 만약 저장이 진행되는 동안 여러 예약 요청이 들어오면 어떻게 될까?
예를 들면 요청 1이 실행되는 5초 동안 1초 간격으로 요청 2, 3, 4 가 들어오는 경우이다.

현재 구현은 가장 마지막으로 들어온 요청만 가지고 있는 구조이다.
위와 같은 케이스를 처리하려면 Buffer를 큐로 만들어서 순차적으로 처리하면 될 것이다.

그렇지만 대부분의 저장 플로우에서, 마지막 저장 태스크가 이전의 이루어진 변경사항들을 모두 포함한다.
이런 상황에서 큐로 관리하면 데이터의 중간 단계들을 불필요하게 계속 저장하게 되고, 정작 중요한 최종 데이터의 저장이 지연될 것이다.
그래서 Queue를 이용하여 모든 요청을 보관하기보다, 마지막으로 들어온 요청만 버퍼로 들고 있으면 충분하겠다.

나의 사례에서는 Form 상태 관리에 [react-hook-form](https://www.react-hook-form.com/) 을 사용하였다.
hook-form 라이브러리가 제공하는 `dirtyFields`는 항상 모든 변경 사항을 들고 있었기에,
`dirtyFields`를 이용하여 저장하면 마지막 저장 요청만으로 데이터의 무결성을 보장할 수 있었다.
단, 중복 저장을 방지하기 위해 저장이 성공한 경우 폼 상태를 초기화하여 `dirtyFields`를 갱신할 필요가 있다.

# 최종 코드

```ts
type Task<T> = () => Promise<T>;

interface TaskOptions {
  delayMS?: number;
  onError?: (error: unknown) => void;
}

export class DeferredTaskBuffer<T> {
  private buffer: Task<T> | null;
  private isBusy: boolean;
  private delayTimer: NodeJS.Timeout | null;
  private delayMS: number;
  private onError: ((error: unknown) => void) | undefined;

  constructor(options: TaskOptions) {
    this.buffer = null;
    this.isBusy = false;
    this.delayTimer = null;
    this.delayMS = options.delayMS ?? 1000;
    this.onError = options.onError;
  }

  public schedule(task: Task<T>) {
    // debounce timer가 실행중이면 새 timer로 갱신
    if (this.delayTimer) {
      clearTimeout(this.delayTimer);
    }

    this.delayTimer = setTimeout(async () => {
      this.delayTimer = null;
      // 저장이 진행중이면 buffer에 보관
      if (this.isBusy) {
        this.buffer = task;
        return;
      }
      await this.run(task);
    }, this.delayMS);
  }

  private async run(task: Task<T>) {
    this.isBusy = true;
    try {
      await task();
    } catch (error) {
      this.onError?.(error);
    } finally {
      const nextTask = this.buffer;
      this.buffer = null;

      // 버퍼에 값이 존재하면 이어서 실행
      if (nextTask) {
        await this.run(nextTask);
      } else {
        this.isBusy = false;
      }
    }
  }
}
```

# 결론

이번에 소개한 모듈은 자동 저장이라는 요구사항을 해결하기 위해 설계한 모듈이지만,
자동 저장에 국한하지 않고 순차적으로 비동기 작업을 처리하는데 보편적으로 사용할 수 있다.

이런 이유로 클래스명에 `Save` 류가 아닌 `Task` 가 들어가도록 범용적으로 지었다.
자동 저장은 이 모듈이 해결할 수 있는 문제 중 하나일 뿐이다.
그리고 이 모듈의 핵심은 **race condition** 이 일어나지 않게 예약된 작업들을 순차적으로 처리해주는 것에 있다.

클라이언트를 개발하다보면 비슷한 요구사항을 자주 마주할 수 있는데, 자동 저장 이외에도 **검색 API 호출**, **파일 순차 업로드** 등이 있다.
일반적인 작업이라면 단순히 Debounce만으로도 요구사항을 처리할 수 있겠지만,
자동 저장과 같이 race condition이 절대 일어나지 않아야 하는 상황이라면 얘기가 다르다.

따라서 이런 유틸 모듈을 미리 준비해두면, 반복되는 요구사항을 안정적이고 일관되게 해결할 수 있다.
그리고 필요에 따라 재시도 로직, complete 이벤트 처리 등을 추가하면, 더 다양한 시나리오에도 대응할 수 있을 것이다.

