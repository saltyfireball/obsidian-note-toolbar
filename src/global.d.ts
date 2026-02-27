interface FigletAPI {
	openModal(app: any, plugin: any, editor: any): void;
}

interface Window {
	figletAPI?: FigletAPI;
}
