---
date: "2026-01-17T00:00:00+09:00"
title: "Rust로 멀티스레드 크롤러 만들기(2) - 트레이트로 크롤링 패턴 추상화하기"
slug: "multi-thread-crawl-trait"
image: ""
tags: ["Rust"]
keywords: ["러스트", "Rust", "트레이트", "trait", "크롤링", "추상화", "인터페이스"]
comments: true
draft: false
---

이전 포스팅에서는 멀티 스레드 크롤러를 사용할 때 발생할 수 있는 동시성 문제에 대해 다루었다.

이번 포스팅에서는 각 웹사이트 구조에 따라 몇 가지 패턴으로 분류되는 크롤링 방식을 **트레이트**로 추상화한 사례를 소개하려고 한다.
이를 통해 새로운 사이트를 크롤링할 때도 기존 트레이트를 이용하여 기본 기능을 재사용하고, 일관된 인터페이스로 다룰 수 있다.

## 트레이트

트레이트(Trait)는 Rust에서 **공통 동작을 정의**하는 인터페이스다.
여러 타입이 같은 트레이트를 구현하면, 해당 타입들을 동일한 방식으로 다룰 수 있다.

트레이트는 메서드 시그니처만 정의할 수도 있고, 기본 구현을 제공할 수도 있다.
이를 통해 공통 로직은 재사용하고, 필요한 부분만 각 타입에서 구현할 수 있다.

```rust
trait Greet {
    fn greet(&self) -> String {
        "Hello!".to_string()  // 기본 구현
    }
}

struct Person;
impl Greet for Person {}  // 기본 구현 사용

struct Robot;
impl Greet for Robot {
    fn greet(&self) -> String {
        "Beep boop!".to_string()  // 오버라이딩
    }
}
```

러스트에는 상속이 존재하지 않고, 트레이트를 통한 기능의 조합(composition)을 선호한다.
즉 무엇이다(is-a) 보다는 무엇을 할 수 있는가가 중요하다.

그래서 한 타입이 여러 트레이트를 구현하여 필요한 기능을 유연하게 선택하고 조합할 수 있도록 한다.
또한 각 트레이트가 하나의 명확한 책임을 가지도록 설계하여, 역할 분리를 명확히 할 수 있다.

## 크롤링을 위한 트레이트 설계

프로젝트의 크롤러는 가장 먼저 공고 목록을 조회하는 것부터 시작한다.
전체 공고 목록을 바탕으로 데이터를 뽑고, 필요에 따라 각 공고의 상세 페이지를 방문하여 추가 데이터를 긁어온다.

대부분의 사이트의 공고 목록은 보통 2가지 방식으로 구현되어있다.
바로 **무한 스크롤(Infinite scroll)** 방식과 **페이지 기반(Paginated)** 방식이다.
그리고 페이지네이션 방식과 관계없이 공통적으로 사용하는 동작도 있을 것이다.

그래서 크게 4가지 유형의 트레이트를 정의하려고 한다.

1. 크롤러 공통 동작 트레이트(`JobCrawler`)
2. 무한 스크롤 방식 트레이트(`JobListInfiniteScrollCrawler`)
3. 페이지 기반 방식 트레이트(`JobListPaginatedCrawler`)
4. 데이터 추출 트레이트(`JobFieldExtractor`)

### 크롤러 공통 동작 트레이트

페이지네이션 방식과 관계없이 공통적으로 사용하는 동작에는 다음과 같은 것이 있다.

- 브라우저를 생성하거나
- 페이지 로딩을 기다리거나

이런 공통 동작을 `JobCrawler` 트레이트로 정의하고 추후 페이지네이션 트레이트들이 이 트레이트를 상속받아 사용하도록 한다.
브라우저 생성은 모든 크롤러가 동일한 방식을 사용하므로 기본 구현을 제공하고,
페이지 로딩 대기는 사이트마다 다른 방식을 사용하므로 구현체에서 정의한다.

```rust
pub trait JobCrawler {
    fn create_browser(&self) -> Result<Browser> {
        let user_agent = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
        Browser::new(LaunchOptions {
            headless: true,
            args: vec![
                &std::ffi::OsString::from(format!("--user-agent={}", user_agent)),
                &std::ffi::OsString::from("--disable-blink-features=AutomationControlled"),
            ],
            ..Default::default()
        })
        .map_err(Into::into)
    };

    fn wait_for_list_page_load(&self, tab: &Arc<Tab>) -> Result<()>;

    fn wait_for_detail_page_load(&self, tab: &Arc<Tab>) -> Result<()>;
}
```

### 무한 스크롤 방식

무한 스크롤 방식은 다음 방식으로 크롤링한다.

1. 페이지 접속 및 파싱
2. 스크롤을 가장 아래로 내리고 추가 데이터 로드 대기
3. 다시 파싱

이 일련의 동작은 무한 스크롤 방식을 사용하는 대부분의 사이트에 적용할 수 있을 것이다.
크롤링할 사이트 페이지 구조에 따라 파싱하는 세부 구현은 다르지만, 파싱을 수행해야 한다는 것은 동일하다.
따라서 이 동작들을 **트레이트**로 정의하고, 사이트 별로 달라지지 않는 동작에만 기본 구현을 넣어준다.

```rust
pub trait JobListInfiniteScrollCrawler: JobCrawler {
    // 1. 스크롤 내리기
    fn go_next_page(&self, tab: &Arc<Tab>) -> Result<()> {
        tab.evaluate("window.scrollTo(0, document.body.scrollHeight)", false)?; // 스크롤
        std::thread::sleep(Duration::from_secs(2));  // 대기
        Ok(())
    }

    // 2. HTML 파싱
    // 웹사이트 구조에 따라 다르므로 구현체에서 정의
    fn parse_html(&self, html: &str) -> Result<Vec<Job>>;

    // 3. 전체 데이터 수집
    fn fetch_all_jobs(
        &self,
        browser: &headless_chrome::Browser,
        url: &str,
        total_pages: usize,
    ) -> Result<Vec<Job>> {
        let tab = browser.new_tab()?;
        tab.navigate_to(url)?;
        self.wait_for_list_page_load(&tab)?;

        // ..중략

        Ok(all_jobs)
    };
}
```

### 페이지 기반 방식

페이지 기반 방식은 대부분 URL Parameter 를 이용하여 페이지를 조절할 수 있게 되어있다.

1. 크롤링할 페이지 수를 정하고 각 스레드에 URL 분배
2. 각 스레드가 병렬적으로 각 페이지 파싱 후 최종 수집

```rust
pub trait JobListPaginatedCrawler: JobCrawler + Sync {
    // 1. 페이지별 URL 생성
    fn build_page_url(&self, base_url: &str, page: usize) -> String;

    // 2. HTML 파싱
    // 웹사이트 구조에 따라 다르므로 구현체에서 정의
    fn parse_job(&self, html: &str) -> Result<Vec<Job>>;

    // 3. 각 페이지에서 데이터 수집
    fn fetch_jobs(&self, tab: &Arc<Tab>, url: &str) -> Result<Vec<Job>> {
        tab.navigate_to(url)?;
        self.wait_for_list_page_load(tab)?;
        let html = tab.get_content()?;
        std::thread::sleep(Duration::from_millis(500));
        self.parse_job(&html)
    }

    // 4. 전체 데이터 수집 및 스레드 관리
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

        // ..중략

        Ok(all_jobs)
    }
}
```


### 트레이트 상속으로 공통 기능 재사용

이제 **트레이트 상속**을 통해 Infinite/Paginated 트레이트가 공통 동작을 상속받아 재사용할 수 있도록 한다.

```rust

pub trait JobListPaginatedCrawler: JobCrawler + Sync {
    fn fetch_jobs(&self, tab: &Arc<Tab>, url: &str) -> Result<Vec<Job>> {
        // ..
        self.wait_for_list_page_load(tab)?; // from Supertrait 
        // .. 
    }
}
```

### 데이터 추출 트레이트

마지막으로 "어떤 데이터를 뽑을 것인가" 에 대한 명세이다.
어떤 공고 사이트든지 크롤러는 다음 형식으로 데이터를 뽑는다.

  - `title`: 채용 공고 제목
  - `company`: 회사명
  - `experience_years`: 경력 요구사항
  - `deadline`: 마감일
  - `location`: 근무지
  - `rating`: 평점
  - `review_count`: 리뷰 개수
  - `url`: 공고 링크

이 데이터에 맞춰 각 컬럼에 해당하는 데이터를 추출하게 하는 명세를 정의한다.
데이터 추출은 HTML 구조에 의존적이므로, 메서드 구현이 모두 제외된 순수 트레이트의 모습과 같다.

```rust
pub trait JobFieldExtractor {
    fn extract_title(&self, fragment: &Html) -> Option<String>;
    fn extract_company(&self, fragment: &Html) -> Option<String>;
    fn extract_experience_years(&self, fragment: &Html) -> Option<String>;
    fn extract_url(&self, fragment: &Html) -> Option<String>;
    fn extract_deadline(&self, fragment: &Html) -> Option<String>;
    fn extract_location(&self, fragment: &Html) -> Option<String>;
}
```

## 모아보기

```rust
// 1. 크롤러 공통 동작 트레이트
pub trait JobCrawler {
    fn create_browser(&self) -> Result<Browser>;
    fn wait_for_list_page_load(&self, tab: &Arc<Tab>) -> Result<()>;
    fn wait_for_detail_page_load(&self, tab: &Arc<Tab>) -> Result<()>;
}

// 2. 무한 스크롤 방식 트레이트
pub trait JobListInfiniteScrollCrawler: JobCrawler {
    fn go_next_page(&self, tab: &Arc<Tab>) -> Result<()>;
    fn parse_html(&self, html: &str) -> Result<Vec<Job>>;
    fn fetch_all_jobs(&self, browser: &Browser, url: &str, total_pages: usize) -> Result<Vec<Job>>;
}

// 3. 페이지 기반 방식 트레이트
pub trait JobListPaginatedCrawler: JobCrawler + Sync {
    fn build_page_url(&self, base_url: &str, page: usize) -> String;
    fn parse_html(&self, html: &str) -> Result<Vec<Job>>;
    fn fetch_jobs(&self, tab: &Arc<Tab>, url: &str) -> Result<Vec<Job>>;
    fn fetch_all_jobs(&self, browser: &Browser, url: &str, total_pages: usize, num_threads: usize) -> Result<Vec<Job>>;
}

// 4. 데이터 추출 트레이트
pub trait JobFieldExtractor {
    fn extract_title(&self, fragment: &Html) -> Option<String>;
    fn extract_company(&self, fragment: &Html) -> Option<String>;
    fn extract_experience_years(&self, fragment: &Html) -> Option<String>;
    fn extract_url(&self, fragment: &Html) -> Option<String>;
    fn extract_deadline(&self, fragment: &Html) -> Option<String>;
    fn extract_location(&self, fragment: &Html) -> Option<String>;
}
```

## 마무리

트레이트를 사용하여 크롤링 패턴을 추상화하니 많은 장점이 생겼다.

- 크롤링할 새로운 사이트가 추가되어도, 많은 동작들을 재구현할 필요가 없다.
- 공통 로직이 수정되어도 트레이트 기본 구현만 수정하면 모든 크롤러에 반영이 되니 유지보수도 쉬워졌다.
- 모든 크롤러들이 동일한 인터페이스를 따르므로 관리하기 쉽고 예측 가능하다.

이처럼 트레이트는 러스트에서 추상화와 코드 재사용을 달성하는 강력한 도구로 사용된다. 

