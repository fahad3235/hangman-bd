# Hangman BD — Test Results (run #151, 2026-10-27)

## Node unit tests — 30/30 green

`node tests/logic.test.js` — DOM-free logic checks against the shipped `js/logic.js`:

- Bank integrity: 40 words, all unique, all A–Z length 4–9, EN+BN hints non-empty,
  all categories valid, 10 words per category.
- Difficulty filters: Easy = length ≤ 6, Hard = length ≥ 7, disjoint, both non-empty.
- `pickWord`: category filter respected; excluded words avoided (9/10 food words
  excluded → the 10th, PINEAPPLE, picked).
- Gameplay: correct guess reveals all occurrences (BANANA + A → _A_A_A);
  repeat guess blocked with no life lost; digit / multi-char / non-letter rejected;
  lowercase accepted as a letter.
- Lose path: 2-life game, 2 wrong guesses → status `lost`; further guesses → `over`.
- Win path: FERRY guessed in full → `won`; score formula 100 + 15 × lives left
  verified at 6 lives (190), 3 lives (145), 5 lives after 1 wrong (175).
- Hint: first hidden letter revealed with a seeded RNG (MANGO + rng 0 → M);
  no life cost; second hint blocked; hint after win blocked.

## Headless-Chrome smoke — 26/26 green, 0 console/page errors

`node tests/smoke.js` — raw CDP against `/opt/meta-chromium/chrome`, `file://` page:

- Title, 26 keyboard buttons, word blanks, gallows SVG, lives start at 6.
- Full win played through test hooks → end panel visible, wins = 1, score ≥ 100.
- New game → 6 wrong letters → status `lost`, lives 0, all 6 gallows parts visible,
  losses = 1, streak reset to 0.
- Hint click reveals a letter, costs no life, disables the button.
- Language toggle → `lang="bn"`, button reads "English", wins stat in Bengali digits,
  stats present in localStorage.
- 390px viewport: no horizontal overflow.

## Repairs

None. 0 app-logic bugs, 0 test-side fixes — both suites green on first run.
Sources are pure ASCII (Bengali emitted as `\uXXXX` escapes in JS/CSS and numeric
entities in HTML; verified with `grep -P '[^\x00-\x7F]'` returning no matches).
