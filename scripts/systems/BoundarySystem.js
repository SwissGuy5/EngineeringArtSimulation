export class BoundarySystem {
    constructor(bounds) {
        this.bounds = bounds;
    }

    update(world) {
        // Query all entities with a position
        const entities = world.query(["position"]);

        const w = this.bounds.width;
        const h = this.bounds.height;

        for (const entity of entities) {
            const p = entity.components.position;

            if (p.x < 0) p.x += w;
            if (p.x > w) p.x -= w;

            if (p.y < 0) p.y += h;
            if (p.y > h) p.y -= h;
        }
    }

    setBounds(width, height) {
        this.bounds.width = width;
        this.bounds.height = height;
    }
}