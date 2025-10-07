---
date: "2025-05-05T02:50:15+09:00"
title: "Neovim에서 Leetcode 문제를 풀어보자!"
slug: "leetcode-in-neovim"
image: "image5.png"
tags: ["Neovim"]
keywords: ["neovim", "leetcode", "plugin", "네오빔", "리트코드", "플러그인"]
comments: true
draft: false
---

안녕하세요! 오늘은 [leetcode.nvim](https://github.com/kawre/leetcode.nvim/issues) 이라는 플러그인을 소개해드리려고 하는데, Neovim 에서 Leetcode 문제를 풀 수 있는 플러그인입니다!

풀이 화면을 미리 한 번 보여드리자면 아래와 같습니다.
![image1](image1.png)

## 플러그인 설치

먼저 플러그인을 설정을 만들어줍니다.

```lua
-- lazy.nvim
return {
    "kawre/leetcode.nvim",
    dependencies = {
        "nvim-telescope/telescope.nvim",
        "nvim-lua/plenary.nvim",
        "MunifTanjim/nui.nvim",
    },
    opts = {
        -- configuration goes here
    },
}

-- packer.nvim
use {
    'kawre/leetcode.nvim',
    requires = {
        'nvim-telescope/telescope.nvim',
        'nvim-lua/plenary.nvim',
        'MunifTanjim/nui.nvim',
    },
    config = function()
        -- configuration goes here
    end,
}
```

세션 시작 명령어는 기본적으로 `leetcode.nvim` 이고, 터미널에서 `nvim leetcode.nvim` 으로 실행할 수 있습니다.
만약 커맨드 변경을 원한다면, `arg` 필드를 수정해줍니다. 이 방식은 standalone 으로 실행하는 방식으로 다른 Neovim 세션는 독립적인 환경에서 실행됩니다.

```lua
opts = {
    arg = "leet",  -- start session by "nvim leet"
}
```

다음으로 사용하시는 메인 언어를 정의해줍니다. 저는 파이썬을 주로 사용하기 때문에 python3 로 설정해두었습니다. 사용하실 수 있는 언어 목록은 [여기서](https://github.com/kawre/leetcode.nvim?tab=readme-ov-file#lang) 확인하실 수 있어요!

```lua
opts = {
    arg = "leet",  -- start session by "nvim leet"
    lang = "python3",
}
```

## 로그인

플러그인 설치 후, 터미널에서 `nvim leetcode.nvim` 을 실행하시면 다음 로그인 화면을 보실 수 있습니다.
![image2](image2.png)
leetcode.nvim 은 쿠키로 로그인하는 방식으로, [리트코드 홈페이지](https://leetcode.com/)에서 다음과 같이 쿠키를 가져와야합니다.

- 개발자 도구를 열기
- `graphql/` 엔드포인트를 가진 api 를 아무거나 찾아 조회
- resquest header 의 Cookie 값을 그대로 복사해 가져오기

한 번 로그인하면, 쿠키가 캐시되어있어 세션을 시작할 때마다 매 번 입력할 필요가 없습니다!

## 문제 풀기

기본적으로 모든 문제를 검색할 수 있고, **데일리 챌린지 문제**, **랜덤 문제** 와 같은 문제도 가져올 수 있습니다.
![image4](image4.png)

문제를 푸신 이후에는 테스트 케이스를 실행해볼 수 있고, 제출도 가능합니다.
![image6](image6.png)
![image7](image7.png)

이외에도 힌트 조회, 문제 링크 열기, 언어 변경 등의 다양한 기능들을 사용할 수 있습니다.
![image7](image8.png)

## 이미지가 있는 문제 풀기

한 가지 문제는 일반적인 터미널에서는 이미지를 렌더링할 수 없다는 점인데요, 이미지가 있는 문제를 풀 때는 이미지가 나오지 않아 불편할 수 있습니다.
그러나 몇 가지 도구를 통해 이미지가 있는 문제도 Neovim 에서 풀 수 있습니다.
- [Kitty's grahpics protocol](https://sw.kovidgoyal.net/kitty/graphics-protocol/)을 지원하는 터미널
- Neovim 이미지 렌더링 플러그인

그래픽 프로토콜을 지원하는 터미널로는 요즘 힙한 [ghostty](https://github.com/ghostty-org/ghostty) 터미널을 사용해보려고 합니다.
- ghostty 터미널은 [Mitchell Hashimoto](https://github.com/mitchellh) 가 만든 터미널로 플랫폼 네이티브 GUI 를 갖추면서 여러 프로토콜을 지원하며, 속도도 매우 빠른 터미널로 알려져 있습니다.
- 기본적으로 아무 설정을 하지 않아도 쉽게 쓸 수 있도록 Zero-config 를 추구하고 만들었다고 합니다. 기본 UI 도 괜찮고, Jetbrains Nerd Mono 를 기본 폰트로 사용하는게 맘에 드네요ㅎㅎ

이미지 렌더링 플러그인으로는 [image.nvim](https://github.com/3rd/image.nvim) 플러그인을 사용해보도록 하겠습니다.

---

1. 먼저 brew 로 ghostty cask 를 설치해줍니다.

```text
brew install ghostty
```

2. 다음으로 `image.nvim` 플러그인을 설치해줍니다.

```lua
return {
	"3rd/image.nvim",
    event = "VeryLazy",
    build = false,
    opts = {
      backend = "kitty",
      processor = "magick_cli", -- ImageMagick
    },
}
```

3. 마지막으로 imagemagick 을 설치해줍니다! 이것도 brew 를 사용하여 설치합니다.

```text
brew install imagemagick
```

이제 ghostty 에서 이미지가 있는 문제를 열면 이미지가 잘 나오는걸 확인하실 수 있습니다.
![image9](image9.png)

## 문제 목록 필터링하기

특정 조건으로 문제를 필터링하고 싶을 때, 명령어에 파라미터를 주면 `난이도별`, `상태별`, `태그별` 필터링이 가능합니다.

```lua
-- 문제 목록 필터링
Leet list status=<status> difficulty=<difficulty>

-- 랜덤 문제 가져오기 필터링
Leet random status=<status> difficulty=<difficulty> tags=<tags>
```

매번 명령어와 함께 파라미터를 주기 귀찮으니, 단축키를 지정해둡니다.

```lua
vim.keymap.set("n", "<leader>llm", function()
  vim.api.nvim_command("Leet list difficulty=medium")
end, { desc = "Leetcode problem list - medium" })

vim.keymap.set("n", "<leader>lrm", function()
  vim.api.nvim_command("Leet random difficulty=medium")
end, { desc = "Leetcode random problem - medium" })
```

Medium 난이도만 가져온 것을 확인하실 수 있습니다.
![image10](image10.png)

## 마무리

이렇게 Neovim 으로 Leetcode 문제를 풀 수 있는 플러그인에 대해 알아보았는데요, 개인적으로 익숙한 Neovim 환경에서 문제를 풀 수 있으니 웹에서 푸는 것 보다 집중도 잘되고 빠르게 풀 수 있어서 아주 유용하게 사용하고 있는 플러그인입니다.

추가적으로 즐겨찾는 문제 가져오기, 실행했을 때 마지막으로 푼 문제 가져오기와 같은 기능도 있었으면 더 좋았을 것 같은데, 아쉽지만 향후 추가될 확률은 거의 없어보이네요. 그래도 현재 있는 기능으로도 충분히 잘 사용할 수 있는 플러그인입니다.

