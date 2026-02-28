# Note Toolbar

![Bandwidth](https://img.shields.io/badge/bandwidth-56kbps-fff?style=flat&logo=speedtest&logoColor=FFFFFF&label=bandwidth&labelColor=5B595C&color=FF6188) ![Stretch Goal](https://img.shields.io/badge/stretch%20goal-touch%20toes-fff?style=flat&logo=fitbit&logoColor=FFFFFF&label=stretch%20goal&labelColor=5B595C&color=FFD866) ![Download Folder](https://img.shields.io/badge/downloads-untamed%20wilderness-fff?style=flat&logo=googledrive&logoColor=FFFFFF&label=download%20folder&labelColor=5B595C&color=5C7CFA) ![Git History](https://img.shields.io/badge/git%20history-force%20pushed-fff?style=flat&logo=git&logoColor=FFFFFF&label=git%20history&labelColor=5B595C&color=78DCE8) ![Online](https://img.shields.io/badge/online-pretending%20to%20work-fff?style=flat&logo=slack&logoColor=FFFFFF&label=online&labelColor=5B595C&color=A9DC76) ![Overengineered](https://img.shields.io/badge/overengineered-hello%20world-fff?style=flat&logo=kubernetes&logoColor=FFFFFF&label=overengineered&labelColor=5B595C&color=FF6188) ![Undertale](https://img.shields.io/badge/determination-filled-fff?style=flat&logo=steam&logoColor=FFFFFF&label=undertale&labelColor=5B595C&color=AB9DF2) ![Fax](https://img.shields.io/badge/fax-still%20required-fff?style=flat&logo=fax&logoColor=FFFFFF&label=fax&labelColor=5B595C&color=AB9DF2) ![Latency](https://img.shields.io/badge/latency-yes-fff?style=flat&logo=speedtest&logoColor=FFFFFF&label=latency&labelColor=5B595C&color=FC9867)

<p align="center">
  <img src="assets/header.svg" width="600" />
</p>

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
