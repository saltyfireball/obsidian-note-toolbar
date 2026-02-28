# Note Toolbar

An Obsidian plugin that adds toolbar actions to markdown views: quick access to today's daily note, a helpers modal for common editing tasks, and a source/live preview toggle.

## Features

- **Today's Note** -- Calendar icon button that opens (or focuses) today's daily note, reusing an existing pane if already open
- **Helpers Modal** -- Wand icon button that opens a modal with context-sensitive editing helpers:
  - With text selected: wrap in inline code, wrap in code block, Figlet ASCII art (if figlet-generator plugin is installed)
  - Without selection: insert empty code block, Figlet ASCII art
- **Source/Live Preview Toggle** -- Switches between source mode and live preview with a single click; icon updates to reflect current state
- **Source Mode CSS Class** -- Adds `sf-source-mode` to `document.body` when source mode is active, enabling CSS-based styling per mode

## Toolbar Behavior

- Actions are added to the markdown view's action bar (top-right of the editor)
- Plugin actions are ordered before Obsidian's built-in actions
- Actions are automatically added when switching between editor panes
- Cleaned up on plugin unload

## Installation

1. Copy the plugin folder to your vault's `.obsidian/plugins/` directory
2. Enable the plugin in Obsidian Settings > Community Plugins
3. Requires [obsidian-daily-notes-interface](https://github.com/liamcain/obsidian-daily-notes-interface) for the Today's Note feature (bundled as a dependency)

## License

MIT - See [LICENSE](LICENSE) for details.
