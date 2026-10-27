// Headless-Chrome smoke test via raw CDP (no puppeteer dependency).
// Usage: node tests/smoke.js
// Exits non-zero on any failed assertion; fails on page console errors.
const { spawn } = require('child_process');
const http = require('http');
const path = require('path');

const PORT = 9342;
const FILE = 'file://' + path.resolve(__dirname, '..', 'index.html') + '?test=1';
let failures = 0;
const pageErrors = [];
function check(name, cond, extra) {
  console.log((cond ? 'ok - ' : 'FAIL - ') + name + (cond ? '' : ' :: ' + (extra || '')));
  if (!cond) failures++;
}
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
async function poll(fn, timeoutMs) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try { if (await fn()) return true; } catch (e) { /* retry */ }
    await wait(200);
  }
  return false;
}

(async () => {
  const chrome = spawn('/opt/meta-chromium/chrome', [
    '--headless=new', '--no-sandbox', '--disable-gpu',
    '--remote-debugging-port=' + PORT, '--user-data-dir=/tmp/hangman-smoke-' + process.pid,
    'about:blank',
  ], { stdio: 'ignore' });
  let targets = [];
  for (let i = 0; i < 50 && targets.length === 0; i++) {
    await wait(200);
    try {
      targets = JSON.parse(await new Promise((res, rej) => {
        http.get('http://127.0.0.1:' + PORT + '/json/list', (r) => {
          let d = ''; r.on('data', (c) => (d += c)); r.on('end', () => res(d));
        }).on('error', rej);
      }));
    } catch (e) { /* retry */ }
  }
  if (!targets.length) { console.log('FAIL - chrome did not start'); process.exit(2); }
  const wsUrl = targets[0].webSocketDebuggerUrl;
  const ws = new WebSocket(wsUrl);
  await new Promise((res) => { ws.onopen = res; });
  let seq = 0; const pending = new Map();
  ws.onmessage = (m) => {
    const msg = JSON.parse(m.data);
    if (msg.id && pending.has(msg.id)) { pending.get(msg.id)(msg); pending.delete(msg.id); }
    if (msg.method === 'Runtime.consoleAPICalled' && msg.params.type === 'error') {
      pageErrors.push(JSON.stringify(msg.params.args));
    }
    if (msg.method === 'Runtime.exceptionThrown') {
      pageErrors.push(JSON.stringify(msg.params.exceptionDetails).slice(0, 300));
    }
  };
  const send = (method, params) => new Promise((res) => {
    const id = ++seq; pending.set(id, res); ws.send(JSON.stringify({ id, method, params }));
  });
  await send('Page.enable'); await send('Runtime.enable');
  await send('Page.navigate', { url: FILE });
  await wait(1500);
  const ev = async (expr) => {
    const r = await send('Runtime.evaluate', { expression: expr, returnByValue: true });
    if (r.result && r.result.exceptionDetails) return { error: JSON.stringify(r.result.exceptionDetails).slice(0, 300) };
    return r.result ? r.result.result.value : undefined;
  };

  check('page title contains Hangman', (await ev('document.title'))?.includes('Hangman'));
  check('26 keyboard buttons rendered', (await ev(`document.querySelectorAll('#keyboard button').length`)) === 26);
  check('word display has blanks', (await ev(`document.querySelectorAll('#wordDisplay span').length`)) > 0);
  check('gallows svg present', (await ev(`!!document.getElementById('gallows')`)) === true);
  check('lives start at 6', (await ev(`document.getElementById('lives').textContent`)) === '6');

  // Play the current word to a win via test hooks.
  const word = await ev(`window.__hangman.getWord()`);
  check('test hook exposes a word', typeof word === 'string' && word.length >= 4, String(word));
  const letters = [...new Set(word.split(''))];
  for (const ch of letters) await ev(`window.__hangman.guess('${ch}')`);
  check('game won after guessing all letters', await poll(async () =>
    (await ev(`window.__hangman.getStatus()`)) === 'won', 3000));
  check('end panel visible after win', (await ev(`document.getElementById('endPanel').hidden`)) === false);
  check('win increments wins stat to 1', (await ev(`document.getElementById('statWins').textContent`)) === '1');
  check('score is 100 + 15*lives (>=100)', Number(await ev(`document.getElementById('statScore').textContent`)) >= 100);

  // New game, then lose it with 6 wrong letters.
  await ev(`window.__hangman.newGame()`);
  check('new game is playing', (await ev(`window.__hangman.getStatus()`)) === 'playing');
  const word2 = await ev(`window.__hangman.getWord()`);
  const wrongs = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').filter((c) => !word2.includes(c)).slice(0, 6);
  check('found 6 wrong letters', wrongs.length === 6, wrongs.join(''));
  for (const ch of wrongs) await ev(`window.__hangman.guess('${ch}')`);
  check('game lost after 6 wrong guesses', await poll(async () =>
    (await ev(`window.__hangman.getStatus()`)) === 'lost', 3000));
  check('lives show 0 after loss', (await ev(`document.getElementById('lives').textContent`)) === '0');
  check('all 6 gallows parts visible', (await ev(`['partHead','partBody','partArmL','partArmR','partLegL','partLegR'].filter(id => document.getElementById(id).style.display !== 'none').length`)) === 6);
  check('losses stat is 1', (await ev(`document.getElementById('statLosses').textContent`)) === '1');
  check('streak reset to 0 after loss', (await ev(`document.getElementById('statStreak').textContent`)) === '0');

  // Hint: new game, hint reveals a letter without costing a life.
  await ev(`window.__hangman.newGame()`);
  const livesBefore = Number(await ev(`window.__hangman.getLives()`));
  await ev(`document.getElementById('hintBtn').click()`);
  check('hint reveals at least one letter', await poll(async () =>
    (await ev(`window.__hangman.getRevealed()`)).includes('A') ||
    (await ev(`window.__hangman.getRevealed()`)).replace(/_/g, '').length >= 1, 3000));
  check('hint does not cost a life', (await ev(`window.__hangman.getLives()`)) === livesBefore);
  check('hint button disabled after use', (await ev(`document.getElementById('hintBtn').disabled`)) === true);

  // Language toggle + Bengali digits.
  await ev(`document.getElementById('langBtn').click()`);
  check('html lang switches to bn', (await ev(`document.documentElement.lang`)) === 'bn');
  check('lang button now reads English', (await ev(`document.getElementById('langBtn').textContent`)) === 'English');
  check('wins stat uses Bengali digits', /[\u09e6-\u09ef]/.test(String(await ev(`document.getElementById('statWins').textContent`))), String(await ev(`document.getElementById('statWins').textContent`)));
  check('stats persist in localStorage', typeof (await ev(`localStorage.getItem('hangman-bd-stats')`)) === 'string');

  // 390px mobile check via emulation.
  await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
  await wait(600);
  const overflow = await ev(`document.documentElement.scrollWidth > 390 + 5`);
  check('390px viewport: no horizontal overflow', overflow === false, 'scrollWidth exceeded');
  check('no page console/exception errors', pageErrors.length === 0, pageErrors.join(' | '));

  ws.close(); chrome.kill();
  console.log(failures === 0 ? 'SMOKE GREEN' : 'SMOKE FAILURES: ' + failures);
  process.exit(failures === 0 ? 0 : 1);
})().catch((e) => { console.error('SMOKE HARNESS ERROR', e); process.exit(2); });
