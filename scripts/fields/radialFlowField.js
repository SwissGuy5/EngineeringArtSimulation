export class RadialFlowField {
    constructor(world, params) {
        this.world = world;
        this.params = params;
    }

    sample(x, y) {
        const { width, height } = this.world.getBounds();
        const cx = width / 2;
        const cy = height / 2;
        const dx = x - cx;
        const dy = y - cy;
        const distance = Math.hypot(dx, dy) || 1;
        const strength = 1 / (1 + distance * this.params.get("fieldScale") * 80);

        return {
            x: (dx / distance) * strength,
            y: (dy / distance) * strength
        };
    }
}