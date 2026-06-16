export class ParameterStore {
    constructor() {
        this.values = {
            particleCount: 5000,
            particleSize: 5,
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
            flockSeparation: 10,
            flockSeparationStrength: .2,
            flockCohesionStrength: 0.02,
            flockAlignmentStrength: 0,
            flockMaxForce: 100,
            // flockFieldOfView: 180,
            showFps: true,
            paused: false,
            baseColor: "rgba(255, 255, 255, 1)",
            targetColor: "rgb(92, 174, 209)",

            colorFactor: 1, // 0-1, where 0 is white and 1 is target color
            velocityScaler: .8,
            seperationDistance: 20,
            fieldShape: 0,
            chaos: 1 // 0-1, where 0 is no chaos and 1 is maximum chaos
        };

        this.initUpdate(0);
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

    initUpdate(fieldShape) {
        const defaults = this.defaults(fieldShape);
        this.set("fieldShape", fieldShape);
        this.set("velocityScaler", defaults.velocityScaler);
        this.set("seperationDistance", defaults.seperationDistance);
        this.set("chaos", defaults.chaos);
        this.set("colorFactor", 0);
        this.set("flockCohesionStrength", defaults.cohesionStrength);
    }

    update(newValues) {
        console.log('Field Shape:', newValues.dominantChannel);
        const defaults = this.defaults(newValues.dominantChannel);
        this.set("fieldShape", newValues.dominantChannel);
        this.set("velocityScaler", defaults.velocityScaler + newValues.beatVelocity / 2);
        this.set("seperationDistance", defaults.seperationDistance + newValues.rms_norm || 0); // TODO
        this.set("chaos", defaults.chaos + newValues.chaosVal || 0);
        this.set("colorFactor", newValues.pitchNorm || 0);
        this.set("flockCohesionStrength", defaults.cohesionStrength);
    }

    defaults(fieldShape = 0) {
        const obj = {
            velocityScaler: .5,
            seperationDistance: 10,
            chaos: 0,
            cohesionStrength: 0.02,
        }

        switch (fieldShape) {
            case 0:
                obj.velocityScaler = .3;
                obj.cohesionStrength = 0;
                return obj
            case 1:
                obj.velocityScaler = .25;
                obj.chaos = .5;
                // obj.seperationDistance = 10;
                return obj
            case 2:
                obj.velocityScaler = .8;
                return obj
            case 3:
                obj.velocityScaler = .8;
                return obj
            case 4:
                // obj.velocityScaler = .5;
                obj.seperationDistance = 0;
                // obj.cohesionStrength = 0.1;
            default:
                return obj
        }
    }
}