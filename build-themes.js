/*
 * Lantern theme builder.
 *
 * Single source of truth for all six themes. Run `node build-themes.js`
 * to regenerate the JSON files in ./themes.
 *
 * Variants produced:
 *   - Lantern Nightshade         (dark blue-violet)
 *   - Lantern Obsidian           (near-black purple)
 *   - Lantern Abyss              (near-black blue)
 *   - Lantern Nightshade Light   (near-white, hint of Nightshade's blue-violet)
 *   - Lantern Obsidian Light     (near-white, hint of Obsidian's purple)
 *   - Lantern Abyss Light        (near-white, hint of Abyss's blue)
 *
 * All variants share ONE syntax catalog (src/token-colors.base.json), written
 * in role colors. Each variant maps those roles onto its own palette, and
 * one workbench template (workbench()) turns a palette into UI colors, so
 * the variants can only differ where their palettes differ.
 *
 * Light palettes keep the hue of their dark twin's backgrounds and lift them
 * almost to white. Gold splits in two there: dark amber (gold.main) for
 * anything drawn as text or a line, and honey (gold.fill) for fills such as
 * badges, buttons and highlights, because gold text can't be read on white.
 */

const fs = require('fs');
const path = require('path');

const OUT_DIR = path.join(__dirname, 'themes');
const BASE_TOKENS = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'src', 'token-colors.base.json'), 'utf8')
);

/* ------------------------------------------------------------------ *
 * Palettes
 *
 * ui:    surfaces from darkest to lightest — editor card, side/panel cards,
 *        frame (title, activity, status bar), floating widgets — plus the
 *        light accent used for every border and indicator.
 * gold:  everything you look for — cursor, active line number, selection,
 *        find matches, occurrences.
 * syn:   syntax roles. term: terminal ANSI hues.
 * ------------------------------------------------------------------ */

const PALETTES = {
  nightshade: {
    ui: {
      editor: '#0c0e22', surface: '#10122a', frame: '#161936', elevated: '#1d2045', seam: '#1f2244',
      fg: '#dcdef5', muted: '#7e82ab', gutter: '#444a7a', line: '#12152e', accent: '#8a9cff'
    },
    gold: { main: '#ffd75f', sel: '#544512', find: '#8a6400' },
    syn: {
      keyword: '#9aa8ff', func: '#6fd0f0', type: '#ffd75f', string: '#a8e0a0', number: '#ffa98a',
      comment: '#656da2', punct: '#8d93c0', param: '#d7b8ff'
    },
    term: { red: '#ff7f9f', green: '#a8e0a0', yellow: '#ffd75f', blue: '#9aa8ff', magenta: '#d7b8ff', cyan: '#6fd0f0' }
  },
  obsidian: {
    ui: {
      editor: '#0e0a1a', surface: '#120d21', frame: '#18122c', elevated: '#211a3a', seam: '#241c3c',
      fg: '#e0daf5', muted: '#857ca8', gutter: '#4a4170', line: '#150f27', accent: '#9f84ff'
    },
    gold: { main: '#ffd166', sel: '#544010', find: '#8a6200' },
    syn: {
      keyword: '#bb9cff', func: '#78c4ff', type: '#ffd166', string: '#9fe3b0', number: '#ff9fb5',
      comment: '#72699e', punct: '#9a92c2', param: '#efc2ff'
    },
    term: { red: '#ff7f9f', green: '#9fe3b0', yellow: '#ffd166', blue: '#78c4ff', magenta: '#bb9cff', cyan: '#7ee0e0' }
  },
  abyss: {
    ui: {
      editor: '#070c18', surface: '#0a1120', frame: '#0f172b', elevated: '#152040', seam: '#18233d',
      fg: '#d3dcef', muted: '#71809f', gutter: '#3b4a6c', line: '#0d1528', accent: '#6ea8ff'
    },
    gold: { main: '#ffd23f', sel: '#4f400c', find: '#876000' },
    syn: {
      keyword: '#7fb0ff', func: '#5ed3e6', type: '#ffd23f', string: '#b4e08a', number: '#f79a74',
      comment: '#5f729c', punct: '#8392b5', param: '#bcaaff'
    },
    term: { red: '#ff7a85', green: '#b4e08a', yellow: '#ffd23f', blue: '#7fb0ff', magenta: '#bcaaff', cyan: '#5ed3e6' }
  },

  /* Light twins. ui runs from lightest (editor) to deepest (frame); widgets
   * float above in near-white. gold.main is dark amber (text, cursor, lines),
   * gold.fill is honey (badges, buttons, highlight fills). */
  nightshadeLight: {
    kind: 'light',
    ui: {
      editor: '#f3f4fc', surface: '#edeefa', frame: '#e3e5f7', elevated: '#fbfbfe', seam: '#d3d5ee',
      fg: '#1a1d3d', muted: '#5a5e86', gutter: '#9a9dc0', line: '#eaebfa', accent: '#4450c4'
    },
    gold: { main: '#7d5a00', fill: '#f5d66b', sel: '#f6e3a4', find: '#f0c445' },
    syn: {
      keyword: '#4a46c0', func: '#0b6a88', type: '#7d5a00', string: '#36722b', number: '#b0401f',
      comment: '#5c6088', punct: '#555a82', param: '#7a3bb0'
    },
    term: { red: '#b5304a', green: '#36722b', yellow: '#7d5a00', blue: '#4a46c0', magenta: '#7a3bb0', cyan: '#0b6a88' }
  },
  obsidianLight: {
    kind: 'light',
    ui: {
      editor: '#f6f3fc', surface: '#f1edfa', frame: '#e8e3f7', elevated: '#fcfbfe', seam: '#dad3ee',
      fg: '#22173a', muted: '#66597f', gutter: '#a69dc2', line: '#eeeafa', accent: '#6741c4'
    },
    gold: { main: '#7d5300', fill: '#f3cf62', sel: '#f4e0a0', find: '#eebf40' },
    syn: {
      keyword: '#663bbd', func: '#1a5fa3', type: '#7d5300', string: '#2a7045', number: '#a83558',
      comment: '#6c5f84', punct: '#615678', param: '#93349f'
    },
    term: { red: '#b02d4a', green: '#2a7045', yellow: '#7d5300', blue: '#1a5fa3', magenta: '#663bbd', cyan: '#0f6a72' }
  },
  abyssLight: {
    kind: 'light',
    ui: {
      editor: '#f3f6fc', surface: '#edf1fa', frame: '#e3e9f7', elevated: '#fbfcfe', seam: '#d3dbee',
      fg: '#0d1a33', muted: '#525e78', gutter: '#95a2bf', line: '#eaeffa', accent: '#1c5bbf'
    },
    gold: { main: '#7a5600', fill: '#f2d052', sel: '#f3e1a2', find: '#ecc23e' },
    syn: {
      keyword: '#1d55ba', func: '#0a6775', type: '#7a5600', string: '#456b12', number: '#a94322',
      comment: '#596582', punct: '#4f5b76', param: '#5841b3'
    },
    term: { red: '#b23240', green: '#456b12', yellow: '#7a5600', blue: '#1d55ba', magenta: '#5841b3', cyan: '#0a6775' }
  }
};

// Shared semantic hues (diagnostics, git, diff), one set per kind.
const STATUS_BY_KIND = {
  dark: {
    error: '#ff6b7f',
    warning: '#ffc34d',
    info: '#6fb8ff',
    added: '#7ccf8a',
    modified: '#6fa8f0',
    deleted: '#e06a7a'
  },
  light: {
    error: '#b82a44',
    warning: '#9a6700',
    info: '#1f6fc4',
    added: '#2e8540',
    modified: '#2f6fd0',
    deleted: '#b82a44'
  }
};

// Diff and merge backgrounds, one set per kind.
const DIFF_BY_KIND = {
  dark: {
    insertedText: '#4bb85c55', removedText: '#e0556655',
    insertedLine: '#2a6e3a33', removedLine: '#7a2a3233',
    insertedGutter: '#2a6e3a55', removedGutter: '#7a2a3255',
    insertedRuler: '#3fb95088', removedRuler: '#d8505f88',
    mergeHeader: '#2a6e3aaa', mergeContent: '#2a6e3a44'
  },
  light: {
    insertedText: '#3fa04f38', removedText: '#d0404a30',
    insertedLine: '#3fa04f1a', removedLine: '#d0404a17',
    insertedGutter: '#3fa04f40', removedGutter: '#d0404a38',
    insertedRuler: '#2e854099', removedRuler: '#b82a4499',
    mergeHeader: '#3fa04f55', mergeContent: '#3fa04f22'
  }
};

const kindOf = (p) => p.kind || 'dark';
const statusOf = (p) => STATUS_BY_KIND[kindOf(p)];

/* ------------------------------------------------------------------ *
 * Syntax: the base catalog is written in these role colors.
 * ------------------------------------------------------------------ */

const ROLE = {
  text: '#000000',
  keyword: '#cc0000',
  string: '#527000',
  number: '#116200',
  func: '#00627a',
  type: '#a16800',
  comment: '#7b7b7bab',
  error: '#f44747',
  invalid: '#ffffff'
};

// Applied after the base catalog so they win. Written in ROLE colors,
// plus PUNCT / PARAM, which only exist in Lantern palettes.
const PUNCT = 'punct';
const PARAM = 'param';
const SYNTAX_OVERRIDES = [
  // --- JSON: keys distinct from string values ---
  {
    name: 'JSON property name (key)',
    scope: 'support.type.property-name.json, support.type.property-name.json punctuation',
    settings: { foreground: ROLE.func }
  },
  {
    name: 'JSON5 / JSONC key',
    scope: 'support.type.property-name.json5, meta.structure.dictionary.key.json string.quoted',
    settings: { foreground: ROLE.func }
  },

  // --- XML / HTML: keyword-colored tags, gold attributes, dim brackets ---
  {
    name: 'XML/HTML tag name',
    scope:
      'entity.name.tag, entity.name.tag.xml, entity.name.tag.localname.xml, entity.name.tag.html',
    settings: { foreground: ROLE.keyword }
  },
  {
    name: 'XML/HTML tag punctuation (angle brackets)',
    scope:
      'punctuation.definition.tag, punctuation.definition.tag.xml, punctuation.definition.tag.begin.xml, punctuation.definition.tag.end.xml, punctuation.definition.tag.begin.html, punctuation.definition.tag.end.html',
    settings: { foreground: PUNCT }
  },
  {
    name: 'XML/HTML attribute name',
    scope:
      'entity.other.attribute-name, entity.other.attribute-name.xml, entity.other.attribute-name.localname.xml, entity.other.attribute-name.html',
    settings: { foreground: ROLE.type }
  },
  {
    name: 'XML namespace / prolog / doctype',
    scope:
      'entity.name.tag.namespace.xml, entity.other.attribute-name.namespace.xml, meta.tag.preprocessor.xml entity.name.tag, keyword.other.doctype, meta.tag.sgml.doctype',
    settings: { foreground: ROLE.func }
  },
  {
    name: 'XML attribute values (strings)',
    scope: 'string.quoted.double.xml, string.quoted.single.xml',
    settings: { foreground: ROLE.string }
  },
  {
    name: 'XML CDATA',
    scope: 'string.unquoted.cdata.xml, constant.other.entity.xml',
    settings: { foreground: ROLE.type }
  },

  // --- Punctuation and parameters ---
  {
    name: 'Punctuation (separators, terminators, braces)',
    scope:
      'punctuation.separator, punctuation.terminator, punctuation.accessor, meta.brace, punctuation.definition.block, punctuation.definition.parameters, punctuation.section',
    settings: { foreground: PUNCT }
  },
  {
    name: 'Parameters',
    scope: 'variable.parameter, variable.parameter.function',
    settings: { foreground: PARAM }
  },

  // --- Invalid: make it visible ---
  {
    name: 'Invalid',
    scope:
      'invalid, invalid.illegal, invalid.broken, invalid.deprecated, invalid.unimplemented',
    settings: { foreground: ROLE.error, fontStyle: 'underline' }
  }
];

const SEMANTIC = {
  enumMember: ROLE.text,
  'variable.constant': ROLE.number,
  'variable.defaultLibrary': ROLE.type,
  'variable.readonly': ROLE.number,
  parameter: PARAM,
  property: ROLE.text,
  'property.readonly': ROLE.number,
  class: ROLE.type,
  interface: ROLE.type,
  enum: ROLE.type,
  type: ROLE.type,
  namespace: ROLE.type,
  function: ROLE.func,
  method: ROLE.func,
  macro: ROLE.keyword
};

/* ------------------------------------------------------------------ *
 * Color helpers
 * ------------------------------------------------------------------ */

const rgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
const toHex = (c) => '#' + c.map((v) => Math.round(v).toString(16).padStart(2, '0')).join('');

// mix(a, b, w): w of color a over (1 - w) of color b, as opaque hex.
function mix(a, b, w) {
  const [x, y] = [rgb(a), rgb(b)];
  return toHex(x.map((v, i) => v * w + y[i] * (1 - w)));
}

// Append a two-digit alpha to a 6-digit hex.
const alpha = (hex, aa) => hex.slice(0, 7) + aa;

/* ------------------------------------------------------------------ *
 * Workbench colors
 *
 * Tiers: editor card (deepest) -> side bar / panel / secondary side bar
 * cards -> frame (title bar, activity bar, status bar, empty editor area)
 * -> floating widgets. Borders and indicators use the light accent.
 * ------------------------------------------------------------------ */

function workbench(p) {
  const { editor, surface, frame, elevated, seam, fg, muted, gutter, line, accent } = p.ui;
  const g = p.gold;
  const s = p.syn;
  const t = p.term;
  const light = kindOf(p) === 'light';
  const STATUS = statusOf(p);
  const DIFF = DIFF_BY_KIND[kindOf(p)];

  // gold.main is drawn as text or lines; fill is the gold used as a background.
  const fill = g.fill || g.main;
  // Highlight fills: on light themes honey needs about twice the opacity to show.
  const hl = (aa) => light
    ? alpha(fill, Math.min(255, Math.round(parseInt(aa, 16) * 2.2)).toString(16).padStart(2, '0'))
    : alpha(g.main, aa);

  // Kind-dependent constants (dark value first).
  const STRONG = light ? fg : '#ffffff'; // text on selected rows, tabs, matches
  const ON_FILL = light ? fg : '#10142a'; // text on gold buttons and badges
  const ON_ACCENT = light ? '#ffffff' : '#10142a'; // text on the accent (remote item, chat avatar)
  const ON_ERROR = light ? '#ffffff' : '#10142a';
  const SHADOW = light ? alpha(fg, '24') : '#00000099';
  const SHADOW_SOFT = light ? alpha(fg, '14') : '#00000080';
  const BRIGHT = light ? fg : '#ffffff'; // what terminal bright colors mix toward
  const accentSoft = light ? mix(accent, fg, 0.7) : mix(accent, '#ffffff', 0.75);
  // Badges, buttons and popup borders share the highlight gold.
  const goldHover = light ? mix(fill, g.main, 0.85) : mix(g.main, '#ffffff', 0.8);
  const popBorder = light ? alpha(g.main, '80') : alpha(g.main, '59');
  const activeRow = mix(accent, surface, light ? 0.14 : 0.22);
  const hoverRow = mix(fg, surface, light ? 0.04 : 0.05);
  const inactiveRow = mix(fg, surface, light ? 0.06 : 0.08);

  return {
    foreground: mix(fg, surface, 0.85),
    focusBorder: alpha(accent, '99'),
    'selection.background': g.sel,
    'scrollbar.shadow': SHADOW_SOFT,
    'widget.border': seam,
    'widget.shadow': SHADOW,
    'icon.foreground': mix(fg, surface, 0.8),
    'sash.hoverBorder': alpha(accent, '99'),
    'textLink.foreground': accent,
    'textLink.activeForeground': accentSoft,
    'textPreformat.foreground': s.type,
    'textBlockQuote.background': surface,
    'textBlockQuote.border': alpha(accent, '66'),
    'textCodeBlock.background': editor,
    'descriptionForeground': muted,
    'disabledForeground': alpha(fg, '55'),
    'errorForeground': STATUS.error,

    // Title bar and command center (frame)
    'titleBar.activeBackground': frame,
    'titleBar.activeForeground': fg,
    'titleBar.inactiveBackground': frame,
    'titleBar.inactiveForeground': alpha(muted, 'aa'),
    'titleBar.border': frame,
    'commandCenter.foreground': fg,
    'commandCenter.activeForeground': fg,
    'commandCenter.background': mix(surface, frame, 0.7),
    'commandCenter.activeBackground': elevated,
    'commandCenter.border': alpha(accent, '40'),
    'commandCenter.activeBorder': alpha(accent, '80'),
    'commandCenter.inactiveBorder': alpha(accent, '20'),

    // Menus
    'menubar.selectionForeground': fg,
    'menubar.selectionBackground': alpha(fg, '1a'),
    'menu.foreground': fg,
    'menu.background': elevated,
    'menu.selectionForeground': STRONG,
    'menu.selectionBackground': activeRow,
    'menu.selectionBorder': '#00000000',
    'menu.separatorBackground': seam,
    'menu.border': popBorder,

    // Activity bar (sits on the frame)
    'activityBar.background': frame,
    'activityBar.foreground': fg,
    'activityBar.inactiveForeground': alpha(fg, '66'),
    'activityBar.activeBorder': accent,
    'activityBar.activeBackground': frame,
    'activityBar.border': frame,
    'activityBarBadge.background': fill,
    'activityBarBadge.foreground': ON_FILL,
    'activityBarTop.foreground': fg,
    'activityBarTop.inactiveForeground': alpha(fg, '66'),
    'activityBarTop.activeBorder': accent,

    // Side bars (primary + secondary) — card tier
    'sideBar.background': surface,
    'sideBar.foreground': mix(fg, surface, 0.88),
    'sideBar.border': seam,
    'sideBar.dropBackground': alpha(accent, '22'),
    'sideBarTitle.foreground': fg,
    'sideBarSectionHeader.background': '#00000000',
    'sideBarSectionHeader.foreground': fg,
    'sideBarSectionHeader.border': seam,
    'sideBarActivityBarTop.border': seam,

    // Lists and trees
    'list.hoverBackground': hoverRow,
    'list.hoverForeground': fg,
    'list.activeSelectionBackground': activeRow,
    'list.activeSelectionForeground': STRONG,
    'list.activeSelectionIconForeground': STRONG,
    'list.inactiveSelectionBackground': inactiveRow,
    'list.inactiveSelectionForeground': fg,
    'list.focusBackground': activeRow,
    'list.focusForeground': STRONG,
    'list.focusOutline': alpha(accent, '99'),
    'list.inactiveFocusOutline': alpha(accent, '40'),
    'list.highlightForeground': g.main,
    'list.focusHighlightForeground': g.main,
    'list.dropBackground': alpha(accent, '22'),
    'list.errorForeground': STATUS.error,
    'list.warningForeground': STATUS.warning,
    'tree.indentGuidesStroke': mix(fg, surface, 0.18),
    'tree.inactiveIndentGuidesStroke': mix(fg, surface, 0.1),
    'listFilterWidget.background': elevated,
    'listFilterWidget.outline': alpha(accent, '80'),
    'listFilterWidget.noMatchesOutline': STATUS.error,

    // Editor groups and tabs — editor card tier
    'editorGroup.border': seam,
    'editorGroup.dropBackground': alpha(accent, '1a'),
    'editorGroup.emptyBackground': frame,
    'editorGroupHeader.tabsBackground': editor,
    'editorGroupHeader.tabsBorder': seam,
    'editorGroupHeader.noTabsBackground': editor,
    'tab.activeBackground': mix(fg, editor, 0.04),
    'tab.activeForeground': STRONG,
    'tab.activeBorder': accent,
    'tab.activeBorderTop': '#00000000',
    'tab.unfocusedActiveBorder': alpha(accent, '66'),
    'tab.unfocusedActiveForeground': alpha(fg, 'cc'),
    'tab.inactiveBackground': editor,
    'tab.inactiveForeground': alpha(fg, '94'),
    'tab.unfocusedInactiveForeground': alpha(fg, '70'),
    'tab.hoverBackground': mix(fg, editor, 0.06),
    'tab.hoverForeground': fg,
    'tab.border': alpha(seam, 'b3'),
    'tab.lastPinnedBorder': alpha(accent, '40'),
    'tab.selectedBackground': mix(fg, editor, 0.04),
    'tab.selectedForeground': STRONG,
    'tab.selectedBorderTop': accent,
    'breadcrumb.background': editor,
    'breadcrumb.foreground': muted,
    'breadcrumb.focusForeground': fg,
    'breadcrumb.activeSelectionForeground': g.main,
    'breadcrumbPicker.background': elevated,

    // Editor core
    'editor.background': editor,
    'editor.foreground': fg,
    'editorLineNumber.foreground': gutter,
    'editorLineNumber.activeForeground': g.main,
    'editorCursor.foreground': g.main,
    'editorCursor.background': editor,
    'editor.lineHighlightBackground': line,
    'editor.lineHighlightBorder': alpha(g.main, '14'),
    // Selection and everything you search for: gold
    'editor.selectionBackground': g.sel,
    'editor.selectionForeground': STRONG,
    'editor.inactiveSelectionBackground': alpha(g.sel, '99'),
    'editor.selectionHighlightBackground': hl('1f'),
    'editor.selectionHighlightBorder': alpha(g.main, '66'),
    'editor.wordHighlightBackground': hl('1a'),
    'editor.wordHighlightBorder': alpha(g.main, '55'),
    'editor.wordHighlightStrongBackground': hl('2e'),
    'editor.wordHighlightStrongBorder': alpha(g.main, '88'),
    'editor.wordHighlightTextBackground': hl('1a'),
    'editor.wordHighlightTextBorder': alpha(g.main, '55'),
    'editor.findMatchBackground': g.find,
    'editor.findMatchBorder': g.main,
    'editor.findMatchForeground': STRONG,
    'editor.findMatchHighlightBackground': hl('38'),
    'editor.findMatchHighlightBorder': alpha(g.main, '8c'),
    'editor.findRangeHighlightBackground': alpha(fg, '0d'),
    'editor.rangeHighlightBackground': hl('0f'),
    'editor.hoverHighlightBackground': alpha(accent, '26'),
    'editor.linkedEditingBackground': alpha(accent, '22'),
    'editor.foldBackground': alpha(g.sel, '40'),
    'editorBracketMatch.background': hl('1f'),
    'editorBracketMatch.border': alpha(g.main, 'b3'),
    'editorWhitespace.foreground': alpha(fg, '1f'),
    'editorIndentGuide.background1': mix(fg, editor, 0.1),
    'editorIndentGuide.activeBackground1': alpha(accent, '80'),
    'editorRuler.foreground': mix(fg, editor, 0.1),
    'editorLink.activeForeground': accent,
    'editorCodeLens.foreground': muted,
    'editorLightBulb.foreground': g.main,
    'editorLightBulbAutoFix.foreground': accent,
    'editorUnnecessaryCode.opacity': '#000000a0',

    // Gutter
    'editorGutter.background': editor,
    'editorGutter.modifiedBackground': STATUS.modified,
    'editorGutter.addedBackground': STATUS.added,
    'editorGutter.deletedBackground': STATUS.deleted,
    'editorGutter.foldingControlForeground': mix(fg, editor, 0.7),
    'editorGutter.commentRangeForeground': mix(fg, editor, 0.5),

    // Bracket pair colorization
    'editorBracketHighlight.foreground1': g.main,
    'editorBracketHighlight.foreground2': s.keyword,
    'editorBracketHighlight.foreground3': s.func,
    'editorBracketHighlight.foreground4': s.param,
    'editorBracketHighlight.foreground5': s.string,
    'editorBracketHighlight.foreground6': s.number,
    'editorBracketHighlight.unexpectedBracket.foreground': STATUS.error,

    // Inlay hints, ghost text, sticky scroll
    'editorInlayHint.foreground': muted,
    'editorInlayHint.background': alpha(fg, '0f'),
    'editorInlayHint.typeForeground': muted,
    'editorInlayHint.parameterForeground': muted,
    'editorGhostText.foreground': mix(fg, editor, 0.4),
    'editorStickyScroll.background': editor,
    'editorStickyScroll.shadow': SHADOW,
    'editorStickyScrollHover.background': line,

    // Overview ruler and minimap
    'editorOverviewRuler.background': alpha(editor, '00'),
    'editorOverviewRuler.border': alpha(seam, '80'),
    'editorOverviewRuler.findMatchForeground': g.main,
    'editorOverviewRuler.selectionHighlightForeground': alpha(g.main, 'aa'),
    'editorOverviewRuler.errorForeground': STATUS.error,
    'editorOverviewRuler.warningForeground': STATUS.warning,
    'editorOverviewRuler.infoForeground': STATUS.info,
    'editorOverviewRuler.modifiedForeground': STATUS.modified,
    'editorOverviewRuler.addedForeground': STATUS.added,
    'editorOverviewRuler.deletedForeground': STATUS.deleted,
    'minimap.background': editor,
    'minimap.findMatchHighlight': g.main,
    'minimap.selectionHighlight': g.sel,
    'minimap.selectionOccurrenceHighlight': alpha(g.main, '80'),
    'minimap.errorHighlight': STATUS.error,
    'minimap.warningHighlight': STATUS.warning,
    'minimapSlider.background': alpha(fg, '14'),
    'minimapSlider.hoverBackground': alpha(fg, '22'),
    'minimapSlider.activeBackground': alpha(fg, '30'),
    'minimapGutter.addedBackground': STATUS.added,
    'minimapGutter.modifiedBackground': STATUS.modified,
    'minimapGutter.deletedBackground': STATUS.deleted,

    // Diagnostics
    'editorError.foreground': STATUS.error,
    'editorWarning.foreground': STATUS.warning,
    'editorInfo.foreground': STATUS.info,
    'editorHint.foreground': muted,
    'problemsErrorIcon.foreground': STATUS.error,
    'problemsWarningIcon.foreground': STATUS.warning,
    'problemsInfoIcon.foreground': STATUS.info,

    // Floating widgets
    'editorWidget.background': elevated,
    'editorWidget.foreground': fg,
    'editorWidget.border': popBorder,
    'editorWidget.resizeBorder': alpha(accent, '80'),
    'editorSuggestWidget.background': elevated,
    'editorSuggestWidget.border': popBorder,
    'editorSuggestWidget.foreground': fg,
    'editorSuggestWidget.highlightForeground': g.main,
    'editorSuggestWidget.focusHighlightForeground': g.main,
    'editorSuggestWidget.selectedBackground': activeRow,
    'editorSuggestWidget.selectedForeground': STRONG,
    'editorHoverWidget.background': elevated,
    'editorHoverWidget.foreground': fg,
    'editorHoverWidget.border': popBorder,
    'editorHoverWidget.statusBarBackground': mix(fg, elevated, 0.05),
    'quickInput.background': elevated,
    'quickInput.foreground': fg,
    'quickInputTitle.background': mix(fg, elevated, 0.04),
    'quickInputList.focusBackground': activeRow,
    'quickInputList.focusForeground': STRONG,
    'quickInputList.focusIconForeground': STRONG,
    'pickerGroup.border': seam,
    'pickerGroup.foreground': accent,
    'debugToolBar.background': elevated,
    'debugToolBar.border': popBorder,
    'debugExceptionWidget.background': elevated,
    'debugExceptionWidget.border': STATUS.error,

    // Peek view
    'peekView.border': alpha(accent, '80'),
    'peekViewEditor.background': mix(accent, editor, 0.04),
    'peekViewEditorGutter.background': mix(accent, editor, 0.04),
    'peekViewEditor.matchHighlightBackground': hl('40'),
    'peekViewEditor.matchHighlightBorder': alpha(g.main, '99'),
    'peekViewResult.background': surface,
    'peekViewResult.fileForeground': fg,
    'peekViewResult.lineForeground': mix(fg, surface, 0.75),
    'peekViewResult.matchHighlightBackground': hl('40'),
    'peekViewResult.selectionBackground': activeRow,
    'peekViewResult.selectionForeground': STRONG,
    'peekViewTitle.background': surface,
    'peekViewTitleLabel.foreground': fg,
    'peekViewTitleDescription.foreground': muted,

    // Diff
    'diffEditor.insertedTextBackground': DIFF.insertedText,
    'diffEditor.removedTextBackground': DIFF.removedText,
    'diffEditor.insertedLineBackground': DIFF.insertedLine,
    'diffEditor.removedLineBackground': DIFF.removedLine,
    'diffEditorGutter.insertedLineBackground': DIFF.insertedGutter,
    'diffEditorGutter.removedLineBackground': DIFF.removedGutter,
    'diffEditorOverview.insertedForeground': DIFF.insertedRuler,
    'diffEditorOverview.removedForeground': DIFF.removedRuler,
    'diffEditor.diagonalFill': seam,
    'diffEditor.border': seam,

    // Merge conflicts
    'merge.currentHeaderBackground': DIFF.mergeHeader,
    'merge.currentContentBackground': DIFF.mergeContent,
    'merge.incomingHeaderBackground': alpha(accent, '80'),
    'merge.incomingContentBackground': alpha(accent, '26'),
    'merge.commonHeaderBackground': mix(fg, editor, 0.2),
    'merge.commonContentBackground': mix(fg, editor, 0.08),

    // Panel and terminal — card tier
    'panel.background': surface,
    'panel.border': seam,
    'panel.dropBorder': accent,
    'panelTitle.activeBorder': accent,
    'panelTitle.activeForeground': fg,
    'panelTitle.inactiveForeground': muted,
    'panelSection.border': seam,
    'panelSectionHeader.background': surface,
    'panelInput.border': seam,
    'outputView.background': surface,
    'terminal.background': surface,
    'terminal.foreground': fg,
    'terminal.border': seam,
    'terminal.selectionBackground': alpha(g.sel, 'cc'),
    'terminal.inactiveSelectionBackground': alpha(g.sel, '80'),
    'terminalCursor.foreground': g.main,
    'terminalCursor.background': surface,
    'terminal.ansiBlack': light ? fg : mix(fg, surface, 0.15),
    'terminal.ansiBrightBlack': muted,
    'terminal.ansiRed': t.red,
    'terminal.ansiBrightRed': mix(t.red, BRIGHT, 0.8),
    'terminal.ansiGreen': t.green,
    'terminal.ansiBrightGreen': mix(t.green, BRIGHT, 0.8),
    'terminal.ansiYellow': t.yellow,
    'terminal.ansiBrightYellow': mix(t.yellow, BRIGHT, 0.8),
    'terminal.ansiBlue': t.blue,
    'terminal.ansiBrightBlue': mix(t.blue, BRIGHT, 0.8),
    'terminal.ansiMagenta': t.magenta,
    'terminal.ansiBrightMagenta': mix(t.magenta, BRIGHT, 0.8),
    'terminal.ansiCyan': t.cyan,
    'terminal.ansiBrightCyan': mix(t.cyan, BRIGHT, 0.8),
    'terminal.ansiWhite': light ? mix(fg, surface, 0.55) : mix(fg, surface, 0.85),
    'terminal.ansiBrightWhite': light ? mix(fg, surface, 0.35) : STRONG,
    'terminalCommandDecoration.successBackground': t.green,
    'terminalCommandDecoration.errorBackground': t.red,
    'terminalCommandDecoration.defaultBackground': muted,
    'terminal.findMatchBackground': g.find,
    'terminal.findMatchBorder': g.main,
    'terminal.findMatchHighlightBackground': hl('38'),
    'terminal.findMatchHighlightBorder': alpha(g.main, '8c'),
    'terminalOverviewRuler.findMatchForeground': g.main,

    // Chat (secondary side bar)
    'chat.requestBackground': elevated,
    'chat.requestBorder': alpha(accent, '30'),
    'chat.avatarBackground': accent,
    'chat.avatarForeground': ON_ACCENT,
    'chat.slashCommandBackground': alpha(accent, '30'),
    'chat.slashCommandForeground': accentSoft,
    'chat.editedFileForeground': g.main,
    'interactive.activeCodeBorder': alpha(accent, '80'),
    'interactive.inactiveCodeBorder': seam,
    'inlineChat.background': elevated,
    'inlineChat.border': popBorder,
    'inlineChatInput.background': surface,
    'inlineChatInput.border': alpha(accent, '40'),
    'inlineChatInput.focusBorder': alpha(accent, '99'),

    // Status bar (frame)
    'statusBar.background': frame,
    'statusBar.foreground': mix(fg, frame, 0.82),
    'statusBar.border': frame,
    'statusBar.focusBorder': alpha(accent, '99'),
    'statusBar.noFolderBackground': frame,
    'statusBar.noFolderForeground': mix(fg, frame, 0.82),
    'statusBar.debuggingBackground': g.find,
    'statusBar.debuggingForeground': STRONG,
    'statusBar.debuggingBorder': frame,
    'statusBarItem.hoverBackground': alpha(fg, '14'),
    'statusBarItem.activeBackground': alpha(fg, '22'),
    'statusBarItem.remoteBackground': accent,
    'statusBarItem.remoteForeground': ON_ACCENT,
    'statusBarItem.remoteHoverBackground': accentSoft,
    'statusBarItem.errorBackground': STATUS.error,
    'statusBarItem.errorForeground': ON_ERROR,
    'statusBarItem.warningBackground': g.find,
    'statusBarItem.warningForeground': STRONG,
    'statusBarItem.prominentBackground': alpha(accent, '30'),
    'statusBarItem.prominentForeground': fg,

    // Buttons, inputs, form controls
    'button.background': fill,
    'button.foreground': ON_FILL,
    'button.hoverBackground': goldHover,
    'button.border': '#00000000',
    'button.separator': alpha(ON_FILL, '55'),
    'button.secondaryBackground': elevated,
    'button.secondaryForeground': fg,
    'button.secondaryHoverBackground': mix(fg, elevated, 0.08),
    'input.background': mix(editor, surface, 0.5),
    'input.foreground': fg,
    'input.border': seam,
    'input.placeholderForeground': muted,
    'inputOption.activeBackground': alpha(accent, '33'),
    'inputOption.activeBorder': alpha(accent, '99'),
    'inputOption.activeForeground': STRONG,
    'inputOption.hoverBackground': alpha(fg, '14'),
    'inputValidation.errorBackground': mix(STATUS.error, editor, 0.15),
    'inputValidation.errorBorder': STATUS.error,
    'inputValidation.warningBackground': mix(STATUS.warning, editor, 0.12),
    'inputValidation.warningBorder': STATUS.warning,
    'inputValidation.infoBackground': mix(STATUS.info, editor, 0.12),
    'inputValidation.infoBorder': STATUS.info,
    'dropdown.background': mix(editor, surface, 0.5),
    'dropdown.listBackground': elevated,
    'dropdown.foreground': fg,
    'dropdown.border': seam,
    'checkbox.background': mix(editor, surface, 0.5),
    'checkbox.foreground': fg,
    'checkbox.border': seam,
    'checkbox.selectBackground': elevated,
    'checkbox.selectBorder': accent,
    'radio.activeBackground': alpha(accent, '33'),
    'radio.activeBorder': accent,
    'radio.activeForeground': STRONG,
    'toolbar.hoverBackground': alpha(fg, '14'),
    'toolbar.activeBackground': alpha(fg, '22'),
    // Extension view buttons (Install, Update, ...)
    'extensionButton.background': fill,
    'extensionButton.foreground': ON_FILL,
    'extensionButton.hoverBackground': goldHover,
    'extensionButton.separator': alpha(ON_FILL, '55'),
    'extensionButton.prominentBackground': fill,
    'extensionButton.prominentForeground': ON_FILL,
    'extensionButton.prominentHoverBackground': goldHover,
    'extensionBadge.remoteBackground': fill,
    'extensionBadge.remoteForeground': ON_FILL,
    'keybindingLabel.background': alpha(fg, '12'),
    'keybindingLabel.foreground': fg,
    'keybindingLabel.border': alpha(fg, '22'),
    'keybindingLabel.bottomBorder': light ? SHADOW_SOFT : '#00000060',

    // Badges, progress, scrollbar
    'badge.background': fill,
    'badge.foreground': ON_FILL,
    'progressBar.background': accent,
    'scrollbarSlider.background': alpha(fg, '22'),
    'scrollbarSlider.hoverBackground': alpha(fg, '38'),
    'scrollbarSlider.activeBackground': alpha(fg, '4d'),

    // Notifications
    'notifications.background': elevated,
    'notifications.foreground': fg,
    'notifications.border': seam,
    'notificationToast.border': popBorder,
    'notificationCenter.border': popBorder,
    'notificationCenterHeader.background': frame,
    'notificationCenterHeader.foreground': fg,
    'notificationLink.foreground': g.main,
    'notificationsErrorIcon.foreground': STATUS.error,
    'notificationsWarningIcon.foreground': STATUS.warning,
    'notificationsInfoIcon.foreground': g.main,

    // Git decorations
    'gitDecoration.addedResourceForeground': STATUS.added,
    'gitDecoration.modifiedResourceForeground': g.main,
    'gitDecoration.stageModifiedResourceForeground': g.main,
    'gitDecoration.deletedResourceForeground': STATUS.deleted,
    'gitDecoration.stageDeletedResourceForeground': STATUS.deleted,
    'gitDecoration.untrackedResourceForeground': STATUS.added,
    'gitDecoration.ignoredResourceForeground': mix(fg, surface, 0.4),
    'gitDecoration.conflictingResourceForeground': s.param,
    'gitDecoration.submoduleResourceForeground': s.func,

    // Settings, welcome, misc
    'settings.headerForeground': fg,
    'settings.modifiedItemIndicator': g.main,
    'settings.focusedRowBackground': alpha(fg, '08'),
    'settings.rowHoverBackground': alpha(fg, '06'),
    'welcomePage.tileBackground': surface,
    'welcomePage.tileHoverBackground': elevated,
    'welcomePage.tileBorder': seam,
    'walkThrough.embeddedEditorBackground': editor,
    'editorGutter.commentGlyphForeground': mix(fg, editor, 0.7),

    // Testing
    'testing.iconPassed': STATUS.added,
    'testing.iconFailed': STATUS.error,
    'testing.iconErrored': STATUS.error,
    'testing.iconQueued': g.main,
    'testing.iconSkipped': muted,

    // Charts
    'charts.foreground': fg,
    'charts.lines': alpha(fg, '80'),
    'charts.red': t.red,
    'charts.blue': t.blue,
    'charts.yellow': t.yellow,
    'charts.green': t.green,
    'charts.orange': s.number,
    'charts.purple': t.magenta
  };
}

/* ------------------------------------------------------------------ *
 * Builders
 * ------------------------------------------------------------------ */

function roleMap(p) {
  return {
    [ROLE.text]: p.ui.fg,
    [ROLE.keyword]: p.syn.keyword,
    [ROLE.string]: p.syn.string,
    [ROLE.number]: p.syn.number,
    [ROLE.func]: p.syn.func,
    [ROLE.type]: p.syn.type,
    [ROLE.comment]: p.syn.comment,
    [ROLE.error]: statusOf(p).error,
    [ROLE.invalid]: p.ui.fg,
    [PUNCT]: p.syn.punct,
    [PARAM]: p.syn.param
  };
}

function remap(color, map) {
  const out = map[color.toLowerCase()] || map[color];
  if (!out) throw new Error(`No Lantern role for ${color}; add it to ROLE / roleMap()`);
  return out;
}

// fontStyle from the catalog is dropped: Lantern ships no italics.
function tokenColors(p) {
  const map = roleMap(p);
  const rule = (r, keepStyle) => {
    const out = { settings: {} };
    if (r.name) out.name = r.name;
    out.scope = r.scope;
    if (r.settings && r.settings.foreground) out.settings.foreground = remap(r.settings.foreground, map);
    if (keepStyle && r.settings.fontStyle) out.settings.fontStyle = r.settings.fontStyle;
    return out;
  };
  return [
    ...BASE_TOKENS.map((r) => rule(r, false)),
    ...SYNTAX_OVERRIDES.map((r) => rule(r, true))
  ];
}

function semanticTokenColors(p) {
  const map = roleMap(p);
  const out = {};
  for (const [k, role] of Object.entries(SEMANTIC)) out[k] = { foreground: remap(role, map) };
  return out;
}

const VARIANTS = [
  { file: 'lantern-nightshade-theme.json', name: 'Lantern Nightshade', palette: PALETTES.nightshade },
  { file: 'lantern-obsidian-theme.json', name: 'Lantern Obsidian', palette: PALETTES.obsidian },
  { file: 'lantern-abyss-theme.json', name: 'Lantern Abyss', palette: PALETTES.abyss },
  { file: 'lantern-nightshade-light-theme.json', name: 'Lantern Nightshade Light', palette: PALETTES.nightshadeLight },
  { file: 'lantern-obsidian-light-theme.json', name: 'Lantern Obsidian Light', palette: PALETTES.obsidianLight },
  { file: 'lantern-abyss-light-theme.json', name: 'Lantern Abyss Light', palette: PALETTES.abyssLight }
];

for (const v of VARIANTS) {
  const theme = {
    name: v.name,
    type: kindOf(v.palette),
    semanticHighlighting: true,
    semanticTokenColors: semanticTokenColors(v.palette),
    colors: workbench(v.palette),
    tokenColors: tokenColors(v.palette)
  };
  const dest = path.join(OUT_DIR, v.file);
  fs.writeFileSync(dest, JSON.stringify(theme, null, 2) + '\n', 'utf8');
  console.log(`wrote ${v.file}  (${theme.tokenColors.length} token rules, ${Object.keys(theme.colors).length} colors)`);
}
