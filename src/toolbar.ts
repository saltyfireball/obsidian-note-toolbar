import { MarkdownView, Notice, WorkspaceLeaf, TFile, moment, Plugin } from "obsidian";
import { HelpersModal } from "./helpers-modal";

// Type for toolbar action returned by view.addAction
interface ToolbarAction {
	buttonEl?: HTMLElement;
	el?: HTMLElement;
	element?: HTMLElement;
	remove?: () => void;
	setAttr?: (name: string, value: string) => void;
	setTitle?: (title: string) => void;
	__sfIcon?: string;
	__sfTitle?: string;
}

interface ToolbarActions {
	today?: ToolbarAction;
	helpers?: ToolbarAction;
	sourceToggle?: ToolbarAction;
}

export interface ToolbarPlugin extends Plugin {
	toolbarActionButtons: WeakMap<MarkdownView, ToolbarActions>;
	sourceModeState: boolean;
}

const TOOLBAR_ATTR = "data-sf-toolbar";

// Helper to get element from toolbar action
function getActionElement(action: ToolbarAction | undefined): HTMLElement | null {
	if (!action) return null;
	return action.buttonEl || action.el || action.element || (action as unknown as HTMLElement);
}

// Helper to set attribute on action if supported
function setActionAttr(action: ToolbarAction, name: string, value: string): void {
	if (typeof action.setAttr === "function") {
		action.setAttr(name, value);
	}
}

// Helper to detect current source mode state
function getSourceModeState(view: MarkdownView): boolean {
	const state = typeof view.getState === "function" ? view.getState() : {};
	const mode = typeof view.getMode === "function" ? view.getMode() : null;
	return mode !== "preview" && state?.source === true;
}

export function ensureToolbarActions(plugin: ToolbarPlugin): void {
	const view = plugin.app.workspace.getActiveViewOfType(MarkdownView);
	if (!view) return;
	if (plugin.toolbarActionButtons.has(view)) return;

	const todayAction = view.addAction("calendar", "Open today's note", async () => {
		try {
			const dailyNotesModule = await import("obsidian-daily-notes-interface");
			const dailyNotes = dailyNotesModule.getAllDailyNotes();
			const todaysNote = dailyNotesModule.getDailyNote(
				moment(),
				dailyNotes,
			) as TFile | null;
			if (!todaysNote) {
				new Notice("Today's daily note was not found.");
				return;
			}

			const workspace = plugin.app.workspace;
			const activeView = workspace.getActiveViewOfType(MarkdownView);
			const activeViewLeaf = activeView?.leaf ?? null;
			if (isLeafShowingFile(activeViewLeaf, todaysNote)) {
				return;
			}

			const otherLeaf = workspace
				.getLeavesOfType("markdown")
				.find(
					(leaf: WorkspaceLeaf) =>
						leaf !== activeViewLeaf && isLeafShowingFile(leaf, todaysNote),
				);

			if (otherLeaf) {
				workspace.setActiveLeaf(otherLeaf, { focus: true });
				return;
			}

			const leafToOpen = activeViewLeaf ?? workspace.getLeaf(false);
			await leafToOpen.openFile(todaysNote);
		} catch (err) {
			console.error("Failed to open today's daily note", err);
			new Notice("Unable to open today's daily note.");
		}
	}) as ToolbarAction;

	const helpersAction = view.addAction("wand", "Helpers", () => {
		new HelpersModal(plugin.app, view.editor, plugin).open();
	}) as ToolbarAction;

	const sourceToggleAction = createSourceToggleAction(
		plugin,
		view,
		"code-2",
		"Switch to source",
	);

	setActionAttr(todayAction, TOOLBAR_ATTR, "today");
	setActionAttr(helpersAction, TOOLBAR_ATTR, "helpers");

	plugin.toolbarActionButtons.set(view, {
		today: todayAction,
		helpers: helpersAction,
		sourceToggle: sourceToggleAction,
	});

	reorderToolbarActions(plugin, view);
	updateSourceToggleAction(plugin, view);
}

export function cleanupToolbarActions(plugin: ToolbarPlugin): void {
	plugin.app.workspace.iterateAllLeaves((leaf: WorkspaceLeaf) => {
		const view = leaf.view;
		if (!view || typeof (view as MarkdownView).getViewType !== "function") return;
		if ((view as MarkdownView).getViewType() !== "markdown") return;
		removeToolbarActions(plugin, view as MarkdownView);
	});
}

export function updateSourceToggleAction(
	plugin: ToolbarPlugin,
	view: MarkdownView | null,
): void {
	if (!view) return;
	const actions = plugin.toolbarActionButtons.get(view);
	if (!actions) return;

	const isSource = getSourceModeState(view);
	const title = isSource ? "Switch to live preview" : "Switch to source";
	const icon = isSource ? "eye" : "code-2";
	const toggleAction = actions.sourceToggle;
	const iconChanged = !toggleAction || toggleAction.__sfIcon !== icon;
	const titleChanged = !toggleAction || toggleAction.__sfTitle !== title;

	if (!iconChanged) {
		if (titleChanged && toggleAction && typeof toggleAction.setTitle === "function") {
			toggleAction.setTitle(title);
			toggleAction.__sfTitle = title;
		}
		return;
	}

	removeAction(toggleAction);
	const newAction = createSourceToggleAction(plugin, view, icon, title);
	plugin.toolbarActionButtons.set(view, {
		...actions,
		sourceToggle: newAction,
	});
	reorderToolbarActions(plugin, view);
}

function reorderToolbarActions(plugin: ToolbarPlugin, view: MarkdownView): void {
	const actions = plugin.toolbarActionButtons.get(view);
	if (!actions) return;

	const todayEl = getActionElement(actions.today);
	const helpersEl = getActionElement(actions.helpers);
	const toggleEl = getActionElement(actions.sourceToggle);

	const toolbarParent = todayEl?.parentNode || helpersEl?.parentNode || toggleEl?.parentNode;
	if (!todayEl || !helpersEl || !toggleEl || !toolbarParent) return;

	const children = Array.from(toolbarParent.children);
	const firstNonPlugin = children.find(
		(child) =>
			child.classList?.contains("view-action") &&
			!child.hasAttribute(TOOLBAR_ATTR),
	);

	toolbarParent.insertBefore(todayEl, firstNonPlugin || null);
	toolbarParent.insertBefore(helpersEl, firstNonPlugin || null);
	toolbarParent.insertBefore(toggleEl, firstNonPlugin || null);
}

function createSourceToggleAction(
	plugin: ToolbarPlugin,
	view: MarkdownView,
	icon: string,
	title: string,
): ToolbarAction {
	const action = view.addAction(icon, title, () => {
		const isCurrentlySource = getSourceModeState(view);
		const currentState = typeof view.getState === "function" ? view.getState() : {};
		const newState = {
			...currentState,
			mode: "source",
			source: !isCurrentlySource,
		};
		void view.setState(newState, { history: false });
		if (typeof view.setEphemeralState === "function") {
			view.setEphemeralState({ source: newState.source });
		}
		// Delay update to allow state to settle
		setTimeout(() => {
			updateSourceToggleAction(plugin, view);
		}, 100);
	}) as ToolbarAction;

	setActionAttr(action, TOOLBAR_ATTR, "source");
	if (typeof action.setTitle === "function") {
		action.setTitle(title);
	}
	action.__sfIcon = icon;
	action.__sfTitle = title;
	return action;
}

function removeToolbarActions(
	plugin: ToolbarPlugin,
	view: MarkdownView,
): void {
	const actions = plugin.toolbarActionButtons.get(view);
	if (!actions) return;
	Object.values(actions)
		.filter(Boolean)
		.forEach((action) => removeAction(action as ToolbarAction));
	plugin.toolbarActionButtons.delete(view);
}

function removeAction(action: ToolbarAction | undefined): void {
	if (!action) return;
	if (typeof action.remove === "function") {
		action.remove();
		return;
	}
	const element = getActionElement(action);
	if (element && typeof element.remove === "function") {
		element.remove();
	}
}

function isLeafShowingFile(leaf: WorkspaceLeaf | null, file: TFile): leaf is WorkspaceLeaf {
	if (!leaf) return false;
	if (!(leaf.view instanceof MarkdownView)) return false;
	return leaf.view.file?.path === file.path;
}
