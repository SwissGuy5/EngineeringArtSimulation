import { Particle } from "../entities/particle.js";

export class EntityManager {
    constructor(world) {
        this.world = world;
    }

    spawnRandomParticle(size = 2) {
        const { width, height } = this.world.getBounds();
        const x = Math.random() * width;
        const y = Math.random() * height;
        return this.spawnParticle(x, y, size);
    }

    spawnParticle(x, y, size = 2) {
        const entity = Particle(x, y, size);
        return this.world.addEntity(entity);
    }
}