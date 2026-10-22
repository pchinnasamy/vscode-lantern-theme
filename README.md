# Lantern

Three very dark blue and violet themes for VS Code, lit with gold.

The backgrounds stay deep and cool, so the things you look for stand out in gold: the cursor, the active line number, your selection, find matches and other occurrences of the word under the cursor. Borders, tabs and indicators use a soft light blue or violet.

## Variants

Open the Color Theme picker (`Ctrl+K Ctrl+T`, or `Cmd+K Cmd+T` on macOS) and choose one:

| Theme | Shade | Editor | Accent | Gold |
|---|---|---|---|---|
| **Lantern Nightshade** | Dark blue-violet | `#0c0e22` | `#8a9cff` | `#ffd75f` |
| **Lantern Obsidian** | Near-black purple | `#0e0a1a` | `#9f84ff` | `#ffd166` |
| **Lantern Abyss** | Near-black blue | `#070c18` | `#6ea8ff` | `#ffd23f` |

## Features

- Made for the current card-style workbench. Panels have a clear depth order: the editor is darkest, then the side bars, panel and Chat, then the frame (title, activity and status bars), then floating widgets.
- Gold for the cursor, active line number, selection, find matches, word occurrences, bracket matches and modified files.
- All code colors have at least 4.5:1 contrast against the editor background. Comments are slightly dimmer so they stay in the background.
- Distinct colors for JSON keys and values, and for XML/HTML tags and attributes.
- A full terminal palette, plus colors for Chat, diff, merge conflicts, git decorations, the minimap, bracket pairs and inlay hints.

## Development

All three themes are generated from one source:

- Palettes and workbench colors: [build-themes.js](build-themes.js)
- Shared syntax catalog: [src/token-colors.base.json](src/token-colors.base.json)
- Icon: [scripts/make-icon.js](scripts/make-icon.js)

```
npm run build      # regenerate themes/*.json
npm run icon       # regenerate icon.png
npm run package    # build the .vsix (needs @vscode/vsce)
```

Press `F5` in VS Code to open an Extension Development Host with the themes loaded.

## License

[MIT](LICENSE)
