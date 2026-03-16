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

### Obsidian Community Plugin (pending)

This plugin has been submitted for review to the Obsidian community plugin directory. Once approved, you will be able to install it directly from **Settings > Community plugins > Browse** by searching for "Note Toolbar".

### Using BRAT

You can install this plugin right now using the [BRAT](https://github.com/TfTHacker/obsidian42-brat) plugin:

1. Install BRAT from **Settings > Community plugins > Browse** (search for "BRAT" by TfTHacker)
2. Open the BRAT settings
3. Under the **Beta plugins** section, click **Add beta plugin**

   ![BRAT beta plugin list](assets/brat_example_beta_plugin_list.png)

4. In the overlay, enter this plugin's repository: `https://github.com/saltyfireball/obsidian-note-toolbar` (or just `saltyfireball/obsidian-note-toolbar`)

   ![BRAT add beta plugin](assets/brat_example_beta_modal.png)

5. Leave the version set to latest

   ![BRAT beta plugin filled](assets/brat_example_beta_modal_filled.png)

6. Click **Add plugin**

### Manual

1. Download the latest release from the [Releases](https://github.com/saltyfireball/obsidian-note-toolbar/releases) page
2. Copy `main.js`, `manifest.json`, and `styles.css` into your vault's `.obsidian/plugins/obsidian-note-toolbar/` directory
3. Enable the plugin in **Settings > Community plugins**

## License

MIT - See [LICENSE](LICENSE) for details.
