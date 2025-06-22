---
date: "2025-05-05T02:50:15+09:00"
title: "Neovim에서 Leetcode 문제를 풀어보자!"
slug: "leetcode-in-neovim"
categories: ["Neovim"]
image: "image5.png"
tags: ["Neovim", "Leetcode"]
keywords: ["Neovim", "Leetcode"]
comments: true
draft: false
---

안녕하세요! 오늘은 Neovim 플러그인을 하나 소개하려고 합니다.

바로 [leetcode.nvim](https://github.com/kawre/leetcode.nvim/issues) 인데요, Neovim 에디터에서 Leetcode 문제를 풀 수 있는 플러그인입니다!

풀이 화면을 미리 한 번 보여드리자면.. 요렇습니다!
![image1](image1.png)

## 플러그인 설치

먼저 플러그인을 설정을 만들어줍니다. Lazy 패키지 매니저를 사용하신다면:

```lua
return {
    "kawre/leetcode.nvim",
    build = ":TSUpdate html", -- if you have `nvim-treesitter` installed
    dependencies = {
        "nvim-telescope/telescope.nvim",
        -- "ibhagwan/fzf-lua",
        "nvim-lua/plenary.nvim",
        "MunifTanjim/nui.nvim",
    },
    opts = {
        -- configuration goes here
    },
}
```

Packer 를 사용하신다면:

```lua
use {
    'kawre/leetcode.nvim',
    run = ':TSUpdate html', -- if you have `nvim-treesitter` installed
    requires = {
        'nvim-telescope/telescope.nvim',
        -- 'ibhagwan/fzf-lua',
        'nvim-lua/plenary.nvim',
        'MunifTanjim/nui.nvim',
    },
    config = function()
        -- configuration goes here
    end,
}
```

세션 시작 명령어는 기본적으로 `leetcode.nvim` 이고, `nvim leetcode.nvim` 으로 실행할 수 있습니다.

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

설정이 완료되었으면 Lazy 패키지 매니저에서 플러그인을 설치하고 로드해주거나, Neovim 을 재시작합니다.

```vim
Lazy install leetcode.nvim
Lazy load leetcode.nvim
```

## 로그인

플러그인 설치 후, 터미널에서 `nvim leetcode.nvim` 을 실행하시면 다음 로그인 화면을 보실 수 있습니다.![image2](image2.png)
leetcode.nvim 은 쿠키로 로그인하는 방식으로, [리트코드 홈페이지](https://leetcode.com/)에서 다음과 같이 쿠키를 가져와야합니다.

- 개발자 도구를 열기
- `graphql/` 엔드포인트를 가진 api 를 아무거나 찾아 조회
- resquest header 의 Cookie 값을 그대로 복사해 가져오기

쿠키를 붙여넣으면 바로 로그인 완료! 캐시되어있어 세션을 시작할 때마다 입력할 필요가 없습니다~!![image3](image3.png)

## 문제 풀기

기본적으로 모든 문제를 검색할 수 있고, 데일리 챌린지 문제, 랜덤 문제 기능등을 제공해줍니다!![image4](image4.png)
잔디밭, 난이도 별 푼 문제 수 등의 통계도 statistics 메뉴에서 확인할 수 있어요.

문제를 고르셨으면 이제 코드를 작성해주시고, ![image5](image5.png)

문제를 푸신 이후, `Leet run` 혹은 `Leet test` 명령어로 테스트케이스를 돌려볼 수 있습니다. 그리고 Testcases 패널에서 테스트 케이스도 새로 추가할 수 있구요.![image6](image6.png)

테스트 케이스를 통과하셨다면 제출까지 야무지게 ㅎㅎ![image6](image7.png)

자주 사용하는 명령어들은 단축키로 등록해놓으면 더 편하겠죠?

```lua
  config = function(_, opts)
    require("leetcode").setup(opts)
    vim.keymap.set("n", "<leader>lr", "<cmd>Leet run<CR>", { desc = "Run Leetcode Testcase" })
    vim.keymap.set("n", "<leader>lc", "<cmd>Leet console<CR>", { desc = "Open Leetcode console" })
    vim.keymap.set("n", "<leader>ls", "<cmd>Leet submit<CR>", { desc = "Submit Leetcode answer" })
    vim.keymaprset("n", "<leader>lls", "<cmd>Leet last_submit<CR>", { desc = "Load Leetcode last submit" })
  end,

```

이외에도 `Leet` 명령어를 이용해서 문제 링크 열기, 언어 변경 등의 다양한 기능들을 사용할 수 있습니다.
![image7](image8.png)

## 이미지가 있는 문제 풀기

> 헉 그런데 이미지가 있는 문제인데 이미지가 안보이네요..?

leetcode.nvim 을 사용하면서 이미지를 렌더링하려면, [image.nvim](https://github.com/3rd/image.nvim) 플러그인을 추가로 설치하여야 합니다.
이 플러그인은 [Kitty's grahpics protocol](https://sw.kovidgoyal.net/kitty/graphics-protocol/) 을 활용하여 GUI 를 지원하는 터미널에서 이미지를 렌더링해주는 플러그인입니다.

추가로, 이 **그래픽 프로토콜**을 지원하는 터미널을 사용해야 하는데요,(eg. kitty, ghostty) 그 중 저희는 `ghostty` 라는 아주 힙한 터미널을 사용해보도록 하겠습니다!

- ghostty 는 [Mitchell Hashimoto](https://github.com/mitchellh) 가 만든 터미널로 플랫폼 네이티브 GUI 를 갖추면서 여러 프로토콜을 지원하며, 속도도 매우 빠른 터미널로 알려져 있습니다.
- 기본적으로 아무 설정을 하지 않아도 쉽게 쓸 수 있도록 Zero-config 를 추구하고 만들었다고 합니다. 기본 UI 도 괜찮고, Jetbrains Nerd Mono 를 기본 폰트로 사용하는게 맘에 드네요ㅎㅎ

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

이제 ghostty 에서 이미지가 있는 문제를 열면 이미지가 아주 잘 나오는걸 확인하실 수 있습니다~!![image9](image9.png)

## 문제 목록 필터링하기

Leetcode 문제를 풀다보면 난이도 별로 필터링할 필요가 있는데, 명령어에 파라미터를 주면 `난이도별`, `상태별`, `태그별` 필터링이 가능합니다.

```lua
-- 문제 목록 필터링
Leet list status=<status> difficulty=<difficulty>

-- 랜덤 문제 가져오기 필터링
Leet random status=<status> difficulty=<difficulty> tags=<tags>
```

매번 명령어와 함께 파라미터를 주기 귀찮으니, 단축키를 지정해 놓는 것도 방법입니다.

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

이렇게 Neovim 에서 Leetcode 문제를 풀 수 있는 플러그인에 대해 알아보았습니다~!

개인적으로 익숙한 Neovim 환경에서 문제를 풀 수 있으니 웹에서 푸는 것 보다 집중도 잘되고 빠르게 풀 수 있어서 아주 유용하게 사용하고 있는 플러그인입니다.

추가적으로 즐겨찾는 문제 가져오기, 실행했을 때 마지막으로 푼 문제 가져오기와 같은 기능도 있었으면 더 좋았을 것 같은데, 아쉽지만 향후 추가될 확률은 거의 없어보이네요. 그래도 현재 있는 기능으로도 충분히 잘 사용할 수 있는 플러그인입니다.
