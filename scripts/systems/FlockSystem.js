export class FlockSystem {
    constructor(params) {
        this.params = params;
    }

    update(world) {
        const entities = world.query(["position", "velocity", "flowFollower"]);

        const radius = this.params.get("flockRadius");
        const separationDistance = this.params.get("flockSeparation");
        const separationStrength = this.params.get("flockSeparationStrength");
        const cohesionStrength = this.params.get("flockCohesionStrength");
        const alignmentStrength = this.params.get("flockAlignmentStrength");
        const maxSpeed = this.params.get("maxSpeed");

        const radiusSq = radius * radius;
        const separationSq = separationDistance * separationDistance;
        const grid = new Map();

        const cellKey = (x, y) => `${x},${y}`;

        for (const entity of entities) {
            const position = entity.components.position;
            const cellX = Math.floor(position.x / radius);
            const cellY = Math.floor(position.y / radius);
            const key = cellKey(cellX, cellY);

            if (!grid.has(key)) {
                grid.set(key, []);
            }

            grid.get(key).push(entity);
        }

        for (const entity of entities) {
            const position = entity.components.position;
            const velocity = entity.components.velocity;
            const cellX = Math.floor(position.x / radius);
            const cellY = Math.floor(position.y / radius);

            let neighborCount = 0;
            let centerX = 0;
            let centerY = 0;
            let averageVx = 0;
            let averageVy = 0;
            let separationX = 0;
            let separationY = 0;

            for (let offsetY = -1; offsetY <= 1; offsetY += 1) {
                for (let offsetX = -1; offsetX <= 1; offsetX += 1) {
                    const neighbors = grid.get(cellKey(cellX + offsetX, cellY + offsetY));

                    if (!neighbors) {
                        continue;
                    }

                    for (const other of neighbors) {
                        if (other === entity) {
                            continue;
                        }

                        const otherPosition = other.components.position;
                        const otherVelocity = other.components.velocity;
                        const dx = otherPosition.x - position.x;
                        const dy = otherPosition.y - position.y;
                        const distanceSq = dx * dx + dy * dy;

                        if (distanceSq > radiusSq || distanceSq === 0) {
                            continue;
                        }

                        neighborCount += 1;
                        centerX += otherPosition.x;
                        centerY += otherPosition.y;
                        averageVx += otherVelocity.vx;
                        averageVy += otherVelocity.vy;

                        if (distanceSq < separationSq) {
                            const distance = Math.sqrt(distanceSq) || 1;
                            separationX -= dx / distance;
                            separationY -= dy / distance;
                        }
                    }
                }
            }

            if (neighborCount > 0) {
                const inverseCount = 1 / neighborCount;
                const cohesionX = (centerX * inverseCount - position.x) * cohesionStrength;
                const cohesionY = (centerY * inverseCount - position.y) * cohesionStrength;
                const alignmentX = (averageVx * inverseCount - velocity.vx) * alignmentStrength;
                const alignmentY = (averageVy * inverseCount - velocity.vy) * alignmentStrength;

                velocity.vx += cohesionX + alignmentX + separationX * separationStrength;
                velocity.vy += cohesionY + alignmentY + separationY * separationStrength;
            }

            const speed = Math.hypot(velocity.vx, velocity.vy);

            if (speed > maxSpeed) {
                velocity.vx = (velocity.vx / speed) * maxSpeed;
                velocity.vy = (velocity.vy / speed) * maxSpeed;
            }
        }
    }
}