---
date: "2026-02-06T00:00:00+09:00"
title: "Rust로 양방향 연결리스트 구현하기(with Rc, Weak, RefCell)"
slug: "rust-doubly-linked-list"
tags: ["Rust", "자료구조"]
keywords: ["자료구조", "data structure", "러스트", "Rust", "연결 리스트", "linked list", "RefCell", "Rc"]
comments: false 
draft: false
---

이번 포스트에서는 Rust로 **양방향 연결리스트 자료구조**를 구현해볼 것이다.

그러기 위해서는 몇 가지 Rust의 스마트 포인터를 알아야 하므로,
먼저 스마트 포인터에 대해 알아보고 그 다음 양방향 연결리스트를 구현해 볼 것이다.

Rust 에는 다양한 스마트 포인터가 존재한다.

- 힙에 데이터를 저장하는 `Box` 타입
- 소유권을 공유하는 `Rc` 타입
- 약한 참조로 순환 참조를 방지하는 `Weak` 타입
- 내부 가변성을 가능하게 하는 `RefCell` 타입
- 기타 Arc, Cell, .. 등등 

이 중에서 양방향 연결리스트에 사용되는 `Rc`, `Weak`, `RefCell` 에 대해 알아볼 것이다.

## Rc (Reference Counting)

Rust에서는 기본적으로 하나의 값에 하나의 소유자만 존재할 수 있다.
그러나 유연성을 위해 때론 공동 소유자가 필요할 때가 있는데, 이 때 사용하는 것이 `Rc` 타입이다.

Rc는 **Reference Counting** 의 줄임말로, 여러 소유자를 허용하고 그 수를 추적하는 타입이다.
Rc 타입은 내부적으로 `strong_count`와 `weak_count`를 관리한다.

`strong_count`는 Rc 타입으로 참조하는 소유자의 수를 나타낸다.
마지막 소유자가 스코프를 벗어나 count가 0이 되면 값에 대한 메모리가 자동으로 해제된다.

`weak_count`는 Weak 타입 참조의 개수로, Weak 타입 섹션에서 마저 설명하려고 한다.

양방향 연결리스트에서는 각 노드를 Rc 타입으로 관리해야 하는데, 이는 각 노드가 여러 소유자를 갖기 때문이다.
우리는 각 노드를 그 앞/뒤 노드가 각각 next, prev로 참조하는 것을 알 수 있다.

```rust
struct DoublyLinkedList {
    size: usize,
    // 만일 head와 tail이 같은 노드를 가리킨다면, 해당 노드를 head/tail이 동시에 소유
    head: Option<Rc<RefCell<Node>>>,
    tail: Option<Rc<RefCell<Node>>>,
}
```

이러한 구도는 트리에서도 자주 볼 수 있는데, 부모 노드가 자식 노드를 참조하면서 자식 노드도 부모를 참조하는 경우이다. 

## Weak

Weak 타입은 어떤 데이터를 약하게 참조하는 타입이다.
약하게 참조한다는 것은 **값에 대한 소유를 주장하지 않으면서, 값에는 접근할 수 있는 것**을 말한다.
이 Weak 타입은 순환 참조를 방지하기 위해 사용한다.

### Rc 참조의 순환 참조 문제

Rc 참조는 항상 **순환 참조로 인한 메모리 누수**를 유발할 위험이 있다.

예를 들어 양방향 연결리스트에서, `A <-> B` 노드가 서로를 Rc 타입으로 참조한다고 하자.
두 노드의 `strong_count`는 모두 2이다(자기 자신과 상대 노드의 의한 참조)

문제는 여기서 각 노드의 Drop이 일어나도, 서로 상대 노드에 의한 참조가 남아 `strong_count`는 영원히 1에 머물게 된다.
어느 한 쪽이 0이 되어야 연쇄적으로 메모리가 해제되는데 그렇지 못하고 교착되어있는 것이다.

### Weak 타입을 이용한 순환 참조의 해결

따라서 두 값이 서로를 참조할 때 **한쪽은 강하게, 한쪽은 약하게 참조하게** 하면 참조의 순환을 끊을 수 있다.
강한 참조의 방향을 단방향으로 제한하여 순환 참조의 고리를 끊는 것이다.

이는 `weak_count`가 **값의 생명주기**에 영향을 주지 않기 때문에 가능하다.
`weak_count`가 남아있어도 `strong_count`만 0이 되면 메모리 해제가 일어나기 때문이다.
그리고 이미 해제된 값에 Weak 참조를 통해 접근하면 None을 얻을 뿐이다.

이처럼 양방향 연결리스트에서도 각 노드의 **next는 Rc 참조로, prev는 Weak 참조로** 구성하면 순환 참조를 방지할 수 있다.

```rust
struct Node {
    val: Val,
    next: Option<Rc<RefCell<Node>>>,    // next 노드는 강하게 참조
    prev: Option<Weak<RefCell<Node>>>,  // prev 노드는 약하게 참조
}
```

## RefCell

### 내부 가변성

Rc 타입은 기본적으로 불변 참조를 반환하여 읽기만을 허용한다.
이는 여러 소유자가 동시에 데이터를 수정하면 메모리 안정성 문제가 발생하기 때문이다.

```rust
let vector = Rc::new(vec![1,2,3]);
let mut ref1 = vector.clone();
let mut ref2 = vector.clone();

// 만약 Rc가 가변 참조를 반환한다면?
ref1.push(4);  // 벡터 재할당 가능
ref2.push(5);  // (X) 댕글링 참조 발생
```

그러나 불변 변수의 데이터를 수정해야될 때가 있는데, 이 때 `RefCell` 타입을 활용한다.

RefCell 타입은 **내부 가변성**을 제공하는 타입이다. 그리고 내부 가변성은 **불변 값의 내부 값을 수정할 수 있는 특성**을 말한다.
RefCell의 내부 가변성 덕분에 불변 참조인 `Rc`에서 `RefCell`을 활용하면 내부 데이터를 수정할 수 있다.

```rust
let vector = Rc::new(RefCell::new(vec![1,2,3]));
let ref1 = vector.clone();
let ref2 = vector.clone();

ref1.borrow_mut().push(4);
ref2.borrow_mut().push(5);
```

양방향 연결 리스트에서 `insert`, `pop` 등이 일어날 때 next, prev 참조를 수정해야 한다.
이 떄 Rc와 함께 RefCell을 활용하면 된다.

```rust
struct Node {
    val: Val,
    next: Option<Rc<RefCell<Node>>>,
    prev: Option<Weak<RefCell<Node>>>,
}
```

### 런타임 빌림 규칙 검사

`RefCell` 타입은 또한 컴파일 타임의 빌림 규칙 검사를 런타임 시점으로 미룰 수 있다.
이는 유연성을 위해 약간의 오버헤드를 감수하고 안전성 검사를 런타임에 수행하는 것이다.
만일 런타임에 빌림 규칙 위반이 발생하면 panic을 발생시켜 프로그램을 안전하게 종료시킨다.

```rust
let vector = Rc::new(RefCell::new(vec![1,2,3]));
let ref1 = vector.clone();
let ref2 = vector.clone();

let borrow1 = ref1.borrow_mut();  // 여기서 가변 빌림, 가변 빌림은 최대 1개
let borrow2 = ref2.borrow_mut();  // 이미 가변 빌림이 존재하므로 런타임 panic
```

## 양방향 연결 리스트 구현하기

### 구조체 정의

먼저 연결리스트 구조체와, 연결리스트의 각 노드 구조체에 대해 정의하자.
양방향 연결리스트임으로 각 노드는 next, prev 참조를 갖는다.

타입 설명에서 언급했듯이, 각 참조는 공유 데이터를 가리키므로 `Rc`/`Weak` 타입으로 선언한다.
소유 관계를 단방향으로 유지하기 위해 next는 Rc 타입으로, prev는 Weak 타입으로 선언하면 된다.
그리고 `Option`으로 감싸지는데, 이는 노드가 존재하지 않을 때를 위함이다.

여기에 각 노드에 내부 가변성을 적용하기 위해 RefCell을 사용해준다. 

```rust
use std::cell::RefCell;
use std::rc::{Rc, Weak};

type Val = i32;

struct Node {
    val: Val,
    next: Option<Rc<RefCell<Node>>>,
    prev: Option<Weak<RefCell<Node>>>,
}

struct DoublyLinkedList {
    size: usize,
    head: Option<Rc<RefCell<Node>>>,
    tail: Option<Rc<RefCell<Node>>>,
}
```

### 생성자 정의

구조체를 정의했다면, 생성자도 가볍게 정의해준다.

```rust
impl Node {
    fn new(val: Val) -> Self {
        Self {
            val,
            next: None,
            prev: None,
        }
    }
}

impl DoublyLinkedList {
    fn new() -> Self {
        Self {
            size: 0,
            head: None,
            tail: None,
        }
    }
}
```

### empty, len

이것도 간단하다.

```rust
impl DoublyLinkedList {
    fn len(&self) -> usize {
        self.size
    }

    fn is_empty(&self) -> bool {
        self.size == 0
    }
}
```

### front, rear

맨 앞 노드와 맨 뒤 노드를 반환하는 메서드를 정의해보자.
연결리스트 구조체에서 head, tail 참조를 관리하므로, head/tail이 참조하는 노드의 val을 반환하면 된다.

```rust
impl DoublyLinkedList {
    fn front(&self) -> Option<Val> {
        self.head.as_ref().map(|head| head.borrow().val)
    }

    fn rear(&self) -> Option<Val> {
        self.tail.as_ref().map(|tail| tail.borrow().val)
    }
}
```

`Option<T>`의 map은 기본적으로 Option을 소비하기 때문에 head가 손상된다.
따라서 `.as_ref` 로 `Option<&T>` 라는 임시값을 만들고 대신 소비하여 원본 head를 보존한다.

앞으로도 노드에 접근할 때는 `node.borrow()` 혹은 `node.borrow_mut()`를 사용할 것이다.
노드의 타입은 `Rc<RefCell<Node>>` 인데, Rc는 Deref Trait를 구현하므로 노드 접근 시 자동으로 RefCell로 역참조된다.
그리고 RefCell을 사용할 때는 borrow 혹은 borrow_mut 사용이 필수이다.

### insert_front, insert_rear

위에서 순환 참조를 막기 위해 next는 Rc로, prev는 Weak로 관리한다고 말했었다.
따라서 노드를 삽입할 때는 두 가지만 신경쓰면 된다.

1. next 참조(Rc) 지정 시 `clone()`을 통해 Rc 카운트를 올린다
2. prev 참조(Weak) 지정 시 기존 Rc 타입을 Weak 타입으로 `downgrade()` 한다.

```rust
impl DoublyLinkedList {
    fn insert_front(&mut self, val: Val) {
        let node = Rc::new(RefCell::new(Node::new(val)));

        match self.head.take() {
            Some(old_head) => {
                // 1. 새 node가 기존 head를 next로 참조:
                // clone으로 Rc 참조 카운트를 올린다.
                node.borrow_mut().next = Some(old_head.clone());
                // 2. 기존 head가 새 노드를 prev로 참조:
                // Rc 타입을 Weak 타입으로 downgrade
                old_head.borrow_mut().prev = Some(Rc::downgrade(&node));
                self.head = Some(node);
            }
            // head가 없는 경우(리스트가 비어있는 경우)
            None => {
                self.head = Some(node.clone());
                self.tail = Some(node);
            }
        }
        self.size += 1;
    }

    fn insert_rear(&mut self, val: Val) {
        let node = Rc::new(RefCell::new(Node::new(val)));
        match self.tail.take() {
            Some(old_tail) => {
                node.borrow_mut().prev = Some(Rc::downgrade(&old_tail));
                old_tail.borrow_mut().next = Some(node.clone());
                self.tail = Some(node);
            }
                self.head = Some(node.clone());
                self.tail = Some(node);
            }
        }
        self.size += 1;
    }
}
```

### pop_front, pop_rear

pop을 수행할 때는 리스트가 비어있는 경우와, 제거된 노드에 대한 참조 관계를 끊는 것만 조심해주면 된다. 

**1. 리스트가 비어있는 경우**

head/tail 노드에 `Option.map()`을 사용하면 값이 없을 때 자동으로 None 처리가 되므로 문제가 없다.
이런 측면에서 Rust의 Option은 참 편한다고 느껴진다.

**2. 제거된 노드에 대한 참조 해제**

Rust에서는 댕글링 참조는 발생하지 않지만 제거된 노드에 대한 참조를 끊지 않으면 메모리 누수가 발생할 수 있다.
Rc로 참조했던 경우 strong_count가 0이 되지 않아 메모리가 해제되지 않는 경우가 그렇다.

Weak로 참조하는 경우는 값에 대한 메모리 해제는 이뤄지지만, weak_count 같은 메타데이터는 아직 남아있다.
또한 논리적으로 존재하지 않는 값에 대한 참조가 남아있는 것이라 혼란을 줄 수 있다.

따라서 어떤 참조의 형태이던 제거되었으면 참조를 끊어주는 것이 올바르다.

```rust
impl DoublyLinkedList {
    fn pop_front(&mut self) -> Option<Val> {
        self.head.take().map(|old_head| {
            let val = old_head.borrow().val;
            self.head = old_head.borrow_mut().next.take();  // take로 old_head를 버림

            // 기존 head의 next 노드가 존재하는 경우:
            if let Some(ref new_head) = self.head {
                // 제거된 노드를 가리키던 prev 참조 초기화
                new_head.borrow_mut().prev = None;
            } else {
                self.tail = None;
            }
            self.size -= 1;
            val
        })
    }

    fn pop_rear(&mut self) -> Option<Val> {
        self.tail.take().map(|old_tail| {
            let val = old_tail.borrow().val;
            self.tail = old_tail
                .borrow_mut()
                .prev
                .as_ref()
                // prev는 Weak인데 tail은 Rc이므로, Weak->Rc upgrade
                .and_then(|weak| weak.upgrade());
            if let Some(ref new_tail) = self.tail {
                // 제거된 노드를 가리키던 next 참조 초기화
                new_tail.borrow_mut().next = None;
            } else {
                self.head = None;
            }
            self.size -= 1;
            val
        })
    }
}
```

### traverse(), traverse_reverse()

디버깅용 순회 메서드이다.

1. 정방향 순회 시에는 Rc 타입인 next를 따라가므로, clone으로 참조 카운트만 올린다.
2. 역방향 순회 시에는 Weak 타입인 prev를 따라가므로, Rc 타입으로 upgrade한다.

```rust
impl DoublyLinkedList {
    fn traverse(&self) {
        let mut node = self.head.clone();
        while let Some(el) = node {
            print!("{} -> ", el.borrow().val);
            node = el.borrow().next.clone();
        }
        println!();
    }

    fn traverse_reverse(&self) {
        let mut node = self.tail.clone();
        while let Some(el) = node {
            print!("{} -> ", el.borrow().val);
            node = el.borrow().prev.as_ref().and_then(|weak| weak.upgrade());
        }
        println!();
    }
}
```

## 최종 코드

```rust
use std::cell::RefCell;
use std::rc::{Rc, Weak};

type Val = i32;

struct Node {
    val: Val,
    next: Option<Rc<RefCell<Node>>>,
    prev: Option<Weak<RefCell<Node>>>,
}

impl Node {
    fn new(val: Val) -> Self {
        Self {
            val,
            next: None,
            prev: None,
        }
    }
}

struct DoublyLinkedList {
    size: usize,
    head: Option<Rc<RefCell<Node>>>,
    tail: Option<Rc<RefCell<Node>>>,
}

impl DoublyLinkedList {
    fn new() -> Self {
        Self {
            size: 0,
            head: None,
            tail: None,
        }
    }

    fn len(&self) -> usize {
        self.size
    }

    fn is_empty(&self) -> bool {
        self.size == 0
    }

    fn front(&self) -> Option<Val> {
        self.head.as_ref().map(|head| head.borrow().val)
    }

    fn rear(&self) -> Option<Val> {
        self.tail.as_ref().map(|tail| tail.borrow().val)
    }

    fn insert_front(&mut self, val: Val) {
        let node = Rc::new(RefCell::new(Node::new(val)));
        match self.head.take() {
            Some(old_head) => {
                node.borrow_mut().next = Some(old_head.clone());
                old_head.borrow_mut().prev = Some(Rc::downgrade(&node));
                self.head = Some(node);
            }
            None => {
                self.head = Some(node.clone());
                self.tail = Some(node);
            }
        }
        self.size += 1;
    }

    fn insert_rear(&mut self, val: Val) {
        let node = Rc::new(RefCell::new(Node::new(val)));
        match self.tail.take() {
            Some(old_tail) => {
                node.borrow_mut().prev = Some(Rc::downgrade(&old_tail));
                old_tail.borrow_mut().next = Some(node.clone());
                self.tail = Some(node);
            }
            None => {
                self.head = Some(node.clone());
                self.tail = Some(node);
            }
        }
        self.size += 1;
    }

    fn pop_front(&mut self) -> Option<Val> {
        self.head.take().map(|old_head| {
            let val = old_head.borrow().val;
            self.head = old_head.borrow_mut().next.take();
            if let Some(ref new_head) = self.head {
                new_head.borrow_mut().prev = None;
            } else {
                self.tail = None;
            }
            self.size -= 1;
            val
        })
    }

    fn pop_rear(&mut self) -> Option<Val> {
        self.tail.take().map(|old_tail| {
            let val = old_tail.borrow().val;
            self.tail = old_tail
                .borrow_mut()
                .prev
                .as_ref()
                .and_then(|weak| weak.upgrade());
            if let Some(ref new_tail) = self.tail {
                new_tail.borrow_mut().next = None;
            } else {
                self.head = None;
            }
            self.size -= 1;
            val
        })
    }

    fn traverse(&self) {
        let mut node = self.head.clone();
        while let Some(el) = node {
            print!("{} -> ", el.borrow().val);
            node = el.borrow().next.clone();
        }
        println!();
    }

    fn traverse_reverse(&self) {
        let mut node = self.tail.clone();
        while let Some(el) = node {
            print!("{} -> ", el.borrow().val);
            node = el.borrow().prev.as_ref().and_then(|weak| weak.upgrade());
        }
        println!();
    }
}

fn main() {
    let mut dl = DoublyLinkedList::new();
    println!("Empty: {}", dl.is_empty());
    println!("Size: {}", dl.len());

    dl.insert_front(3);
    dl.insert_front(2);
    dl.insert_front(1);
    dl.insert_rear(4);
    dl.insert_rear(5);
    dl.insert_rear(6);

    if let Some(front) = dl.front() {
        println!("front: {}", front);
    }
    if let Some(rear) = dl.rear() {
        println!("rear: {}", rear);
    }

    println!("Traverse:");
    dl.traverse();
    println!("Traverse reverse:");
    dl.traverse_reverse();

    dl.pop_front();
    dl.pop_rear();
    println!("Traverse:");
    dl.traverse();
}
```

## 마무리

Rust 이외에도 여러가지 언어로 양방향 연결리스트를 구현해보았었다.

JS/Python은 `=`만으로 참조 관계를 쉽게 다룰 수 있어 가장 간편했고,
C언어는 수동 메모리 관리가 필요하지만 포인터 자체를 다루는 것은 단순했다.

C++의 경우 스마트 포인터를 사용했을 때 역시 순환 참조를 관리해야 하는 점이 조심스러웠고,
Rust는 여기에 소유권, 내부 가변성, 빌림 규칙까지 고려해야하여 확실히 복잡도가 가장 높았다.

그러나 복잡도가 높은 만큼 성능과 안정성 둘 다 챙길 수 있는 Rust이기에, 역시 인생은 Trade-off 라는 것을 다시금 느끼게 되었다.

