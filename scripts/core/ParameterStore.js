export class ParameterStore {
    constructor() {
        this.values = {
            particleCount: 10000,
            particleSize: 2,
            flowStrength: 0.15,
            maxSpeed: 2,
            fieldScale: 0.02,
            flockRadius: 28,
            flockSeparation: 12,
            flockSeparationStrength: 0.08,
            flockCohesionStrength: 0.004,
            flockAlignmentStrength: 0.03,
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