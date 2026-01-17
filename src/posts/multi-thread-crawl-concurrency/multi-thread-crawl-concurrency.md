---
date: "2026-01-16T00:00:00+09:00"
title: "Rust로 멀티스레드 크롤러 만들기(1) - 병렬 크롤링과 동시성 처리"
slug: "multi-thread-crawl-concurrency"
image: ""
tags: ["Rust"]
keywords: ["러스트", "Rust", "스레드", "멀티스레드", "크롤링", "동시성", "병렬"]
comments: true
draft: false
---

이번에 이직을 위해 프론트엔드 채용 공고를 한눈에 훑어보면서 Rust 언어도 공부해 볼 겸 채용 공고 크롤러를 만들어보았다.
각 공고들의 다음 정보들을 모아 CSV 파일로 정리하는게 목적이었다.

- ex) 공고 제목, 회사, 경력, 마감일, 근무지, 평점, 리뷰 수, ..

내가 모으려던 정보는 대부분 기본적인 정보였기에 채용 공고 목록 페이지만 크롤링해도 충분했다.
그러나 어떤 사이트는 공고 목록에서 얻을 수 있는 정보가 한정되있었고(공고 마감일이 나와있지 않다던지),
평점/리뷰 수 같은 경우에는 외부 사이트에서 회사를 추가로 크롤링해야 했었다.

이런 경우 공고/회사 별로 개별 상세페이지를 크롤링해야했기에, 크롤링할 페이지가 많다.
이 때 멀티스레드로 수백개의 페이지를 동시에 크롤링하여 작업 속도를 올려보고자 하였다.
물론 너무 빠르게 크롤링할 경우 IP가 막히거나 할 수 있는데, 이건 크롤링하는 사이트에 맞게 알아서 조절해주면 된다.

## 크롤링 파이프라인

다음 일련의 작업을 수행하는 크롤링 파이프라인을 만들었다.
먼저 공고 목록을 훑어 데이터 소스를 수집하고, 부가적으로 필요한 데이터를 붙이는 형태로 진행하기 위해서이다.

1. 공고 목록 크롤링
2. (필요시) 각 공고 상세 페이지 크롤링
3. (필요시) 회사의 평점/리뷰 수집
4. csv 로 저장

```rust
fn main() -> Result<()> {
    CrawlPipeline::new()
        // 1. 공고 목록 크롤링
        .crawl(MyClient::new(MyClientCrawlConfig {
            category: MyClientJobCategory::Development,
            subcategory: MyClientJobSubcategory::Frontend,
            total_pages: 50,
            min_years: 0,
            max_years: 5,
            full_crawl: true, // 2. 각 공고 상세 페이지 추가 크롤링
            thread_count: 8,
        }))?
        .save_and_then("jobs.csv")
        // 3. 외부 사이트에서 회사 평점/리뷰 수집
        .enrich(MyEnricher::new(MyEnricherConfig { thread_count: 1 })) 
        // 4. CSV로 저장
        .save("jobs.csv");

    Ok(())
}
```

## 멀티 스레드 병렬 크롤링으로 속도 개선하기

멀티 스레드 크롤링을 위해 다음 크레이트를 활용하였다.

- `headless_chrome`: 백그라운드 크롬 브라우저
- `scraper`: HTML 파싱 도구
- `rayon`: 데이터 병렬 처리 도구

먼저 headless-chrome 크레이트로 브라우저 하나를 만들고, 운용할 스레드 수만큼 탭을 생성한 후, 각 스레드에 1:1로 할당한다.
각 스레드는 자신의 탭 안에서 연속적으로 페이지들을 방문하면서 scraper를 이용하여 문서를 파싱하여 데이터를 수집한다.

다음으로 Rayon 크레이트의 `ThreadPoolBuilder`를 사용하여 스레드 풀을 설치하고 워커 스레드를 생성한다.
Rayon의 `Work-Stealing` 이라는 내부 스케쥴러 덕분에 각 스레드는 자기 작업이 완료되는대로 다음 페이지를 동적으로 분배받는다.

```rust
fn fetch_all_jobs(
    &self,
    browser: &headless_chrome::Browser,
    url: &str,
    total_pages: usize,
    num_threads: usize,
) -> Result<Vec<Job>> {
    let pool = ThreadPoolBuilder::new().num_threads(num_threads).build()?;
    let tabs: HashMap<_, _> = (0..num_threads)
        .map(|i| (i, browser.new_tab().unwrap()))
        .collect();

    let all_jobs: Vec<Job> = pool.install(|| {
        (1..=total_pages)
            .into_par_iter()
            .flat_map(|page| {
                let thread_index = rayon::current_thread_index().unwrap();
                let tab = &tabs[&thread_index];
                let url = self.build_page_url(url, page);
                let result = self.fetch_jobs(tab, &url);

                match result {
                    Ok(page_jobs) => {
                        println!("[Thread {:?}] 완료: 페이지 {}", thread_index, page);
                        page_jobs
                    }
                    Err(e) => {
                        eprintln!("[Thread {:?}] 실패: (페이지 {}): {}", thread_index, page, e);
                        Vec::new()
                    }
                }
            })
            .collect()
    });

    Ok(all_jobs)
}
```


## 스레드 안정성: 읽기 전용 공유 데이터

다수의 스레드를 사용할 때 스레드끼리 동일한 데이터를 참조하거나, 데이터를 변경시킬 일이 생길 수 있다.
이 때 스레드 외부 데이터를 안정적으로 읽기 위한 방법이 필요하다.
위 코드에서는 각 스레드가 사용할 탭을 가져오기 위해 HashMap 이라는 데이터를 공통으로 참조한다.

```rust
    let tabs: HashMap<_, _> = (0..num_threads)
        .map(|i| (i, browser.new_tab().unwrap()))
        .collect();

    let all_jobs: Vec<Job> = pool.install(|| {
    (1..=total_pages)
        .into_par_iter()
        .flat_map(|page| {
            let thread_index = rayon::current_thread_index().unwrap();
            let tab = &tabs[&thread_index];  // 클로저 내부에서 &tabs 로 참조

```

처음에는 Arc 포인터로 HashMap 감싸야하지 않나 싶었다.
왜냐하면 각 스레드가 클로저 스코프 외부 값을 참조할 경우 해당 참조의 라이프타임이 보장되지 않을 수 있다고 생각했다.
그러나 그럴 필요가 없었는데 Rayon의 스코프 기반 병렬성(scoped parallelism) 덕분이었다.

Rayon의 `pool.install()`은 동기함수처럼 스레드의 모든 작업이 완료될 때까지 블로킹한다.
즉 `pool.install()`의 클로저가 종료되기 전까지는 이후 코드 실행을 블로킹해서, 그 동안 tabs 참조의 라이프타임이 보장되므로 안전한 참조가 가능하다.

이는 `thread::scope` 가 스코프 병렬성을 보장하는 것과 같은 원리이다.

```rust
let tabs = HashMap::new();

thread::scope(|scope| {
    scope.spawn(|| {
        &tabs;
    })
})  // 모든 스레드가 완료되어야 스코프 종료가 보장
```

만약 `thread::scope` 없이 외부 데이터를 참조하면 라이프타임이 보장되지 않는다.

```rust
let tabs = HashMap::new();

thread::spawn(|| {
    &tabs; // 참조 시점에 tabs가 살아있음이 보장되지 않음
})
```

`thread::scope` 를 사용하고 싶지 않다면, Arc 포인터를 사용하여 참조 카운팅을 해주면 된다.

```rust
let tabs = Arc::new(HashMap::new());
let tabs_clone = Arc::clone(&tabs);  // 참조 카운트 증가

thread::spawn(move || {
    // tabs_clone의 소유권을 스레드로 이동
    let tab = &tabs_clone[&0];
});
```

## 스레드 안전성: 스레드의 동시 상태 수정

여러 스레드가 데이터를 읽을 뿐만 아니라 동시에 데이터를 써야하는 상황도 있다.

대량의 공고를 크롤링하다보니, 어느정도 진행되었는지 알기 위해 각 작업 별로 로깅을 해주고 있다.
처음의 코드 예시처럼 정해진 페이지들을 병렬 크롤링하는 경우 페이지 정보를 알고 있으므로 진행 상태를 알기 쉬웠다.
단지 **"페이지 50 수집 완료"** 라는 로깅을 남기면 50페이지 정도 왔구나 할 수 있다.

그러나 각 공고의 **상세 페이지**를 멀티 스레드로 크롤링하는 케이스에서는 페이지 인덱스 정보가 따로 없어 진행 상태를 알기 어려웠다.
이를 위해 스레드 별로 공유할 수 있는 카운터 상태를 만들 필요가 있었다.

### 공유 상태 동기화: Mutex vs 원자적 타입

여러 스레드가 '카운터'라는 데이터를 동시에 수정하게 되므로, data race 문제를 해결해야만 한다.
이런 경우 `Mutex` 나 원자적 타입(`AtomicBool`, `AtomicUsize`) 같은 스레드 동기화 인터페이스를 사용하면 된다.

- Mutex는 락(lock)을 사용하여 한 번에 하나의 스레드만 접근하도록 보장한다.
- 원자적 타입(Atomic*)은 CPU 명령어 수준에서 원자적 연산을 통해 락 없이도 안전한 동시 접근을 제공한다.

```rust
    fn fetch_all_job_detail(
        &self,
        browser: &headless_chrome::Browser,
        jobs: Vec<Job>,
        num_threads: usize,
    ) -> Result<Vec<Job>> {
        let pool = ThreadPoolBuilder::new().num_threads(num_threads).build()?;
        let tabs: HashMap<_, _> = (0..num_threads)
            .map(|i| (i, browser.new_tab().unwrap()))
            .collect();
        let total = jobs.len();

        // 원자적 타입
        let counter = AtomicUsize::new(1); 

        let jobs_with_details: Vec<Job> = pool.install(|| {
            jobs.into_par_iter()
                .map(|mut job| {
                    let thread_index = rayon::current_thread_index().unwrap();
                    let tab = &tabs[&thread_index];
                    let result = self.fetch_job_detail(tab, &job.url);

                    // 원자적 연산으로 값 쓰기
                    let count = counter.fetch_add(1, Ordering::Relaxed);

                    match result {
                        Ok(deadline) => {
                            println!(
                                "[Thread {:?}] {}/{} 완료: {}",
                                thread_index, count, total, job.title
                            );
                            job.deadline = deadline.unwrap_or_default();
                        }
                        Err(e) => {
                            eprintln!(
                                "[Thread {:?}] {}/{} 실패 ({}): {}",
                                thread_index, count, total, job.title, e
                            );
                        }
                    }
                    job
                })
                .collect()
        });

        Ok(jobs_with_details)
    }
```

### 원자적이란?

원자적이라는 것은 더 이상 쪼갤 수 없는 단위로 묶여있다는 것을 의미한다.(쿼크를 떠올리지는 말자..)

원자적 연산을 예시로 들면, 연산 중간 과정에 다른 것이 끼어들 수 없음을 의미한다.
그래서 원자적으로 연산한다는 것은, CPU가 연산을 하나의 명령으로 처리하여 중간에 다른 명령이 끼어들 수 없게 하는 것이다.
즉, `counter.fetch_add` 를 호출하면 연산 중간에 다른 스레드에서 카운터를 수정해버리는 일이 없게 된다.

단순 카운터 증가 연산에는 원자적 타입만으로 충분하므로 `AtomicUsize`를 선택했다.
`Mutex`는 락 획득/해제를 위한 오버헤드가 들어가므로 상대적으로 비효율적이다.
물론 이 오버헤드는 네트워크 I/O에 비해 지극히 미미해서 상관없지만, 그래도 원자적 타입을 쓰는 것이 낫다.

## 마무리

이 글에서는 멀티스레드로 병렬 크롤링할 때 생길 수 있는 가벼운 동시성 문제들을 다뤘다.
러스트는 안전한 동시성 프로그래밍에 굉장히 유리한 언어라고 한다.
러스트의 소유권 모델은 위에서 다룬 HashMap을 불변 참조(borrow) 형태로만 허용하여 여러 스레드가 동시에 데이터를 수정할 수 없음을 컴파일 타임에 보장했었다.
그리고 여러 스레드에서 카운터 데이터를 수정해야 할 때도 `Arc, Atomic*` 과 같은 타입을 이용하여 안전한 동시 쓰기를 구현할 수 있었다.

