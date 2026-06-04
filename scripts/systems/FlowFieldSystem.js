export class FlowFieldSystem {
    constructor(flowField, params) {
        this.field = flowField;
        this.params = params;
    }

    update(world) {
        const entities = world.query(["position", "velocity", "flowFollower"]);
        const strength = this.params.get("flowStrength");
        const maxSpeed = this.params.get("maxSpeed");

        for (const entity of entities) {
            const p = entity.components.position;
            const v = entity.components.velocity;
            const flow = this.field.sample(p.x, p.y);

            v.vx += flow.x * strength;
            v.vy += flow.y * strength;

            const speed = Math.hypot(v.vx, v.vy);

            if (speed > maxSpeed) {
                v.vx = (v.vx / speed) * maxSpeed;
                v.vy = (v.vy / speed) * maxSpeed;
                v.vy = (v.vy / speed) * maxSpeed;
            }
        }
    }
}