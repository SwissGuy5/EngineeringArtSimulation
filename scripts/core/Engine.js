export class Engine {
    constructor() {
        this.systems = [];
    }

    addSystem(system) {
        this.systems.push(system);
    }

    update(world) {
        for (const system of this.systems) {
            system.update(world);
        }
    }
}