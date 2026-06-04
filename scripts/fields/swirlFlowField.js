export class SwirlFlowField {
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
        const twist = this.params.get("fieldScale") * 250;

        return {
            x: (-dy / distance) * twist + Math.cos(distance * this.params.get("fieldScale")),
            y: (dx / distance) * twist + Math.sin(distance * this.params.get("fieldScale"))
        };
    }
}