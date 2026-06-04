export class LatticeFlowField {
    constructor(params) {
        this.params = params;
    }

    sample(x, y) {
        const scale = this.params.get("fieldScale") * 160;
        const gx = Math.floor(x * scale);
        const gy = Math.floor(y * scale);
        const parity = (gx + gy) % 2 === 0 ? 1 : -1;

        return {
            x: parity * Math.sin(y * scale * 2),
            y: -parity * Math.cos(x * scale * 2)
        };
    }
}