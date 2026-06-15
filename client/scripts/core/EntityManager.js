import { Particle } from "../entities/particle.js";

export class EntityManager {
    constructor(world) {
        this.world = world;
    }

    spawnRandomParticle(size = 2) {
        const { width, height } = this.world.getBounds();
        const x = Math.random() * width;
        const y = Math.random() * height;
        const vx = (Math.random() - 0.5) * 2;
        const vy = (Math.random() - 0.5) * 2;
        return this.spawnParticle(x, y, vx, vy, size);
    }

    spawnParticle(x, y, vx = 0, vy = 0, size = 2) {
        const entity = Particle(x, y, vx, vy, size);
        return this.world.addEntity(entity);
    }
}