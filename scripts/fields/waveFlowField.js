export class WaveFlowField {
    constructor(params) {
        this.params = params;
    }

    sample(x, y) {
        const scale = this.params.get("fieldScale");
        const wave = Math.sin((x + y) * scale * 1.5);
        return {
            x: Math.cos(wave * Math.PI * 2),
            y: Math.sin((x - y) * scale * 2)
        };
    }
}