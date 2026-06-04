export class EntityManager {
    constructor(world) {
        this.world = world;
    }

    spawnRandomParticle() {
        const x = Math.random() * this.world.bounds.width;
        const y = Math.random() * this.world.bounds.height;
        return this.spawnParticle(x, y);
    }
    spawnParticle(x, y) {
        const { Particle } = require("../entities/Particle.js");
        const entity = Particle(x, y);
        return this.world.addEntity(entity);
    }
}