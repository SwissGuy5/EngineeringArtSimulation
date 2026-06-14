export class ParameterStore {
    constructor() {
        this.values = {
            particleCount: 5000,
            particleSize: 2,
            particleColor: "#ffffff",
            particleDistance: 1,
            particleMaxVelocity: 5,
            backgroundColor: "#000000",
            fieldStrength: 1,
            fieldShape: 0,
            fieldSize: 10,
            chaos: 0, // 0-1, where 0 is no chaos and 1 is maximum chaos

            // flowStrength: 0.15,
            // maxSpeed: 2,
            flockRadius: 20,
            flockSeparation: 5,
            flockSeparationStrength: 0,
            flockCohesionStrength: 0.002,
            flockAlignmentStrength: 0,
            flockMaxForce: 100,
            // flockFieldOfView: 180,
            showFps: true,
            paused: false
        };
    }

    get(key) {
        const value = this.values[key];
        if (value === undefined) {
            throw new Error(`Parameter "${key}" not found`);
        }
        return this.values[key];
    }

    set(key, value) {
        if (this.values[key] === undefined) {
            throw new Error(`Parameter "${key}" not found`);
        }
        this.values[key] = value;
    }

    has(key) {
        return key in this.values;
    }
}