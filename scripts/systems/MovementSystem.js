export class MovementSystem {

    update(world) {

        const entities =
            world.query([
                "position",
                "velocity"
            ]);

        for (const entity of entities) {
            const p = entity.components.position;
            const v = entity.components.velocity;

            p.x += v.vx;
            p.y += v.vy;
        }
    }
}