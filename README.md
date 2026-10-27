# Hangman BD

An offline, bilingual (English / বাংলা) Hangman word-guessing game. Guess the hidden
word one letter at a time before the hangman drawing is complete.

## Features

- **40-word bank** in 4 categories: Animals, Food, Nature, Daily life — each word
  with an English hint and a Bangla hint.
- **3 difficulties**: Easy (words up to 6 letters), Normal (all words),
  Hard (words of 7+ letters, no hint).
- **SVG gallows** that draws one body part per wrong guess (6 lives).
- **One hint per game** (Easy/Normal): reveals a random unrevealed letter, free.
- **Score + streak**: a win scores 100 points plus 15 per life left; consecutive
  wins build a streak. Wins, losses, streak, best streak and score persist in
  localStorage on the device only.
- **Bilingual UI**: EN / বাংলা toggle, persisted, with Bengali digits in Bangla mode.
- **On-screen A–Z keyboard + physical keyboard support**, responsive down to
  390px mobile, zero network requests.

## How to play

Tap letters (or type A–Z) to guess. Correct letters fill the word; wrong letters
draw the hangman. Guess the whole word before 6 wrong guesses to win.

## Run locally

Just open `index.html` in any modern browser — no build step, no server, no
dependencies. (The test hook `window.__hangman` is only exposed with `?test=1`.)

## Tests

```sh
node tests/logic.test.js   # 30 DOM-free logic checks
node tests/smoke.js        # 26 headless-Chrome checks (raw CDP, system Chromium)
```

Test results: see `TEST_RESULTS.md`.

## Project structure

```
index.html        Page structure, gallows SVG, keyboard mount point
css/style.css     Layout, responsive rules
js/logic.js       DOM-free game logic + word bank (shared by app and tests)
js/app.js         UI wiring, i18n, localStorage persistence
tests/            Node unit tests + headless-Chrome smoke test
```

## Limitations

- Words are English (A–Z only) with Bangla hints; there is no Bangla-script
  word mode yet.
- Single-player only; no online leaderboards or accounts.
- Stats live only in the browser's localStorage; clearing site data resets them.

## Status

Factory run #151 (2026-10-27, 10:00 slot). Built, tested and published by the
MUSE Project Factory. Demo-grade offline toy — no fabricated scores or data.
