export class MovementSystem {
    constructor(params) {
        this.params = params;
    }

    update(world) {
        const entities = world.query(["position", "velocity"]);
        const velocityScaler = this.params.get("velocityScaler");
        for (const entity of entities) {
            const p = entity.components.position;
            const v = entity.components.velocity;

            // Cap Speed
            const maxSpeed = velocityScaler * this.params.get("particleMaxVelocity");
            const speed = Math.sqrt(v.vx * v.vx + v.vy * v.vy);
            if (speed > maxSpeed) {
                v.vx = (v.vx / speed) * maxSpeed;
                v.vy = (v.vy / speed) * maxSpeed;
            }

            p.x += v.vx * velocityScaler;
            p.y += v.vy * velocityScaler;
        }
    }
}