interface FigletAPI {
	openModal(app: unknown, plugin: unknown, editor: unknown): void;
}

interface Window {
	figletAPI?: FigletAPI;
}
