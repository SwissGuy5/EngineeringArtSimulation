export class FlowField {
    constructor(params) {
        this.params = params;
    }

    sample(x, y) {
        const scale = this.params.get("fieldScale");
        const angle = Math.sin(x * scale) + Math.cos(y * scale);
        return { x: Math.cos(angle), y: Math.sin(angle) };
    }
}