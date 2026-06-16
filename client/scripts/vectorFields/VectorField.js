import { noise } from "/scripts/vectorFields/noise.js";

export class VectorField {
    constructor(params) {
        // this.params = params;
        this.gridSize = 20;
        this.field;
    }        

    initField(type) {
        switch (type) {
            case "neutral":
            case 0:
                this.neutralField();
                break;
            case "random":
            case 1:
                this.randomField();
                break;
            case "perlin":
            case 2:
                this.perlinField();
                break;
            case 3:
            case "smooth":
                this.smoothField(1, 5, 1);
                break;
            case 4:
            case "spiral":
                this.spiralField();
                break;
            default:
                this.neutralField();
                break;
                // throw new Error("Unknown field type: " + type);
        }
    }

    neutralField() {
        this.field = [];
        for (let x = 0; x < this.gridSize; x++) {
            this.field[x] = [];
            for (let y = 0; y < this.gridSize; y++) {
                this.field[x][y] = { x: 0, y: 0 };
            }
        }
    }

    randomField() {
        this.field = [];
        for (let x = 0; x < this.gridSize; x++) {
            this.field[x] = [];
            for (let y = 0; y < this.gridSize; y++) {
                const angle = Math.random() * Math.PI * 2;
                this.field[x][y] = { x: Math.cos(angle), y: Math.sin(angle) };
            }
        }
    }

    perlinField(smoothness = 0.2) {
        this.field = [];
        const seed = Math.random() * 1000;
        for (let x = 0; x < this.gridSize; x++) {
            this.field[x] = [];
            for (let y = 0; y < this.gridSize; y++) {
                const angle = noise(x * smoothness, y * smoothness, seed) * Math.PI * 2;
                this.field[x][y] = { x: Math.cos(angle), y: Math.sin(angle) };
            }
        }
    }

    smoothField(seed = 1, iterations = 2, freq = 0.15) {
        this.field = [];

        // deterministic hash noise (fast + no libs)
        const hash = (x, y) => {
            let n =
                x * 374761393 +
                y * 668265263 +
                seed * 1442695040888963407;

            n = (n ^ (n >>> 13)) * 1274126177;
            n = (n ^ (n >>> 16)) >>> 0;

            return n / 4294967295;
        };

        const lerp = (a, b, t) => a + (b - a) * t;
        const fade = (t) => t * t * (3 - 2 * t);

        // scalar noise
        const noise = (x, y) => {
            const xi = Math.floor(x);
            const yi = Math.floor(y);

            const xf = x - xi;
            const yf = y - yi;

            const tl = hash(xi, yi);
            const tr = hash(xi + 1, yi);
            const bl = hash(xi, yi + 1);
            const br = hash(xi + 1, yi + 1);

            const u = fade(xf);

            const top = lerp(tl, tr, u);
            const bottom = lerp(bl, br, u);

            return lerp(top, bottom, fade(yf));
        };

        // build scalar field
        const scalar = Array.from({ length: this.gridSize }, () =>
            Array(this.gridSize).fill(0)
        );

        for (let x = 0; x < this.gridSize; x++) {
            for (let y = 0; y < this.gridSize; y++) {
                scalar[x][y] = noise(x * freq, y * freq);
            }
        }

        const wrap = (v) => (v + this.gridSize) % this.gridSize;

        const lerpV = (a, b, t) => ({
            x: a.x + (b.x - a.x) * t,
            y: a.y + (b.y - a.y) * t
        });

        const buildVectors = () => {
            const field = Array.from({ length: this.gridSize }, () =>
                Array.from({ length: this.gridSize }, () => ({ x: 0, y: 0 }))
            );

            for (let x = 0; x < this.gridSize; x++) {
                for (let y = 0; y < this.gridSize; y++) {

                    const dx =
                        scalar[wrap(x + 1)][y] -
                        scalar[wrap(x - 1)][y];

                    const dy =
                        scalar[x][wrap(y + 1)] -
                        scalar[x][wrap(y - 1)];

                    let vx = dy;
                    let vy = -dx;

                    const len = Math.hypot(vx, vy) || 1;
                    vx /= len;
                    vy /= len;

                    field[x][y] = { x: vx, y: vy };
                }
            }

            return field;
        };

        this.field = buildVectors();

        const smoothStep = () => {
            const next = Array.from({ length: this.gridSize }, () =>
                Array.from({ length: this.gridSize }, () => ({ x: 0, y: 0 }))
            );

            const get = (x, y) =>
                this.field[wrap(x)][wrap(y)];

            for (let x = 0; x < this.gridSize; x++) {
                for (let y = 0; y < this.gridSize; y++) {

                    const v = get(x, y);

                    const neighbor = {
                        x:
                            (get(x + 1, y).x +
                            get(x - 1, y).x +
                            get(x, y + 1).x +
                            get(x, y - 1).x) / 4,

                        y:
                            (get(x + 1, y).y +
                            get(x - 1, y).y +
                            get(x, y + 1).y +
                            get(x, y - 1).y) / 4
                    };

                    next[x][y] = lerpV(v, neighbor, 0.35);
                }
            }

            this.field = next;
        };

        for (let i = 0; i < iterations; i++) {
            smoothStep();
        }
    }

    spiralField() {
        this.field = [];

        const cx = (this.gridSize - 1) / 2;
        const cy = (this.gridSize - 1) / 2;
        const arms = 4;
        const twist = 1.15;
        const branchChance = 0.35;

        const clamp01 = (v) => Math.max(0, Math.min(1, v));
        const smoothstep = (a, b, t) => {
            const s = clamp01((t - a) / (b - a));
            return s * s * (3 - 2 * s);
        };

        const hash = (x, y) => {
            const n = Math.sin(x * 127.1 + y * 311.7 + 74.7) * 43758.5453123;
            return n - Math.floor(n);
        };

        for (let x = 0; x < this.gridSize; x++) {
            this.field[x] = [];
            for (let y = 0; y < this.gridSize; y++) {
                const dx = x - cx;
                const dy = y - cy;
                const dist = Math.hypot(dx, dy) / (this.gridSize * 0.5);
                const angle = Math.atan2(dy, dx);

                const spiralAngle = angle + dist * Math.PI * 2 * twist;
                const armPhase = Math.cos(spiralAngle * arms);

                const tangentX = -dy;
                const tangentY = dx;
                const radialX = dx;
                const radialY = dy;

                const armStrength = smoothstep(1, 0.15, Math.abs(armPhase));
                const centerStrength = smoothstep(1, 0, dist);

                let vx = tangentX * (0.9 * armStrength + 0.25 * centerStrength) + radialX * 0.12;
                let vy = tangentY * (0.9 * armStrength + 0.25 * centerStrength) + radialY * 0.12;

                const branchSeed = hash(x, y);
                if (branchSeed > 1 - branchChance && dist > 0.18) {
                    const branchAngle = spiralAngle + (branchSeed > 0.5 ? 1 : -1) * (0.45 + branchSeed * 0.35);
                    vx += Math.cos(branchAngle) * 0.75;
                    vy += Math.sin(branchAngle) * 0.75;
                }

                const swirl = 0.35 + 0.65 * (1 - dist);
                vx += -dy * 0.03 * swirl;
                vy += dx * 0.03 * swirl;

                const len = Math.hypot(vx, vy) || 1;
                this.field[x][y] = { x: vx / len, y: vy / len };
            }
        }
    }

    sample(world, x, y) {
        const { width, height } = world.getBounds();
        const gridX = Math.floor((x / width) * this.gridSize);
        const gridY = Math.floor((y / height) * this.gridSize);
        return this.field[gridX][gridY];
    }
}