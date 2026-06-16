export class BoundarySystem {
    constructor(params) {
        this.params = params;
    }

    sendToOppositeSide(position, bounds) {
        const { width, height } = bounds;

        if (position.x < 0) {
            position.x += width;
        } else if (position.x >= width) {
            position.x -= width;
        }

        if (position.y < 0) {
            position.y += height;
        } else if (position.y >= height) {
            position.y -= height;
        }
    }

    sendToCenter(position, bounds) {
        const { width, height } = bounds;

        if (
            position.x < 0 ||
            position.x >= width ||
            position.y < 0 ||
            position.y >= height
        ) {
            position.x = width / 2;
            position.y = height / 2;
        }
    }

    update(world) {
        const entities = world.query(["position"]);
        const fieldShape = this.params.get("fieldShape");
        const bounds = world.getBounds();

        for (const entity of entities) {
            const position = entity.components.position;

            switch (fieldShape) {
                case 0:
                case 1:
                case 2:
                case 3:
                    this.sendToOppositeSide(position, bounds);
                    break;

                case 4:
                    this.sendToCenter(position, bounds);
                    break;

                default:
                    this.sendToOppositeSide(position, bounds);
                    break;
            }
        }
    }
}