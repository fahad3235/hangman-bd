// Node unit tests for js/logic.js. Usage: node tests/logic.test.js
const L = require('../js/logic.js');
let failures = 0;
function check(name, cond, extra) {
  console.log((cond ? 'ok - ' : 'FAIL - ') + name + (cond ? '' : ' :: ' + (extra || '')));
  if (!cond) failures++;
}
const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const entry = (w) => ({ word: w, category: 'animals', hintEn: 'h', hintBn: 'h' });

// Word-bank integrity
check('bank has 40 words', L.WORDS.length === 40, String(L.WORDS.length));
check('all words unique', new Set(L.WORDS.map((w) => w.word)).size === 40);
check('all words A-Z only, length 4-9', L.WORDS.every((w) => /^[A-Z]{4,9}$/.test(w.word)));
check('all hints non-empty EN+BN', L.WORDS.every((w) => w.hintEn.length > 3 && w.hintBn.length > 3));
check('all categories valid', L.WORDS.every((w) => L.CATEGORIES.indexOf(w.category) !== -1));
check('10 words per category', L.CATEGORIES.every((c) => L.WORDS.filter((w) => w.category === c).length === 10));

// Difficulty filters
check('easy = length <= 6, non-empty', L.filterByDifficulty(L.WORDS, 'easy').every((w) => w.word.length <= 6) && L.filterByDifficulty(L.WORDS, 'easy').length > 0);
check('hard = length >= 7, non-empty', L.filterByDifficulty(L.WORDS, 'hard').every((w) => w.word.length >= 7) && L.filterByDifficulty(L.WORDS, 'hard').length > 0);
check('easy and hard disjoint', L.filterByDifficulty(L.WORDS, 'easy').every((w) => L.filterByDifficulty(L.WORDS, 'hard').indexOf(w) === -1));
check('pickWord respects category', L.pickWord({ category: 'food', rng: () => 0 }).category === 'food');
check('pickWord avoids excluded word', L.pickWord({ category: 'food', exclude: L.WORDS.filter((w) => w.category === 'food').map((w) => w.word).slice(0, 9), rng: () => 0 }).word === L.WORDS.filter((w) => w.category === 'food')[9].word);

// Gameplay: correct reveals all occurrences
let g = L.createGame(entry('BANANA'), 6);
check('initial revealed all blanks', L.revealedWord(g) === '______');
let r = L.guessLetter(g, 'a');
check('correct guess result', r.result === 'correct');
check('A reveals all 3 positions', L.revealedWord(g) === '_A_A_A');
check('lives unchanged on correct', g.lives === 6);
check('repeat guess blocked, no life lost', L.guessLetter(g, 'a').result === 'repeat' && g.lives === 6);
check('invalid: digit rejected', L.guessLetter(g, '5').result === 'invalid');
check('invalid: multi-char rejected', L.guessLetter(g, 'AB').result === 'invalid');
check('invalid: lowercase accepted as letter', L.guessLetter(g, 'b').result === 'correct');

// Wrong guesses, lose path
g = L.createGame(entry('TIGER'), 2);
L.guessLetter(g, 'Z');
check('wrong guess decrements lives', g.lives === 1 && L.wrongCount(g) === 1);
L.guessLetter(g, 'Q');
check('0 lives => lost', g.status === 'lost' && L.isLost(g));
check('guess after game over => over', L.guessLetter(g, 'T').result === 'over');

// Win path + score
g = L.createGame(entry('FERRY'), 6);
'FERY'.split('').forEach((ch) => L.guessLetter(g, ch));
check('all letters => won', g.status === 'won' && L.isWon(g));
check('win score 100 + 15*lives (6 lives left = 190)', L.scoreForWin(6) === 190);
check('win score with 3 lives left = 145', L.scoreForWin(3) === 145);
g = L.createGame(entry('FERRY'), 6);
L.guessLetter(g, 'Z');
'FERY'.split('').forEach((ch) => L.guessLetter(g, ch));
check('win after 1 wrong: lives 5, score 175', g.lives === 5 && L.scoreForWin(g.lives) === 175);

// Hint
g = L.createGame(entry('MANGO'), 6);
let h = L.useHint(g, () => 0);
check('hint reveals first hidden letter (M with rng 0)', h.result === 'hint' && h.letter === 'M' && L.revealedWord(g) === 'M____');
check('hint does not cost a life', g.lives === 6);
check('second hint blocked', L.useHint(g, () => 0).result === 'blocked');
g = L.createGame(entry('MANGO'), 6);
'MANGO'.split('').forEach((ch) => L.guessLetter(g, ch));
check('hint after win blocked', L.useHint(g, () => 0).result === 'blocked');

console.log(failures === 0 ? 'LOGIC GREEN' : 'LOGIC FAILURES: ' + failures);
process.exit(failures === 0 ? 0 : 1);
