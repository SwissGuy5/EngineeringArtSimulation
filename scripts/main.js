import { Engine } from "./core/Engine.js";
import { World } from "./core/World.js";
import { FlowField } from "./fields/FlowField.js";
import { FlowFieldSystem } from "./systems/FlowFieldSystem.js";
import { BoundarySystem } from "./systems/BoundarySystem.js";
import { MovementSystem } from "./systems/MovementSystem.js";
import { RenderSystem } from "./systems/RenderSystem.js";
import { CanvasRenderer } from "./render/CanvasRenderer.js";
import { ParameterStore } from "./core/ParameterStore.js";
import { Particle } from "./entities/particle.js";
import { setupFullscreenShortcut } from "./utils/loadUtils.js";

const canvas = document.getElementById("canvas");
const renderer = new CanvasRenderer(canvas);
const params = new ParameterStore();
const world = new World();
const field = new FlowField(params);
const engine = new Engine();

function syncViewport() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    renderer.resize(width, height);
    world.setBounds(width, height);
}

setupFullscreenShortcut();
window.addEventListener("resize", syncViewport);
document.addEventListener("fullscreenchange", syncViewport);

syncViewport();

for (let i = 0; i < params.get("particleCount"); i++) {
    const { width, height } = world.getBounds();
    const x = Math.random() * width;
    const y = Math.random() * height;
    world.addEntity(Particle(x, y, params.get("particleSize")));
}

engine.addSystem(new FlowFieldSystem(field, params));
engine.addSystem(new MovementSystem());
engine.addSystem(new BoundarySystem());
engine.addSystem(new RenderSystem(renderer, params));

function loop() {
    engine.update(world);
    requestAnimationFrame(loop);
}
loop();