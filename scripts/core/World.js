export class World {
    constructor() {
        this.entities = new Map();
        this.nextEntityID = 0;
    }

    addEntity(entity) {
        const id = this.nextEntityID++;
        this.entities.set(id, entity);
        return id;
    }

    getEntity(id) {
        return this.entities.get(id);
    }

    query(requiredComponents = []) {
        const result = [];
        for (const entity of this.entities.values()) {
            const comps = entity.components;
            if (requiredComponents.every(c => comps[c])) {
                result.push(entity);
            }
        }
        return result;
    }
}