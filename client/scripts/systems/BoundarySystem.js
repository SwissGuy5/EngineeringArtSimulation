export class BoundarySystem {
    update(world) {
        const entities = world.query(["position"]);

        const { width, height } = world.getBounds();

        if (width <= 0 || height <= 0) {
            return;
        }

        const wrap = (value, size) => ((value % size) + size) % size;

        for (const entity of entities) {
            const p = entity.components.position;

            p.x = wrap(p.x, width);
            p.y = wrap(p.y, height);
        }
    }
}