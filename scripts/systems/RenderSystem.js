export class RenderSystem {

    constructor(renderer, params) {
        this.renderer = renderer;
        this.params = params;
    }

    update(world) {
        this.renderer.clear(
            this.params.get(
                "backgroundColor"
            )
        );

        const entities = world.query(
            [
                "position",
                "renderable"
            ]
        );

        const color = this.params.get("particleColor");

        for (const entity of entities) {
            const position = entity.components.position;

            const renderable = entity.components.renderable;

            this.renderer.drawPoint(
                position.x,
                position.y,
                renderable.size,
                color
            );
        }
    }
}