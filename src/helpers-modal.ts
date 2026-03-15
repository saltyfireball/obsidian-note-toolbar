import { Modal, Notice, Plugin } from "obsidian";
import type { App } from "obsidian";

interface EditorLike {
	getSelection(): string;
	replaceSelection(text: string): void;
}

export class HelpersModal extends Modal {
	private editor: EditorLike;
	private plugin: Plugin | null;

	constructor(app: App, editor: EditorLike, plugin?: Plugin) {
		super(app);
		this.editor = editor;
		this.plugin = plugin || null;
	}

	onOpen() {
		const { contentEl } = this;
		contentEl.empty();
		contentEl.addClass("sf-highlight-helpers-modal");

		contentEl.createEl("h2", { text: "Helpers" });

		const selection = (this.editor.getSelection() || "").trim();
		const actions = contentEl.createDiv("sf-helper-actions");

		if (selection) {
			actions.createEl("button", { text: "Wrap selection in inline code" }).addEventListener(
				"click",
				() => {
					const currentSelection = this.editor.getSelection();
					if (!currentSelection) {
						new Notice("Select some text first");
						return;
					}
					this.editor.replaceSelection(`\`${currentSelection}\``);
					this.close();
				},
			);

			actions.createEl("button", { text: "Wrap selection in code block" }).addEventListener(
				"click",
				() => {
					const currentSelection = this.editor.getSelection();
					if (!currentSelection) {
						new Notice("Select some text first");
						return;
					}
					const wrapped = ["```", currentSelection, "```"]
						.filter((value) => value !== undefined)
						.join("\n");
					this.editor.replaceSelection(wrapped);
					this.close();
				},
			);

			// Figlet Font option - available when text is selected
			if (window.figletAPI) {
				actions.createEl("button", { text: "Figlet font (ASCII art)" }).addEventListener(
					"click",
					() => {
						this.close();
						if (this.plugin) {
							window.figletAPI?.openModal(this.app, this.plugin, this.editor);
						}
					},
				);
			}

			this.addSearchReplaceButton(actions);
			this.addSplitPreviewButton(actions);
			return;
		}

		actions.createEl("button", { text: "Insert empty code block" }).addEventListener(
			"click",
			() => {
				this.editor.replaceSelection("```\n\n```");
				this.close();
			},
		);

		// Figlet Font option - also available without selection
		if (window.figletAPI) {
			actions.createEl("button", { text: "Figlet font (ASCII art)" }).addEventListener(
				"click",
				() => {
					this.close();
					if (this.plugin) {
						window.figletAPI?.openModal(this.app, this.plugin, this.editor);
					}
				},
			);
		}

		this.addSearchReplaceButton(actions);
		this.addSplitPreviewButton(actions);
	}

	private addSearchReplaceButton(actions: HTMLDivElement): void {
		if (!window.betterSearchReplaceAPI) return;

		actions.createEl("button", { text: "Search and replace" }).addEventListener(
			"click",
			() => {
				this.close();
				window.betterSearchReplaceAPI?.open(this.app);
			},
		);
	}

	private addSplitPreviewButton(actions: HTMLDivElement): void {
		if (!window.openInNewTabAPI) return;

		const isActive = window.openInNewTabAPI.isSplitPreviewActive();
		const label = isActive
			? "Split preview: ON (click to disable)"
			: "Split preview: OFF (click to enable)";

		const btn = actions.createEl("button", { text: label });
		if (isActive) btn.addClass("mod-cta");

		btn.addEventListener("click", () => {
			window.openInNewTabAPI?.toggleSplitPreview();
			this.close();
		});
	}

	onClose() {
		this.contentEl.empty();
	}
}
