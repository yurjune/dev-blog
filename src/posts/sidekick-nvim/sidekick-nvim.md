---
date: "2025-10-07T00:00:00+09:00"
title: "Sidekick.nvim - Neovim의 AI Agent + Tab 자동완성 플러그인"
slug: "sidekick-nvim"
image: "sidekick-thumbnail.png"
tags: ["Neovim"]
keywords: ["neovim", "plugin", "sidekick", "네오빔", "플러그인", "AI", "Claude Code", "Codex", "Copilot", ]
comments: true
draft: false
---

안녕하세요, 오늘은 [sidekick.nvim](https://github.com/folke/sidekick.nvim) 이라는 플러그인을 간단히 소개해드리려고 합니다.

**sidekick.nvim** 플러그인은 크게 2가지 기능을 제공합니다.
1. Neovim 에디터와 **AI Agent(Claude, Codex, Copilot, ...)** 의 통합
2. Cursor Tab 기능과 비슷하게 동작하는 **NES(Next Edit Suggestion)** 자동완성 기능

하나씩 알아보도록 하겠습니다.

## 1. CLI 기반 AI Agent 통합

sidekick.nvim은 Neovim 내부에서 **CLI 기반 AI Agent**를 사용할 수 있는 인터페이스를 제공합니다.

기본적으로 우측에 Terminal Buffer를 생성하여 코드 편집과 함께 CLI를 활용할 수 있습니다.
또한 에디터 버퍼 영역에서 선택한 라인의 내용을 Terminal Buffer로 전달하는 등의 편의 기능도 제공합니다.

`Claude, Codex, Copilot` 등 다양한 모델을 CLI로 활용할 수 있는데요, 한 번 Claude CLI를 활용하는 예시를 보여드리겠습니다. 

![cli](sidekick-cli.gif)

### CLI 세션 유지

개인적으로 Neovim 에디터 안에서 AI Agent를 활용하기 위해 꼭 필요하다고 생각했던 기능은 바로 CLI 세션 유지인데요,
개발하다 보면 에디터를 재시작해야 할 때가 종종 있는데 이때 세션이 유지되지 않으면 곤란하겠죠.

다행히도 sidekick에서는 `tmux`나 `zellij` 같은 **터미널 멀티플렉서**와의 통합을 지원하여 Neovim이 종료되어도 CLI 세션이 유지되도록 할 수 있습니다.
기존에 있던 다른 AI Agent 통합 플러그인도 세션 유지 기능을 지원하는지 모르겠지만, sidekick은 기본적으로 지원해주니 매우 편리합니다.

```lua
cli = {
  mux = {
    backend = "tmux",
    enabled = true,
  },
}
```

## 2. Next Edit Suggestion(NES)

Cursor Editor를 사용해보셨다면 Tab 기능을 아주 유용하게 활용하셨을 텐데요, Neovim에도 이제 비슷한 기능을 사용할 수 있게 되었습니다.

바로 Language Server Protocol(LSP) 기반으로 동작하는 Next Edit Suggestion(NES) 기능인데, 코드를 작성하는 동안 다음에 편집할 위치를 예측하고 제안하는 기능을 말합니다.

아래 gif를 보시면 Tab 키를 통해 다음 코드 제안 위치로 이동하고 suggestion을 accept 할 수 있으며, 변경할 코드의 diff가 표시되는 것을 확인할 수 있습니다.

![nes](sidekick-nes.gif)

### 자동완성의 발달과 Next Edit Suggestion

자동완성은 대략적으로 **전통적인 자동완성(traditional completion) → 인라인 자동완성(inline completion) → 다음 편집 제안(next edit suggestion)** 단계로 발전하고 있습니다.

**전통적인 자동완성(traditional completion)** 은 사용자가 코드를 작성하면 현재 커서 위치에서 작성 가능한 코드 조각을 제안하는 방식이었습니다.
LSP 서버는 AST를 분석하여 현재 문맥에 맞는 코드 조각을 제안하고, 사용자는 팝업 메뉴에서 원하는 코드를 선택하여 코드를 완성했습니다.

LLM이 등장한 이후 자동완성은 Copilot과 같은 도구를 통해 현재 작성하는 코드의 문맥을 LLM 모델로 실시간 분석하여
이어서 작성할 코드를 제안하는 **인라인 자동완성(inline completion)** 방식으로 발전했습니다.
보통 ghost text 형태로 인라인으로 표시되어 인라인 자동완성이라고 불리며, 사용자의 패턴을 학습하여 더 나은 제안을 제공할 수 있습니다.

**Next Edit Suggestion**은 인라인 자동완성에서 더 나아가, 사용자가 작성한 코드의 변경 사항을 분석하여 그다음에 편집할 위치를 예측하고 제안합니다.
예를 들면, 어떤 함수 이름을 변경하면 해당 함수가 호출되는 모든 위치를 찾아서 함께 변경할 것을 제안하는 식입니다.

### Copilot LSP와의 통합

sidekick.nvim의 NES 기능은 현재 기준(2025)으로 Copilot LSP 위에서만 동작하므로, `copilot-lsp-server`가 설치되어 있어야 합니다.
npm으로 설치하거나, Mason을 사용하신다면 Mason으로 설치하시면 됩니다.

```bash
npm install -g @github/copilot-language-server
```

```lua
vim.lsp.config('copilot', {
  cmd = {
    "copilot-language-server",
    "--stdio",
  },
  settings = {
    telemetry = {
      telemetryLevel = "all",
    },
  },
  -- copy sign in/out method from https://github.com/neovim/nvim-lspconfig
  on_attach = function(client, bufnr)
    vim.api.nvim_buf_create_user_command(bufnr, "LspCopilotSignIn", function()
      sign_in(bufnr, client)
    end, { desc = "Sign in Copilot with GitHub" })

    vim.api.nvim_buf_create_user_command(bufnr, "LspCopilotSignOut", function()
      sign_out(bufnr, client)
    end, { desc = "Sign out Copilot with GitHub" })
  end,
})

-- Copilot LSP 활성화
vim.lsp.enable({ 'copilot' })
```

## 마무리

이렇게 간단하게 sidekick.nvim 플러그인에 대해 알아보았는데요, 아직 Neovim 0.12 버전이 정식 릴리즈된 것도 아니고 sidekick.nvim도 공개된 지 얼마 되지 않았기 때문에
Neovim 0.12가 정식 릴리즈될 즈음에는 더 완성도 있는 플러그인이 되어있지 않을까 싶습니다.

또한 CLI 기능은 0.12 버전이 아니어도 활용할 수 있으니, 정식 릴리즈 전에 버전을 올리고 싶지 않지만 CLI 기능을 활용해 보고 싶은 분들은 한번 사용해보시는 것도 좋을 것 같습니다!

