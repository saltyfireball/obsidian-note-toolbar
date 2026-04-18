import { MarkdownView, Plugin } from "obsidian";
import {
	ensureToolbarActions,
	cleanupToolbarActions,
	updateSourceToggleAction,
	type ToolbarPlugin,
} from "./toolbar";

export default class NoteToolbarPlugin extends Plugin implements ToolbarPlugin {
	toolbarActionButtons = new WeakMap<MarkdownView, Record<string, unknown>>();
	sourceModeState = false;

	onload(): void {
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
				}, 30);
			}),
		);

		// Catch view state changes from other plugins (e.g. auto-view-mode)
		// that apply state asynchronously after file-open.
		let fileOpenDebounce: ReturnType<typeof setTimeout> | null = null;
		this.registerEvent(
			this.app.workspace.on("file-open", () => {
				if (fileOpenDebounce) clearTimeout(fileOpenDebounce);
				fileOpenDebounce = setTimeout(() => {
					fileOpenDebounce = null;
					this.updateSourceModeClass();
				}, 200);
			}),
		);

		// Cleanup on unload
		this.register(() => {
			if (layoutDebounce) clearTimeout(layoutDebounce);
			if (leafDebounce) clearTimeout(leafDebounce);
			if (fileOpenDebounce) clearTimeout(fileOpenDebounce);
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
}
