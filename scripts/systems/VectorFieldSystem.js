export class VectorFieldSystem {
    constructor(field, params) {
        this.field = field;
        this.params = params;
    }

    update(world) {
        const entities = world.query(["position", "velocity"]);
        const strength = this.params.get("fieldStrength");

        for (const entity of entities) {
            const p = entity.components.position;
            const v = entity.components.velocity;
            const flow = this.field.sample(world, p.x, p.y);

            v.vx += flow.x * strength;
            v.vy += flow.y * strength;
        }
    }
}