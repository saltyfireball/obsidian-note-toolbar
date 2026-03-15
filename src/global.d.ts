interface FigletAPI {
	openModal(app: unknown, plugin: unknown, editor: unknown): void;
}

interface OpenInNewTabAPI {
	isSplitPreviewActive(): boolean;
	toggleSplitPreview(): void;
}

interface BetterSearchReplaceAPI {
	open(app: unknown): void;
}

interface Window {
	figletAPI?: FigletAPI;
	openInNewTabAPI?: OpenInNewTabAPI;
	betterSearchReplaceAPI?: BetterSearchReplaceAPI;
}
