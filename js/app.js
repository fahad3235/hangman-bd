// Hangman BD \u2014 UI wiring. Depends on window.HangmanLogic (js/logic.js).
(function () {
  'use strict';
  var L = window.HangmanLogic;
  var $ = function (id) { return document.getElementById(id); };

  var STR = {
    en: {
      tagline: 'Guess the word, one letter at a time.',
      difficulty: 'Difficulty', category: 'Category', newWord: 'New word',
      wins: 'Wins', losses: 'Losses', streak: 'Streak', best: 'Best streak', score: 'Score',
      resetStats: 'Reset stats', livesLeft: 'Lives left', wrongLetters: 'Wrong letters',
      hint: 'Hint', revealLetter: 'Reveal a letter',
      hintNoteHard: 'No hint in Hard mode.',
      hintNoteUsed: 'Hint already used.',
      statusPlaying: 'Guess a letter!',
      statusCorrect: 'Correct! {L} is in the word.',
      statusWrong: 'Wrong! {L} is not in the word.',
      statusRepeat: 'You already tried that letter.',
      howTitle: 'How to play',
      howList: [
        'Guess the hidden word by tapping letters (or typing A-Z on your keyboard).',
        'Each wrong guess draws one part of the hangman. 6 wrong guesses and the game is over.',
        'Win a game to score 100 points plus 15 per life left. Wins in a row build your streak.',
        'Hard mode uses longer words and no hint. Your stats stay on this device only.'
      ],
      footer: 'Hangman BD is a free offline word game. Words are English with Bangla hints; no account, no network requests.',
      endWin: 'You won!', endLose: 'Game over!',
      wordWas: 'The word was:', points: 'points', playAgain: 'Play again',
      categories: { all: 'All categories', animals: 'Animals', food: 'Food', nature: 'Nature', daily: 'Daily life' },
      difficulties: { easy: 'Easy', normal: 'Normal', hard: 'Hard' }
    },
    bn: {
      tagline: '\u098f\u0995\u099f\u09bf \u0995\u09b0\u09c7 \u0985\u0995\u09cd\u09b7\u09b0 \u0985\u09a8\u09c1\u09ae\u09be\u09a8 \u0995\u09b0\u09c7 \u09b6\u09ac\u09cd\u09a6\u099f\u09bf \u09a7\u09b0\u09c1\u09a8\u0964',
      difficulty: '\u0995\u09be\u09a0\u09bf\u09a8\u09cd\u09af', category: '\u09ac\u09bf\u09ad\u09be\u0997', newWord: '\u09a8\u09a4\u09c1\u09a8 \u09b6\u09ac\u09cd\u09a6',
      wins: '\u099c\u09af\u09bc', losses: '\u09aa\u09b0\u09be\u099c\u09af\u09bc', streak: '\u099f\u09be\u09a8\u09be \u099c\u09af\u09bc', best: '\u09b8\u09c7\u09b0\u09be \u099f\u09be\u09a8\u09be \u099c\u09af\u09bc', score: '\u09b8\u09cd\u0995\u09cb\u09b0',
      resetStats: '\u09aa\u09b0\u09bf\u09b8\u0982\u0996\u09cd\u09af\u09be\u09a8 \u09ae\u09c1\u099b\u09c1\u09a8', livesLeft: '\u09ac\u09be\u0995\u09bf \u099c\u09c0\u09ac\u09a8', wrongLetters: '\u09ad\u09c1\u09b2 \u0985\u0995\u09cd\u09b7\u09b0',
      hint: '\u0987\u0999\u09cd\u0997\u09bf\u09a4', revealLetter: '\u098f\u0995\u099f\u09bf \u0985\u0995\u09cd\u09b7\u09b0 \u09a6\u09c7\u0996\u09be\u09a8',
      hintNoteHard: '\u0995\u09a0\u09bf\u09a8 \u09ae\u09cb\u09a1\u09c7 \u0995\u09cb\u09a8\u09cb \u0987\u0999\u09cd\u0997\u09bf\u09a4 \u09a8\u09c7\u0987\u0964',
      hintNoteUsed: '\u0987\u0999\u09cd\u0997\u09bf\u09a4 \u0987\u09a4\u09bf\u09ae\u09a7\u09cd\u09af\u09c7 \u09ac\u09cd\u09af\u09ac\u09b9\u09be\u09b0 \u0995\u09b0\u09be \u09b9\u09af\u09bc\u09c7\u099b\u09c7\u0964',
      statusPlaying: '\u098f\u0995\u099f\u09bf \u0985\u0995\u09cd\u09b7\u09b0 \u0985\u09a8\u09c1\u09ae\u09be\u09a8 \u0995\u09b0\u09c1\u09a8!',
      statusCorrect: '\u09b8\u09a0\u09bf\u0995! {L} \u09b6\u09ac\u09cd\u09a6\u099f\u09bf\u09a4\u09c7 \u0986\u099b\u09c7\u0964',
      statusWrong: '\u09ad\u09c1\u09b2! {L} \u09b6\u09ac\u09cd\u09a6\u099f\u09bf\u09a4\u09c7 \u09a8\u09c7\u0987\u0964',
      statusRepeat: '\u098f\u0987 \u0985\u0995\u09cd\u09b7\u09b0\u099f\u09bf \u0986\u0997\u09c7\u0987 \u099a\u09c7\u09b7\u09cd\u099f\u09be \u0995\u09b0\u09be \u09b9\u09af\u09bc\u09c7\u099b\u09c7\u0964',
      howTitle: '\u09af\u09c7\u09ad\u09be\u09ac\u09c7 \u0996\u09c7\u09b2\u09ac\u09c7\u09a8',
      howList: [
        '\u0985\u0995\u09cd\u09b7\u09b0\u09c7 \u099f\u09cd\u09af\u09be\u09aa \u0995\u09b0\u09c7 (\u0985\u09a5\u09ac\u09be \u0995\u09bf\u09ac\u09cb\u09b0\u09cd\u09a1\u09c7 A-Z \u099f\u09be\u0987\u09aa \u0995\u09b0\u09c7) \u09b2\u09c1\u0995\u09be\u09a8\u09cb \u09b6\u09ac\u09cd\u09a6\u099f\u09bf \u0985\u09a8\u09c1\u09ae\u09be\u09a8 \u0995\u09b0\u09c1\u09a8\u0964',
        '\u09aa\u09cd\u09b0\u09a4\u09bf\u099f\u09bf \u09ad\u09c1\u09b2 \u0985\u09a8\u09c1\u09ae\u09be\u09a8\u09c7 \u09b9\u09cd\u09af\u09be\u0982\u09ae\u09cd\u09af\u09be\u09a8\u09c7\u09b0 \u098f\u0995\u099f\u09bf \u0985\u0982\u09b6 \u0986\u0981\u0995\u09be \u09b9\u09af\u09bc\u0964 \u09ec\u099f\u09bf \u09ad\u09c1\u09b2 \u09b9\u09b2\u09c7\u0987 \u0996\u09c7\u09b2\u09be \u09b6\u09c7\u09b7\u0964',
        '\u099c\u09bf\u09a4\u09b2\u09c7 \u09e7\u09e6\u09e6 \u09aa\u09af\u09bc\u09c7\u09a8\u09cd\u099f, \u09b8\u0999\u09cd\u0997\u09c7 \u09aa\u09cd\u09b0\u09a4\u09bf \u09ac\u09be\u0995\u09bf \u099c\u09c0\u09ac\u09a8\u09c7\u09b0 \u099c\u09a8\u09cd\u09af \u09e7\u09eb \u09aa\u09af\u09bc\u09c7\u09a8\u09cd\u099f\u0964 \u099f\u09be\u09a8\u09be \u099c\u09af\u09bc \u09ac\u09be\u09a1\u09bc\u09be\u09af\u09bc \u09b8\u09cd\u099f\u09cd\u09b0\u09bf\u0995\u0964',
        '\u0995\u09a0\u09bf\u09a8 \u09ae\u09cb\u09a1\u09c7 \u09b2\u09ae\u09cd\u09ac\u09be \u09b6\u09ac\u09cd\u09a6 \u09a5\u09be\u0995\u09c7, \u0995\u09cb\u09a8\u09cb \u0987\u0999\u09cd\u0997\u09bf\u09a4 \u09a8\u09c7\u0987\u0964 \u0986\u09aa\u09a8\u09be\u09b0 \u09aa\u09b0\u09bf\u09b8\u0982\u0996\u09cd\u09af\u09be\u09a8 \u09b6\u09c1\u09a7\u09c1 \u098f\u0987 \u09a1\u09bf\u09ad\u09be\u0987\u09b8\u09c7\u0987 \u09a5\u09be\u0995\u09c7\u0964'
      ],
      footer: '\u09b9\u09cd\u09af\u09be\u0982\u09ae\u09cd\u09af\u09be\u09a8 \u09ac\u09bf\u09a1\u09bf \u098f\u0995\u099f\u09bf \u09ac\u09bf\u09a8\u09be\u09ae\u09c2\u09b2\u09cd\u09af\u09c7\u09b0 \u0985\u09ab\u09b2\u09be\u0987\u09a8 \u09b6\u09ac\u09cd\u09a6\u09c7\u09b0 \u0996\u09c7\u09b2\u09be\u0964 \u09b6\u09ac\u09cd\u09a6\u0997\u09c1\u09b2\u09cb \u0987\u0982\u09b0\u09c7\u099c\u09bf, \u0987\u0999\u09cd\u0997\u09bf\u09a4 \u09ac\u09be\u0982\u09b2\u09be\u09af\u09bc; \u0995\u09cb\u09a8\u09cb \u0985\u09cd\u09af\u09be\u0995\u09be\u0989\u09a8\u09cd\u099f \u09a8\u09c7\u0987, \u0995\u09cb\u09a8\u09cb \u09a8\u09c7\u099f\u0993\u09af\u09bc\u09be\u09b0\u09cd\u0995 \u0985\u09a8\u09c1\u09b0\u09cb\u09a7 \u09a8\u09c7\u0987\u0964',
      endWin: '\u0985\u09ad\u09bf\u09a8\u09a8\u09cd\u09a6\u09a8! \u0986\u09aa\u09a8\u09bf \u099c\u09bf\u09a4\u09c7\u099b\u09c7\u09a8!', endLose: '\u0996\u09c7\u09b2\u09be \u09b6\u09c7\u09b7!',
      wordWas: '\u09b6\u09ac\u09cd\u09a6\u099f\u09bf \u099b\u09bf\u09b2:', points: '\u09aa\u09af\u09bc\u09c7\u09a8\u09cd\u099f', playAgain: '\u0986\u09ac\u09be\u09b0 \u0996\u09c7\u09b2\u09c1\u09a8',
      categories: { all: '\u09b8\u09ac \u09ac\u09bf\u09ad\u09be\u0997', animals: '\u09aa\u09cd\u09b0\u09be\u09a3\u09c0', food: '\u0996\u09be\u09ac\u09be\u09b0', nature: '\u09aa\u09cd\u09b0\u0995\u09c3\u09a4\u09bf', daily: '\u09a6\u09c8\u09a8\u09a8\u09cd\u09a6\u09bf\u09a8 \u099c\u09c0\u09ac\u09a8' },
      difficulties: { easy: '\u09b8\u09b9\u099c', normal: '\u09b8\u09be\u09a7\u09be\u09b0\u09a3', hard: '\u0995\u09a0\u09bf\u09a8' }
    }
  };

  var BN_DIGITS = ['\u09e6', '\u09e7', '\u09e8', '\u09e9', '\u09ea', '\u09eb', '\u09ec', '\u09ed', '\u09ee', '\u09ef'];
  function fmt(n) {
    var s = String(n);
    if (lang !== 'bn') return s;
    return s.split('').map(function (ch) {
      return (ch >= '0' && ch <= '9') ? BN_DIGITS[ch.charCodeAt(0) - 48] : ch;
    }).join('');
  }

  var lang = 'en';
  try { lang = localStorage.getItem('hangman-bd-lang') || 'en'; } catch (e) {}
  if (STR[lang] === undefined) lang = 'en';

  var stats = { wins: 0, losses: 0, streak: 0, best: 0, score: 0 };
  try {
    var saved = JSON.parse(localStorage.getItem('hangman-bd-stats') || 'null');
    if (saved) stats = saved;
  } catch (e) {}

  var settings = { difficulty: 'normal', category: 'all' };
  try {
    var ss = JSON.parse(localStorage.getItem('hangman-bd-settings') || 'null');
    if (ss) settings = ss;
  } catch (e) {}

  var game = null;
  var recent = [];
  var partIds = ['partHead', 'partBody', 'partArmL', 'partArmR', 'partLegL', 'partLegR'];
  var keyButtons = {};

  function t() { return STR[lang]; }

  function saveStats() {
    try { localStorage.setItem('hangman-bd-stats', JSON.stringify(stats)); } catch (e) {}
  }
  function saveSettings() {
    try { localStorage.setItem('hangman-bd-settings', JSON.stringify(settings)); } catch (e) {}
  }

  function renderStatic() {
    var s = t();
    document.documentElement.lang = lang;
    $('tagline').textContent = s.tagline;
    $('langBtn').textContent = (lang === 'en') ? '\u09ac\u09be\u0982\u09b2\u09be' : 'English';
    $('lblDifficulty').textContent = s.difficulty;
    $('lblCategory').textContent = s.category;
    $('newBtn').textContent = s.newWord;
    $('statWinsLabel').textContent = s.wins;
    $('statLossesLabel').textContent = s.losses;
    $('statStreakLabel').textContent = s.streak;
    $('statBestLabel').textContent = s.best;
    $('statScoreLabel').textContent = s.score;
    $('resetStatsBtn').textContent = s.resetStats;
    $('livesLabel').textContent = s.livesLeft;
    $('wrongLabel').textContent = s.wrongLetters;
    $('hintLabel').textContent = s.hint;
    $('hintBtn').textContent = s.revealLetter;
    $('howTitle').textContent = s.howTitle;
    $('howList').innerHTML = '';
    s.howList.forEach(function (item) {
      var li = document.createElement('li');
      li.textContent = item;
      $('howList').appendChild(li);
    });
    $('footerText').textContent = s.footer;
    $('playAgainBtn').textContent = s.playAgain;
    var dSel = $('difficulty');
    ['easy', 'normal', 'hard'].forEach(function (v, i) { dSel.options[i].textContent = s.difficulties[v]; });
    var cSel = $('category');
    ['all', 'animals', 'food', 'nature', 'daily'].forEach(function (v, i) { cSel.options[i].textContent = s.categories[v]; });
    $('statWins').textContent = fmt(stats.wins);
    $('statLosses').textContent = fmt(stats.losses);
    $('statStreak').textContent = fmt(stats.streak);
    $('statBest').textContent = fmt(stats.best);
    $('statScore').textContent = fmt(stats.score);
  }

  function renderGame() {
    if (!game) return;
    var s = t();
    var revealed = L.revealedWord(game);
    var wd = $('wordDisplay');
    wd.innerHTML = '';
    revealed.split('').forEach(function (ch) {
      var sp = document.createElement('span');
      if (ch === '_') { sp.className = 'blank'; sp.textContent = '_'; }
      else sp.textContent = ch;
      wd.appendChild(sp);
    });
    $('lives').textContent = fmt(game.lives);
    $('wrongLetters').textContent = game.wrong.length ? game.wrong.join(' ') : '\u2014';
    $('hintText').textContent = (lang === 'bn') ? game.hintBn : game.hintEn;
    partIds.forEach(function (id, i) {
      $(id).style.display = (i < L.wrongCount(game)) ? '' : 'none';
    });
    Object.keys(keyButtons).forEach(function (letter) {
      var btn = keyButtons[letter];
      btn.disabled = game.guessed.indexOf(letter) !== -1 || game.status !== 'playing';
      btn.className = '';
      if (game.correct.indexOf(letter) !== -1) btn.className = 'correct';
      else if (game.wrong.indexOf(letter) !== -1) btn.className = 'wrong';
    });
    var hard = settings.difficulty === 'hard';
    $('hintBtn').disabled = hard || game.hintUsed || game.status !== 'playing';
    $('hintNote').textContent = hard ? s.hintNoteHard : (game.hintUsed ? s.hintNoteUsed : '');
    $('endPanel').hidden = game.status === 'playing';
  }

  function setStatus(msg) { $('statusText').textContent = msg; }

  function finishGame() {
    var s = t();
    if (game.status === 'won') {
      var gained = L.scoreForWin(game.lives);
      stats.wins += 1;
      stats.streak += 1;
      if (stats.streak > stats.best) stats.best = stats.streak;
      stats.score += gained;
      $('endTitle').textContent = s.endWin;
      $('endScore').textContent = '+' + fmt(gained) + ' ' + s.points;
    } else {
      stats.losses += 1;
      stats.streak = 0;
      $('endTitle').textContent = s.endLose;
      $('endScore').textContent = '';
    }
    $('endWord').textContent = s.wordWas + ' ' + game.word;
    saveStats();
    renderStatic();
    renderGame();
  }

  function newGame() {
    var entry = L.pickWord({
      category: settings.category,
      difficulty: settings.difficulty,
      exclude: recent
    });
    if (!entry) return;
    recent.push(entry.word);
    if (recent.length > 10) recent.shift();
    game = L.createGame(entry, L.MAX_LIVES);
    $('endPanel').hidden = true;
    setStatus(t().statusPlaying);
    renderGame();
  }

  function guess(letter) {
    if (!game || game.status !== 'playing') return;
    var res = L.guessLetter(game, letter);
    var s = t();
    if (res.result === 'correct') setStatus(s.statusCorrect.replace('{L}', letter));
    else if (res.result === 'wrong') setStatus(s.statusWrong.replace('{L}', letter));
    else if (res.result === 'repeat') setStatus(s.statusRepeat);
    renderGame();
    if (game.status !== 'playing') finishGame();
  }

  function buildKeyboard() {
    var kb = $('keyboard');
    kb.innerHTML = '';
    keyButtons = {};
    'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').forEach(function (letter) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.textContent = letter;
      btn.setAttribute('aria-label', 'Letter ' + letter);
      btn.addEventListener('click', function () { guess(letter); });
      kb.appendChild(btn);
      keyButtons[letter] = btn;
    });
  }

  document.addEventListener('keydown', function (ev) {
    if (/^[a-zA-Z]$/.test(ev.key)) guess(ev.key.toUpperCase());
  });

  $('langBtn').addEventListener('click', function () {
    lang = (lang === 'en') ? 'bn' : 'en';
    try { localStorage.setItem('hangman-bd-lang', lang); } catch (e) {}
    renderStatic();
    renderGame();
    if (game && game.status === 'playing') setStatus(t().statusPlaying);
  });
  $('difficulty').addEventListener('change', function (ev) {
    settings.difficulty = ev.target.value;
    saveSettings();
    newGame();
  });
  $('category').addEventListener('change', function (ev) {
    settings.category = ev.target.value;
    saveSettings();
    newGame();
  });
  $('newBtn').addEventListener('click', newGame);
  $('playAgainBtn').addEventListener('click', newGame);
  $('hintBtn').addEventListener('click', function () {
    if (!game) return;
    var res = L.useHint(game);
    if (res.result === 'hint') {
      setStatus(t().statusCorrect.replace('{L}', res.letter));
      renderGame();
      if (game.status !== 'playing') finishGame();
    } else {
      renderGame();
    }
  });
  $('resetStatsBtn').addEventListener('click', function () {
    stats = { wins: 0, losses: 0, streak: 0, best: 0, score: 0 };
    saveStats();
    renderStatic();
  });

  // Init
  $('difficulty').value = settings.difficulty;
  $('category').value = settings.category;
  buildKeyboard();
  renderStatic();
  newGame();

  // Test hooks (only when ?test=1 is in the URL, for the smoke test).
  if (window.location.search.indexOf('test=1') !== -1) {
    window.__hangman = {
      getWord: function () { return game ? game.word : null; },
      getLives: function () { return game ? game.lives : null; },
      getStatus: function () { return game ? game.status : null; },
      getRevealed: function () { return game ? L.revealedWord(game) : null; },
      guess: function (letter) { guess(letter); },
      newGame: function () { newGame(); }
    };
  }
})();
