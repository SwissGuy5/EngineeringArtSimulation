export class ParameterStore {
    constructor() {
        this.values = {
            particleCount: 5000,
            particleSize: 2,
            // particleColor: "#ffffff",
            // particleDistance: 1,
            particleMaxVelocity: 5,
            backgroundColor: "#000000",
            fieldStrength: 1,
            // fieldShape: 0,
            // fieldSize: 10,
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
            paused: false,

            color: "#ffffff",
            velocityScaler: .8,
            seperationDistance: 20,
            fieldShape: 3,
            chaos: 1 // 0-1, where 0 is no chaos and 1 is maximum chaos
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

    update(newValues) {
        console.log('Field Shape:', newValues.dominantChannel);
        const defaults = this.defaults(newValues.dominantChannel);
        this.set("fieldShape", newValues.dominantChannel);
        this.set("velocityScaler", defaults.velocityScaler + newValues.beatVelocity);
        this.set("seperationDistance", defaults.seperationDistance + newValues.rms_norm || 0); // TODO
        this.set("chaos", defaults.chaos + newValues.chaosVal || 0);
        this.set("color", newValues.pitchNorm || 0); // TODO
    }

    defaults(fieldShape = 0) {
        const obj = {
            velocityScaler: .8,
            seperationDistance: 20,
            chaos: 1
        }

        switch (fieldShape) {
            case 0:
                return obj
            case 1:
                return obj
            case 2:
                return obj
            case 3:
                return obj
            default:
                return obj
        }
    }
}