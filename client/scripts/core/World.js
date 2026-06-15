export class World {
    constructor() {
        this.entities = new Map();
        this.nextEntityID = 0;
        this.bounds = { width: 0, height: 0 };
    }

    addEntity(entity) {
        const id = this.nextEntityID++;
        this.entities.set(id, entity);
        return id;
    }

    getEntity(id) {
        return this.entities.get(id);
    }

    setBounds(width, height) {
        this.bounds.width = Math.max(0, Number(width) || 0);
        this.bounds.height = Math.max(0, Number(height) || 0);
    }

    getBounds() {
        return { ...this.bounds };
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