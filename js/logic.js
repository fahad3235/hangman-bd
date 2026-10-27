// Hangman BD \u2014 DOM-free game logic. Works in browser and Node (for tests).
// Words are English (A-Z only) with English + Bangla hints; the UI is bilingual.
(function (global) {
  'use strict';

  var MAX_LIVES = 6;

  // category keys: animals, food, nature, daily
  var WORDS = [
    // Animals
    { word: 'TIGER', category: 'animals', hintEn: 'Striped big cat of the Sundarbans', hintBn: '\u09b8\u09c1\u09a8\u09cd\u09a6\u09b0\u09ac\u09a8\u09c7\u09b0 \u09a1\u09cb\u09b0\u09be\u0995\u09be\u099f\u09be \u09ac\u09a1\u09bc \u09ac\u09bf\u09a1\u09bc\u09be\u09b2' },
    { word: 'ELEPHANT', category: 'animals', hintEn: 'Largest land animal, with a trunk', hintBn: '\u09b6\u09c1\u0981\u09a1\u09bc\u0993\u09af\u09bc\u09be\u09b2\u09be \u09b8\u09ac\u099a\u09c7\u09af\u09bc\u09c7 \u09ac\u09a1\u09bc \u09b8\u09cd\u09a5\u09b2\u099a\u09b0 \u09aa\u09cd\u09b0\u09be\u09a3\u09c0' },
    { word: 'MONKEY', category: 'animals', hintEn: 'Playful tree-climbing animal', hintBn: '\u0997\u09be\u099b\u09c7 \u099a\u09a1\u09bc\u09be \u099a\u099e\u09cd\u099a\u09b2 \u09aa\u09cd\u09b0\u09be\u09a3\u09c0' },
    { word: 'CROCODILE', category: 'animals', hintEn: 'Long-jawed river reptile', hintBn: '\u09a8\u09a6\u09c0\u09b0 \u09b2\u09ae\u09cd\u09ac\u09be \u099a\u09cb\u09af\u09bc\u09be\u09b2\u0993\u09af\u09bc\u09be\u09b2\u09be \u09b8\u09b0\u09c0\u09b8\u09c3\u09aa' },
    { word: 'BUTTERFLY', category: 'animals', hintEn: 'Colourful winged insect', hintBn: '\u09b0\u0999\u09bf\u09a8 \u09a1\u09be\u09a8\u09be\u0993\u09af\u09bc\u09be\u09b2\u09be \u09aa\u09cb\u0995\u09be' },
    { word: 'DOLPHIN', category: 'animals', hintEn: 'Clever sea mammal', hintBn: '\u09ac\u09c1\u09a6\u09cd\u09a7\u09bf\u09ae\u09be\u09a8 \u09b8\u09be\u09ae\u09c1\u09a6\u09cd\u09b0\u09bf\u0995 \u09b8\u09cd\u09a4\u09a8\u09cd\u09af\u09aa\u09be\u09af\u09bc\u09c0' },
    { word: 'PEACOCK', category: 'animals', hintEn: 'Bird with a splendid tail', hintBn: '\u099a\u09ae\u09ce\u0995\u09be\u09b0 \u09b2\u09c7\u099c\u0993\u09af\u09bc\u09be\u09b2\u09be \u09aa\u09be\u0996\u09bf' },
    { word: 'BUFFALO', category: 'animals', hintEn: 'Strong farm animal used for ploughing', hintBn: '\u099a\u09be\u09b7\u09c7 \u09ac\u09cd\u09af\u09ac\u09b9\u09c3\u09a4 \u09b6\u0995\u09cd\u09a4\u09bf\u09b6\u09be\u09b2\u09c0 \u0997\u09c3\u09b9\u09aa\u09be\u09b2\u09bf\u09a4 \u09aa\u09b6\u09c1' },
    { word: 'SPARROW', category: 'animals', hintEn: 'Small common brown bird', hintBn: '\u099b\u09cb\u099f \u09aa\u09b0\u09bf\u099a\u09bf\u09a4 \u09ac\u09be\u09a6\u09be\u09ae\u09bf \u09aa\u09be\u0996\u09bf' },
    { word: 'PYTHON', category: 'animals', hintEn: 'Large non-venomous snake', hintBn: '\u09ac\u09a1\u09bc \u09a8\u09bf\u09b0\u09cd\u09ac\u09bf\u09b7 \u09b8\u09be\u09aa' },
    // Food
    { word: 'BIRYANI', category: 'food', hintEn: 'Festive spiced rice dish', hintBn: '\u0989\u09ce\u09b8\u09ac\u09c7\u09b0 \u09ae\u09b8\u09b2\u09be\u09a6\u09be\u09b0 \u09ad\u09be\u09a4\u09c7\u09b0 \u09aa\u09a6' },
    { word: 'HILSA', category: 'food', hintEn: "Bangladesh's national fish", hintBn: '\u09ac\u09be\u0982\u09b2\u09be\u09a6\u09c7\u09b6\u09c7\u09b0 \u099c\u09be\u09a4\u09c0\u09af\u09bc \u09ae\u09be\u099b' },
    { word: 'MANGO', category: 'food', hintEn: 'Sweet summer fruit, king of fruits', hintBn: '\u09ae\u09bf\u09b7\u09cd\u099f\u09bf \u0997\u09cd\u09b0\u09c0\u09b7\u09cd\u09ae\u09c7\u09b0 \u09ab\u09b2, \u09ab\u09b2\u09c7\u09b0 \u09b0\u09be\u099c\u09be' },
    { word: 'PITHA', category: 'food', hintEn: 'Traditional winter rice cake', hintBn: '\u0990\u09a4\u09bf\u09b9\u09cd\u09af\u09ac\u09be\u09b9\u09c0 \u09b6\u09c0\u09a4\u09c7\u09b0 \u09aa\u09bf\u09a0\u09be' },
    { word: 'JACKFRUIT', category: 'food', hintEn: "Bangladesh's national fruit", hintBn: '\u09ac\u09be\u0982\u09b2\u09be\u09a6\u09c7\u09b6\u09c7\u09b0 \u099c\u09be\u09a4\u09c0\u09af\u09bc \u09ab\u09b2' },
    { word: 'LENTIL', category: 'food', hintEn: 'Daily dal, a protein-rich pulse', hintBn: '\u09aa\u09cd\u09b0\u09a4\u09bf\u09a6\u09bf\u09a8\u09c7\u09b0 \u09a1\u09be\u09b2, \u09aa\u09cd\u09b0\u09cb\u099f\u09bf\u09a8\u09b8\u09ae\u09c3\u09a6\u09cd\u09a7 \u09b6\u09b8\u09cd\u09af' },
    { word: 'YOGURT', category: 'food', hintEn: 'Sweet curd dessert from Bogura', hintBn: '\u09ac\u0997\u09c1\u09a1\u09bc\u09be\u09b0 \u09ac\u09bf\u0996\u09cd\u09af\u09be\u09a4 \u09ae\u09bf\u09b7\u09cd\u099f\u09bf \u09a6\u0987' },
    { word: 'MUSTARD', category: 'food', hintEn: 'Pungent seed used for oil and paste', hintBn: '\u09a4\u09c7\u09b2 \u0993 \u09ac\u09be\u099f\u09be\u09b0 \u099c\u09a8\u09cd\u09af \u09ac\u09cd\u09af\u09ac\u09b9\u09c3\u09a4 \u099d\u09be\u0981\u099d\u09be\u09b2\u09cb \u09ac\u09c0\u099c' },
    { word: 'COCONUT', category: 'food', hintEn: 'Tropical fruit with sweet water inside', hintBn: '\u09ad\u09c7\u09a4\u09b0\u09c7 \u09ae\u09bf\u09b7\u09cd\u099f\u09bf \u09aa\u09be\u09a8\u09bf\u09b8\u09b9 \u0997\u09cd\u09b0\u09c0\u09b7\u09cd\u09ae\u09ae\u09a3\u09cd\u09a1\u09b2\u09c0\u09af\u09bc \u09ab\u09b2' },
    { word: 'PINEAPPLE', category: 'food', hintEn: 'Spiky sweet-sour tropical fruit', hintBn: '\u0995\u09be\u0981\u099f\u09be\u09af\u09c1\u0995\u09cd\u09a4 \u099f\u0995-\u09ae\u09bf\u09b7\u09cd\u099f\u09bf \u0997\u09cd\u09b0\u09c0\u09b7\u09cd\u09ae\u09ae\u09a3\u09cd\u09a1\u09b2\u09c0\u09af\u09bc \u09ab\u09b2' },
    // Nature
    { word: 'MONSOON', category: 'nature', hintEn: 'Rainy season bringing heavy rain', hintBn: '\u09ad\u09be\u09b0\u09c0 \u09ac\u09c3\u09b7\u09cd\u099f\u09bf \u09a8\u09bf\u09af\u09bc\u09c7 \u0986\u09b8\u09be \u09ac\u09b0\u09cd\u09b7\u09be\u0995\u09be\u09b2' },
    { word: 'RIVER', category: 'nature', hintEn: 'Flowing watercourse, like the Padma', hintBn: '\u09aa\u09cd\u09b0\u09ac\u09be\u09b9\u09ae\u09be\u09a8 \u099c\u09b2\u09a7\u09be\u09b0\u09be, \u09af\u09c7\u09ae\u09a8 \u09aa\u09a6\u09cd\u09ae\u09be' },
    { word: 'SUNDARBAN', category: 'nature', hintEn: "World's largest mangrove forest", hintBn: '\u09ac\u09bf\u09b6\u09cd\u09ac\u09c7\u09b0 \u09ac\u09c3\u09b9\u09a4\u09cd\u09a4\u09ae \u09ae\u09cd\u09af\u09be\u09a8\u0997\u09cd\u09b0\u09cb\u09ad \u09ac\u09a8' },
    { word: 'CYCLONE', category: 'nature', hintEn: 'Violent coastal storm', hintBn: '\u0989\u09aa\u0995\u09c2\u09b2\u09c7 \u0986\u0998\u09be\u09a4 \u09b9\u09be\u09a8\u09be \u09aa\u09cd\u09b0\u099a\u09a3\u09cd\u09a1 \u099d\u09a1\u09bc' },
    { word: 'HARVEST', category: 'nature', hintEn: 'Season of gathering ripe crops', hintBn: '\u09aa\u09be\u0995\u09be \u09ab\u09b8\u09b2 \u09a4\u09cb\u09b2\u09be\u09b0 \u09ae\u09cc\u09b8\u09c1\u09ae' },
    { word: 'SUNRISE', category: 'nature', hintEn: 'First light of the morning', hintBn: '\u09b8\u0995\u09be\u09b2\u09c7\u09b0 \u09aa\u09cd\u09b0\u09a5\u09ae \u0986\u09b2\u09cb' },
    { word: 'RAINFALL', category: 'nature', hintEn: 'Rain measured over a season', hintBn: '\u098f\u0995 \u09ae\u09cc\u09b8\u09c1\u09ae\u09c7 \u09aa\u09b0\u09bf\u09ae\u09be\u09aa \u0995\u09b0\u09be \u09ac\u09c3\u09b7\u09cd\u099f\u09bf\u09aa\u09be\u09a4' },
    { word: 'FOREST', category: 'nature', hintEn: 'Dense land of trees', hintBn: '\u0998\u09a8 \u0997\u09be\u099b\u09aa\u09be\u09b2\u09be\u09af\u09bc \u09ad\u09b0\u09be \u09ad\u09c2\u09ae\u09bf' },
    { word: 'MEADOW', category: 'nature', hintEn: 'Grassy open field', hintBn: '\u0998\u09be\u09b8\u09c7 \u09a2\u09be\u0995\u09be \u0996\u09cb\u09b2\u09be \u09ae\u09be\u09a0' },
    { word: 'THUNDER', category: 'nature', hintEn: 'Loud sound after lightning', hintBn: '\u09ac\u099c\u09cd\u09b0\u09aa\u09be\u09a4\u09c7\u09b0 \u09aa\u09b0\u09c7\u09b0 \u09aa\u09cd\u09b0\u099a\u09a3\u09cd\u09a1 \u09b6\u09ac\u09cd\u09a6' },
    // Daily life
    { word: 'BICYCLE', category: 'daily', hintEn: 'Two-wheeled pedal vehicle', hintBn: '\u09a6\u09c1\u0987 \u099a\u09be\u0995\u09be\u09b0 \u09aa\u09cd\u09af\u09be\u09a1\u09c7\u09b2\u099a\u09be\u09b2\u09bf\u09a4 \u09ac\u09be\u09b9\u09a8' },
    { word: 'UMBRELLA', category: 'daily', hintEn: 'Rain shield you carry', hintBn: '\u09ac\u09c3\u09b7\u09cd\u099f\u09bf \u09a5\u09c7\u0995\u09c7 \u09ac\u09be\u0981\u099a\u09a4\u09c7 \u09ac\u09b9\u09a8 \u0995\u09b0\u09be \u099b\u09be\u09a4\u09be' },
    { word: 'LANTERN', category: 'daily', hintEn: 'Portable lamp for dark nights', hintBn: '\u0985\u09a8\u09cd\u09a7\u0995\u09be\u09b0 \u09b0\u09be\u09a4\u09c7\u09b0 \u09ac\u09b9\u09a8\u09af\u09cb\u0997\u09cd\u09af \u09ac\u09be\u09a4\u09bf' },
    { word: 'NOTEBOOK', category: 'daily', hintEn: 'Bound pages for writing', hintBn: '\u09b2\u09c7\u0996\u09be\u09b0 \u099c\u09a8\u09cd\u09af \u09ac\u09be\u0981\u09a7\u09be\u09a8\u09cb \u0996\u09be\u09a4\u09be' },
    { word: 'FERRY', category: 'daily', hintEn: 'Boat carrying people across a river', hintBn: '\u09a8\u09a6\u09c0 \u09aa\u09be\u09b0\u09be\u09aa\u09be\u09b0\u09c7\u09b0 \u099c\u09a8\u09cd\u09af \u09ae\u09be\u09a8\u09c1\u09b7 \u09ac\u09b9\u09a8\u0995\u09be\u09b0\u09c0 \u09a8\u09cc\u0995\u09be' },
    { word: 'MARKET', category: 'daily', hintEn: 'Place where traders sell goods', hintBn: '\u09ac\u09cd\u09af\u09ac\u09b8\u09be\u09af\u09bc\u09c0\u09b0\u09be \u09aa\u09a3\u09cd\u09af \u09ac\u09bf\u0995\u09cd\u09b0\u09bf \u0995\u09b0\u09c7\u09a8 \u098f\u09ae\u09a8 \u09b8\u09cd\u09a5\u09be\u09a8' },
    { word: 'TEACHER', category: 'daily', hintEn: 'Person who teaches students', hintBn: '\u09b6\u09bf\u0995\u09cd\u09b7\u09be\u09b0\u09cd\u09a5\u09c0\u09a6\u09c7\u09b0 \u09aa\u09a1\u09bc\u09be\u09a8 \u098f\u09ae\u09a8 \u09ac\u09cd\u09af\u0995\u09cd\u09a4\u09bf' },
    { word: 'FARMER', category: 'daily', hintEn: 'Person who grows our food', hintBn: '\u0986\u09ae\u09be\u09a6\u09c7\u09b0 \u0996\u09be\u09a6\u09cd\u09af \u0989\u09ce\u09aa\u09be\u09a6\u09a8 \u0995\u09b0\u09c7\u09a8 \u098f\u09ae\u09a8 \u09ac\u09cd\u09af\u0995\u09cd\u09a4\u09bf' },
    { word: 'BAZAAR', category: 'daily', hintEn: 'Busy traditional marketplace', hintBn: '\u09ac\u09cd\u09af\u09b8\u09cd\u09a4 \u0990\u09a4\u09bf\u09b9\u09cd\u09af\u09ac\u09be\u09b9\u09c0 \u09ac\u09be\u099c\u09be\u09b0' },
    { word: 'HARBOUR', category: 'daily', hintEn: 'Sheltered place for boats and ships', hintBn: '\u09a8\u09cc\u0995\u09be \u0993 \u099c\u09be\u09b9\u09be\u099c\u09c7\u09b0 \u0986\u09b6\u09cd\u09b0\u09af\u09bc\u09b8\u09cd\u09a5\u09b2' }
  ];

  var CATEGORIES = ['animals', 'food', 'nature', 'daily'];

  function filterByDifficulty(words, difficulty) {
    if (difficulty === 'easy') return words.filter(function (w) { return w.word.length <= 6; });
    if (difficulty === 'hard') return words.filter(function (w) { return w.word.length >= 7; });
    return words.slice();
  }

  // opts: { category ('all' or key), difficulty, exclude (array of words), rng (fn) }
  function pickWord(opts) {
    opts = opts || {};
    var pool = WORDS;
    if (opts.category && opts.category !== 'all') {
      pool = pool.filter(function (w) { return w.category === opts.category; });
    }
    pool = filterByDifficulty(pool, opts.difficulty || 'normal');
    var excluded = opts.exclude || [];
    var fresh = pool.filter(function (w) { return excluded.indexOf(w.word) === -1; });
    if (fresh.length === 0) fresh = pool;
    if (fresh.length === 0) return null;
    var rng = opts.rng || Math.random;
    return fresh[Math.floor(rng() * fresh.length)];
  }

  function createGame(entry, maxLives) {
    return {
      word: entry.word,
      category: entry.category,
      hintEn: entry.hintEn,
      hintBn: entry.hintBn,
      lives: (typeof maxLives === 'number' ? maxLives : MAX_LIVES),
      guessed: [],       // letters tried, in order
      correct: [],       // letters correctly guessed
      wrong: [],         // letters wrongly guessed
      hintUsed: false,
      status: 'playing'  // playing | won | lost
    };
  }

  function wrongCount(game) {
    return game.wrong.length;
  }

  function revealedWord(game) {
    return game.word.split('').map(function (ch) {
      return game.correct.indexOf(ch) !== -1 ? ch : '_';
    }).join('');
  }

  function isWon(game) {
    return game.word.split('').every(function (ch) { return game.correct.indexOf(ch) !== -1; });
  }

  function isLost(game) {
    return game.lives <= 0;
  }

  function scoreForWin(livesLeft) {
    return 100 + 15 * livesLeft;
  }

  // Returns { result: 'correct'|'wrong'|'repeat'|'invalid'|'over' }
  function guessLetter(game, raw) {
    if (game.status !== 'playing') return { result: 'over' };
    if (typeof raw !== 'string' || raw.length !== 1) return { result: 'invalid' };
    var letter = raw.toUpperCase();
    if (!/^[A-Z]$/.test(letter)) return { result: 'invalid' };
    if (game.guessed.indexOf(letter) !== -1) return { result: 'repeat' };
    game.guessed.push(letter);
    if (game.word.indexOf(letter) !== -1) {
      game.correct.push(letter);
      if (isWon(game)) game.status = 'won';
      return { result: 'correct' };
    }
    game.wrong.push(letter);
    game.lives -= 1;
    if (isLost(game)) game.status = 'lost';
    return { result: 'wrong' };
  }

  // Reveals one random unrevealed letter. Once per game; blocked when over.
  // Returns { result: 'hint'|'blocked', letter }
  function useHint(game, rng) {
    if (game.status !== 'playing' || game.hintUsed) return { result: 'blocked', letter: null };
    var hidden = [];
    game.word.split('').forEach(function (ch) {
      if (game.correct.indexOf(ch) === -1 && hidden.indexOf(ch) === -1) hidden.push(ch);
    });
    if (hidden.length === 0) return { result: 'blocked', letter: null };
    var r = rng || Math.random;
    var letter = hidden[Math.floor(r() * hidden.length)];
    game.hintUsed = true;
    game.correct.push(letter);
    if (game.guessed.indexOf(letter) === -1) game.guessed.push(letter);
    if (isWon(game)) game.status = 'won';
    return { result: 'hint', letter: letter };
  }

  var api = {
    MAX_LIVES: MAX_LIVES,
    WORDS: WORDS,
    CATEGORIES: CATEGORIES,
    filterByDifficulty: filterByDifficulty,
    pickWord: pickWord,
    createGame: createGame,
    wrongCount: wrongCount,
    revealedWord: revealedWord,
    isWon: isWon,
    isLost: isLost,
    scoreForWin: scoreForWin,
    guessLetter: guessLetter,
    useHint: useHint
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  global.HangmanLogic = api;
})(typeof window !== 'undefined' ? window : globalThis);
