import { MarkdownView, Plugin } from "obsidian";
import {
	ensureToolbarActions,
	cleanupToolbarActions,
	updateSourceToggleAction,
	type ToolbarPlugin,
} from "./toolbar";

export default class NoteToolbarPlugin extends Plugin implements ToolbarPlugin {
	toolbarActionButtons = new WeakMap<MarkdownView, Record<string, any>>();
	sourceModeState = false;

	async onload() {
		ensureToolbarActions(this as unknown as ToolbarPlugin);
		this.updateSourceModeClass();

		// Source mode class and toolbar on layout change (debounced)
		let layoutDebounce: ReturnType<typeof setTimeout> | null = null;
		this.registerEvent(
			this.app.workspace.on("layout-change", () => {
				if (layoutDebounce) clearTimeout(layoutDebounce);
				layoutDebounce = setTimeout(() => {
					layoutDebounce = null;
					this.updateSourceModeClass();
					this.refreshActiveMarkdownPreview();
				}, 50);
			}),
		);

		// Toolbar and source mode on active leaf change (debounced)
		let leafDebounce: ReturnType<typeof setTimeout> | null = null;
		this.registerEvent(
			this.app.workspace.on("active-leaf-change", () => {
				if (leafDebounce) clearTimeout(leafDebounce);
				leafDebounce = setTimeout(() => {
					leafDebounce = null;
					ensureToolbarActions(this as unknown as ToolbarPlugin);
					this.updateSourceModeClass();
					this.refreshActiveMarkdownPreview();
				}, 30);
			}),
		);

		// Cleanup on unload
		this.register(() => {
			if (layoutDebounce) clearTimeout(layoutDebounce);
			if (leafDebounce) clearTimeout(leafDebounce);
			cleanupToolbarActions(this as unknown as ToolbarPlugin);
		});
	}

	private updateSourceModeClass(): void {
		const activeView = this.app.workspace.getActiveViewOfType(MarkdownView);
		const mode = activeView?.getMode ? activeView.getMode() : null;
		const state = activeView?.getState ? activeView.getState() : null;
		const isSource = Boolean(mode !== "preview" && state?.source === true);
		if (isSource !== this.sourceModeState) {
			this.sourceModeState = isSource;
			document.body.classList.toggle("sf-source-mode", isSource);
		}
		updateSourceToggleAction(this as unknown as ToolbarPlugin, activeView);
	}

	private refreshActiveMarkdownPreview(): void {
		const view = this.app.workspace.getActiveViewOfType(MarkdownView);
		if (!view || !view.previewMode) return;
		if (view.getMode && view.getMode() !== "preview") return;
		if (typeof view.previewMode.rerender === "function") {
			view.previewMode.rerender(true);
		}
	}
}
