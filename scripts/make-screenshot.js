/*
 * Draws images/lantern-themes.png: six mock VS Code windows, one per theme,
 * overlapping like a fanned deck from the darkest at the back to the lightest
 * in front. Colors are read from the built themes/*.json, so run
 * `npm run build` first.
 *
 * It writes an HTML page and asks a Chromium browser (Edge or Chrome) to
 * capture it headless. Set BROWSER to a browser path to choose one.
 * Run: `npm run screenshot`.
 */

const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const OUT_PNG = path.join(ROOT, 'images', 'lantern-themes.png');

// Back to front.
const DECK = [
  'lantern-abyss-theme.json',
  'lantern-obsidian-theme.json',
  'lantern-nightshade-theme.json',
  'lantern-abyss-light-theme.json',
  'lantern-obsidian-light-theme.json',
  'lantern-nightshade-light-theme.json'
];

const CARD_W = 860;
const CARD_H = 540;
const STEP_X = 150;
const STEP_Y = 56;
const PAD = 40;
const PAGE_W = CARD_W + STEP_X * (DECK.length - 1) + PAD * 2;
const PAGE_H = CARD_H + STEP_Y * (DECK.length - 1) + PAD * 2;

/* ---------- read a theme ---------- */

// Last rule whose scope list contains `scope` wins, as in VS Code.
function tokenColor(theme, scope, fallback) {
  let found;
  for (const r of theme.tokenColors) {
    const scopes = (Array.isArray(r.scope) ? r.scope : String(r.scope || '').split(','))
      .map((s) => s.trim());
    if (scopes.includes(scope) && r.settings && r.settings.foreground) found = r.settings.foreground;
  }
  return found || fallback;
}

function readTheme(file) {
  const theme = JSON.parse(fs.readFileSync(path.join(ROOT, 'themes', file), 'utf8'));
  const c = theme.colors;
  const sem = theme.semanticTokenColors || {};
  const fg = c['editor.foreground'];
  return {
    name: theme.name,
    light: theme.type === 'light',
    editor: c['editor.background'],
    surface: c['panel.background'],
    frame: c['titleBar.activeBackground'],
    elevated: c['editorWidget.background'],
    seam: c['editorGroup.border'],
    fg,
    muted: c['descriptionForeground'],
    gutter: c['editorLineNumber.foreground'],
    gutterActive: c['editorLineNumber.activeForeground'],
    line: c['editor.lineHighlightBackground'],
    cursor: c['editorCursor.foreground'],
    accent: c['tab.activeBorder'],
    activity: c['activityBar.foreground'],
    activityDim: c['activityBar.inactiveForeground'],
    badge: c['badge.background'],
    badgeFg: c['badge.foreground'],
    find: c['editor.findMatchBackground'],
    findBorder: c['editor.findMatchBorder'],
    findHl: c['editor.findMatchHighlightBackground'],
    wordHl: c['editor.wordHighlightBackground'],
    tabInactive: c['tab.inactiveForeground'],
    status: c['statusBar.foreground'],
    shadow: c['widget.shadow'],
    keyword: tokenColor(theme, 'keyword', fg),
    storage: tokenColor(theme, 'storage.type', fg),
    string: tokenColor(theme, 'string', fg),
    number: tokenColor(theme, 'constant.numeric', fg),
    comment: tokenColor(theme, 'comment', fg),
    punct: tokenColor(theme, 'punctuation.separator', fg),
    func: (sem.function && sem.function.foreground) || fg,
    type: (sem.type && sem.type.foreground) || fg,
    param: (sem.parameter && sem.parameter.foreground) || fg,
    term: {
      green: c['terminal.ansiGreen'], cyan: c['terminal.ansiCyan'], blue: c['terminal.ansiBlue'],
      red: c['terminal.ansiRed'], yellow: c['terminal.ansiYellow'], magenta: c['terminal.ansiMagenta']
    }
  };
}

/* ---------- one window ---------- */

// [class, text] runs per line. fh = find highlight, fm = current find match,
// wh = word highlight, caret = cursor.
const CODE = [
  [['c', '// Trim the '], ['c fh', 'wick'], ['c', ' so the flame burns evenly']],
  [['k', 'import'], ['', ' '], ['p', '{'], ['', ' '], ['t', 'Flame'], ['', ' '], ['p', '}'], ['', ' '], ['k', 'from'], ['', ' '], ['s', "'./flame'"], ['p', ';']],
  [],
  [['k', 'interface'], ['', ' '], ['t', 'Wick'], ['', ' '], ['p', '{']],
  [['', '  '], ['wh', 'length'], ['p', ':'], ['', ' '], ['t', 'number'], ['p', ';']],
  [['', '  lit'], ['p', ':'], ['', ' '], ['t', 'boolean'], ['p', ';']],
  [['p', '}']],
  [],
  [['k', 'export function'], ['', ' '], ['f', 'trimWick'], ['p', '('], ['v fh', 'wick'], ['p', ':'], ['', ' '], ['t', 'Wick'], ['p', ','], ['', ' '], ['v', 'mm'], ['', ' '], ['p', '='], ['', ' '], ['n', '2'], ['p', '):'], ['', ' '], ['t', 'Wick'], ['', ' '], ['p', '{']],
  [['', '  '], ['k', 'const'], ['', ' '], ['wh', 'length'], ['', ' '], ['p', '='], ['', ' Math'], ['p', '.'], ['f', 'max'], ['p', '('], ['fm', 'wick'], ['caret', ''], ['p', '.'], ['wh', 'length'], ['', ' '], ['p', '-'], ['', ' mm'], ['p', ','], ['', ' '], ['n', '0'], ['p', ');']],
  [['', '  '], ['k', 'if'], ['', ' '], ['p', '('], ['wh', 'length'], ['', ' '], ['p', '==='], ['', ' '], ['n', '0'], ['p', ')'], ['', ' '], ['p', '{']],
  [['', '    '], ['k', 'return'], ['', ' '], ['p', '{'], ['', ' '], ['p', '...'], ['fh', 'wick'], ['p', ','], ['', ' '], ['wh', 'length'], ['p', ','], ['', ' lit'], ['p', ':'], ['', ' '], ['k', 'false'], ['', ' '], ['p', '};']],
  [['', '  '], ['p', '}']],
  [['', '  '], ['k', 'return'], ['', ' '], ['p', '{'], ['', ' '], ['p', '...'], ['fh', 'wick'], ['p', ','], ['', ' '], ['wh', 'length'], ['', ' '], ['p', '};']],
  [['p', '}']]
];
const CURRENT_LINE = 9;

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

function codeHtml() {
  return CODE.map((runs, i) => {
    const body = runs.map(([cls, text]) => {
      if (cls === 'caret') return '<i class="caret"></i>';
      return cls ? `<span class="${cls}">${esc(text)}</span>` : esc(text);
    }).join('');
    return `<div class="ln${i === CURRENT_LINE ? ' cur' : ''}"><b>${i + 1}</b><span>${body || ' '}</span></div>`;
  }).join('');
}

const ICONS = [
  '<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4"/>',
  '<circle cx="11" cy="11" r="6"/><path d="M20 20l-4.5-4.5"/>',
  '<circle cx="6" cy="6" r="2.5"/><circle cx="6" cy="18" r="2.5"/><circle cx="18" cy="9" r="2.5"/><path d="M6 8.5v7M18 11.5c0 4-6 3-12 4"/>',
  '<rect x="4" y="4" width="7" height="7"/><rect x="13" y="4" width="7" height="7"/><rect x="4" y="13" width="7" height="7"/><rect x="13" y="13" width="7" height="7"/>'
];

function windowHtml(t, i) {
  const vars = {
    editor: t.editor, surface: t.surface, frame: t.frame, elevated: t.elevated, seam: t.seam,
    fg: t.fg, muted: t.muted, gutter: t.gutter, gutterActive: t.gutterActive, line: t.line,
    cursor: t.cursor, accent: t.accent, activity: t.activity, activityDim: t.activityDim,
    badge: t.badge, badgeFg: t.badgeFg, find: t.find, findBorder: t.findBorder, findHl: t.findHl,
    wordHl: t.wordHl, tabInactive: t.tabInactive, status: t.status,
    keyword: t.keyword, string: t.string, number: t.number, comment: t.comment, punct: t.punct,
    func: t.func, type: t.type, param: t.param,
    // Neutral shadows, so they read on both light and dark README backgrounds.
    shadow: t.light ? 'rgba(0,0,0,0.16)' : 'rgba(0,0,0,0.35)'
  };
  const style = Object.entries(vars).map(([k, v]) => `--${k}:${v}`).join(';');
  const term = t.term;
  const icons = ICONS.map((d, n) =>
    `<span class="${n === 0 ? 'on' : ''}"><svg viewBox="0 0 24 24">${d}</svg>${n === 2 ? '<em class="badge">3</em>' : ''}</span>`
  ).join('');
  return `
<div class="win" style="${style};left:${PAD + STEP_X * i}px;top:${PAD + STEP_Y * i}px;z-index:${i + 1}">
  <div class="title"><span class="dots"><i></i><i></i><i></i></span><span class="name">${esc(t.name)}</span><span class="cmd">lantern-lamp</span></div>
  <div class="main">
    <nav class="act">${icons}</nav>
    <section class="ed">
      <div class="group">
        <div class="tabs"><div class="tab on">wick.ts <span class="dot"></span></div><div class="tab">flame.ts</div><div class="tab">oil.json</div></div>
        <div class="code">${codeHtml()}</div>
      </div>
      <div class="term">
        <div class="tb"><span>Problems</span><span>Output</span><span class="on">Terminal</span></div>
        <pre><span style="color:${term.green}">➜</span> <span style="color:${term.cyan}">lantern-lamp</span> <span style="color:${term.blue}">git:(</span><span style="color:${term.red}">main</span><span style="color:${term.blue}">)</span> npm run build
<span style="color:${term.green}">✓</span> built 6 themes in 142 ms
<span style="color:${term.yellow}">warning</span> oil.json: <span style="color:${term.magenta}">"flameColor"</span> is not used</pre>
      </div>
    </section>
  </div>
  <footer class="status"><span>⎇ main*</span><span class="r">Ln 10, Col 30 &nbsp; TypeScript</span></footer>
</div>`;
}

const CSS = `
* { box-sizing: border-box; }
html, body { margin: 0; width: ${PAGE_W}px; height: ${PAGE_H}px; background: transparent; overflow: hidden; }
body { position: relative; font-family: "Segoe UI", system-ui, sans-serif; }
.win { position: absolute; width: ${CARD_W}px; height: ${CARD_H}px; border-radius: 12px; overflow: hidden;
  background: var(--frame); color: var(--fg); font-size: 13px; border: 1px solid var(--seam);
  box-shadow: 0 1px 3px var(--shadow), 0 12px 32px var(--shadow);
  display: grid; grid-template-rows: 34px minmax(0, 1fr) 24px; }
.title { display: flex; align-items: center; gap: 10px; padding: 0 12px; color: var(--muted); font-size: 12px; position: relative; }
.dots { display: flex; gap: 6px; }
.dots i { width: 10px; height: 10px; border-radius: 50%; background: var(--gutter); opacity: .7; }
.name { color: var(--fg); font-weight: 600; white-space: nowrap; }
.cmd { position: absolute; left: 50%; transform: translateX(-50%); background: var(--surface); border: 1px solid var(--seam);
  border-radius: 6px; padding: 2px 48px; }
.main { display: grid; grid-template-columns: 44px minmax(0, 1fr); gap: 0 6px; padding: 0 6px 0 0; min-height: 0; }
.act { display: flex; flex-direction: column; align-items: center; gap: 4px; padding-top: 2px; }
.act span { position: relative; width: 44px; height: 40px; display: grid; place-items: center; color: var(--activityDim); }
.act span.on { color: var(--activity); box-shadow: inset 2px 0 0 var(--accent); }
.act svg { width: 22px; height: 22px; fill: none; stroke: currentColor; stroke-width: 1.6; }
.badge { position: absolute; right: 6px; bottom: 6px; min-width: 16px; height: 16px; border-radius: 8px; background: var(--badge);
  color: var(--badgeFg); font: 600 10px/16px "Segoe UI", sans-serif; text-align: center; padding: 0 4px; font-style: normal; }
.ed { display: grid; grid-template-rows: minmax(0, 1fr) 92px; gap: 6px; min-height: 0; min-width: 0; }
.group, .term { border: 1px solid var(--seam); border-radius: 8px; overflow: hidden; min-height: 0; }
.group { background: var(--editor); display: grid; grid-template-rows: 32px minmax(0, 1fr); }
.tabs { display: flex; background: var(--editor); border-bottom: 1px solid var(--seam); }
.tab { display: flex; align-items: center; gap: 8px; padding: 0 14px; color: var(--tabInactive); white-space: nowrap; border-right: 1px solid var(--seam); }
.tab.on { color: var(--fg); box-shadow: inset 0 -2px 0 var(--accent); }
.tab .dot { width: 8px; height: 8px; border-radius: 50%; background: var(--cursor); }
.code { font-family: "Cascadia Mono", Consolas, monospace; font-size: 13px; line-height: 19px; padding-top: 6px; overflow: hidden; }
.ln { display: grid; grid-template-columns: 46px max-content; white-space: pre; }
.ln > b { font-weight: 400; text-align: right; padding-right: 16px; color: var(--gutter); }
.ln.cur { background: var(--line); }
.ln.cur > b { color: var(--gutterActive); }
.k { color: var(--keyword); } .f { color: var(--func); } .t { color: var(--type); } .s { color: var(--string); }
.n { color: var(--number); } .c { color: var(--comment); } .p { color: var(--punct); } .v { color: var(--param); }
.fh { background: var(--findHl); border-radius: 2px; }
.fm { background: var(--find); outline: 1px solid var(--findBorder); border-radius: 2px; }
.wh { background: var(--wordHl); border-radius: 2px; }
.caret { display: inline-block; width: 2px; height: 17px; vertical-align: -4px; background: var(--cursor); margin-right: -2px; }
.term { background: var(--surface); display: grid; grid-template-rows: 24px 1fr; }
.tb { display: flex; gap: 18px; padding: 0 14px; align-items: center; font-size: 11px; letter-spacing: .05em; text-transform: uppercase; color: var(--muted); }
.tb .on { color: var(--fg); box-shadow: inset 0 -1px 0 var(--accent); padding: 3px 0; }
.term pre { margin: 0; padding: 2px 14px; font-family: "Cascadia Mono", Consolas, monospace; font-size: 12px; line-height: 18px; color: var(--fg); }
.status { display: flex; align-items: center; padding: 0 12px; color: var(--status); font-size: 12px; white-space: nowrap; }
.status .r { margin-left: auto; }
`;

function pageHtml() {
  const wins = DECK.map((f, i) => windowHtml(readTheme(f), i)).join('');
  return `<!doctype html><html><head><meta charset="utf-8"><style>${CSS}</style></head><body>${wins}</body></html>`;
}

/* ---------- capture ---------- */

function findBrowser() {
  if (process.env.BROWSER) return process.env.BROWSER;
  const candidates = [
    'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
    'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium'
  ];
  return candidates.find((p) => fs.existsSync(p));
}

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'lantern-shot-'));
const htmlPath = path.join(tmp, 'deck.html');
fs.writeFileSync(htmlPath, pageHtml(), 'utf8');
fs.mkdirSync(path.dirname(OUT_PNG), { recursive: true });

if (process.argv.includes('--html-only')) {
  console.log(`wrote ${htmlPath}`);
  process.exit(0);
}

const browser = findBrowser();
if (!browser) {
  console.error('No Chromium browser found. Set BROWSER to Edge or Chrome, or open ' + htmlPath);
  process.exit(1);
}
execFileSync(browser, [
  '--headless=new',
  '--disable-gpu',
  '--no-first-run',
  '--hide-scrollbars',
  `--user-data-dir=${path.join(tmp, 'profile')}`,
  '--force-device-scale-factor=2',
  '--default-background-color=00000000',
  `--window-size=${PAGE_W},${PAGE_H}`,
  `--screenshot=${OUT_PNG}`,
  'file:///' + htmlPath.replace(/\\/g, '/')
], { stdio: 'ignore' });
fs.rmSync(tmp, { recursive: true, force: true });
console.log(`wrote ${path.relative(ROOT, OUT_PNG)} (${PAGE_W}x${PAGE_H} at 2x)`);
