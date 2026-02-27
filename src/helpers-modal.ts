import { Modal, Notice, Plugin } from "obsidian";
import type { App } from "obsidian";

export class HelpersModal extends Modal {
	private editor: any;
	private plugin: Plugin | null;

	constructor(app: App, editor: any, plugin?: Plugin) {
		super(app);
		this.editor = editor;
		this.plugin = plugin || null;
	}

	onOpen() {
		const { contentEl } = this;
		contentEl.empty();
		contentEl.addClass("sf-highlight-helpers-modal");

		contentEl.createEl("h2", { text: "Helpers" });

		const selection = (this.editor?.getSelection?.() || "").trim();
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
				actions.createEl("button", { text: "Figlet Font (ASCII Art)" }).addEventListener(
					"click",
					() => {
						this.close();
						if (this.plugin) {
							window.figletAPI?.openModal(this.app, this.plugin, this.editor);
						}
					},
				);
			}
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
			actions.createEl("button", { text: "Figlet Font (ASCII Art)" }).addEventListener(
				"click",
				() => {
					this.close();
					if (this.plugin) {
						window.figletAPI?.openModal(this.app, this.plugin, this.editor);
					}
				},
			);
		}
	}

	onClose() {
		this.contentEl.empty();
	}
}
