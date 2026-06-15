export class VectorFieldSystem {
    constructor(field, params) {
        this.field = field;
        this.params = params;
        this.fieldType = null;
    }

    update(world) {
        const entities = world.query(["position", "velocity"]);
        const strength = this.params.get("fieldStrength");
        const fieldShape = this.params.get("fieldShape");
        const chaos = this.params.get("chaos");

        if (fieldShape !== this.fieldType) {
            this.field.initField(fieldShape);
            this.fieldType = fieldShape;
        }

        for (const entity of entities) {
            const p = entity.components.position;
            const v = entity.components.velocity;
            const flow = this.field.sample(world, p.x, p.y);

            v.vx += flow.x * strength + (Math.random() / 2 - .25) * chaos;
            v.vy += flow.y * strength + (Math.random() / 2 - .25) * chaos;
        }
    }
}