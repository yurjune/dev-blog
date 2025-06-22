---
date: "2025-06-08T23:50:00+09:00"
title: "Tmux + Neovim에서 undercurl이 적용되지 않는 문제 해결하기"
slug: "undercurl-in-tmux-neovim"
categories: ["Neovim"]
image: "image1.png"
tags: ["Neovim", "tmux"]
keywords: ["Neovim", "tmux"]
comments: true
draft: false
---

Ghostty 터미널을 사용하고 있는데, undercurl을 지원하는 터미널이기 때문에 Neovim에서도 undercurl을 정상적으로 표시할 수 있다.
터미널이 undercurl을 지원하는지는 다음 명령어를 통해 확인할 수 있다.

```bash
# undercurl 지원 확인
printf '\e[4:3mUndercurl\e[0m\n'

# undercurl 색상 지원 확인
printf '\e[4:3;58:2:255:0:0mRed undercurl\e[0m\n'
```

그러나 터미널에서 undercurl을 지원함에도 불구하고 tmux session으로 Neovim을 실행하면 undercurl이 정상적으로 표시되지 않는다.
구글링 및 AI 를 통해 다음 솔루션을 얻을 수 있었는데, 실제로 문제를 해결하지는 못한다.

```text
# .tmux.conf
set -g default-terminal "screen-256color"
set -as terminal-overrides ',*:Smulx=\E[4::%p1%dm'
set -as terminal-overrides ',*:Setulc=\E[58::2::%p1%{65536}%/%d::%p1%{256}%/%{255}%&%d::%p1%{255}%&%d%;m'
```

## 원인

원인은 tmux가 escape sequence를 처리할 때, undercurl 신호(`\E[4:3m`)를 인지하지 못하는 것이었다.

Neovim은 undercurl을 그리기 위해 신호를 tmux 에 전달하지만 tmux 가 해석하지 못하고 터미널에 올바른 undercurl 신호를 전달하지 못한 것이다.

따라서 tmux가 undercurl 신호를 인지할 수 있게 처리해줘야 하는데, `terminfo` 파일에 underline 관련 capability(`Smulx`) 를 추가해야 한다.

> Smulx 란?
>
> **Sm** = "Set Mode"
>
> **ul** = "underline"
>
> **x** = "extended" (확장)

## 해결

1. 터미널 타입 환경 변수(`$TERM`) 확인

```bash
echo $TERM # ex) tmux-256color
```

2. terminfo file 생성 및 편집

```bash
infocmp > /tmp/${TERM}.ti # /tmp/tmux-256color.ti
nvim /tmp/${TERM}.ti
```

3. terminfo 파일에 다음 line 추가

```text
# ex) tmux-256color.ti

Smulx=\E[4:%p1%dm,
```

4. terminfo 파일 컴파일

```bash
tic -x /tmp/${TERM}.ti
```

5. Smulx 가 잘 추가되었는지 확인

```bash
infocmp -l -x | grep Smulx
```

위 설정을 통해 **undercurl**이 적용된 것을 확인할 수 있다.

![image1](image1.png)
