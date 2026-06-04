export class ParameterStore {
    constructor() {
        this.values = {
            particleCount: 1500,
            particleSize: 2,
            flowStrength: 0.15,
            maxSpeed: 2,
            fieldScale: 0.002,
            backgroundColor: "#000000",
            particleColor: "#ffffff",
            paused: false
        };
    }

    get(key) {
        return this.values[key];
    }

    set(key, value) {
        this.values[key] = value;
    }

    has(key) {
        return key in this.values;
    }
}