import { Engine } from "./core/Engine.js";
import { World } from "./core/World.js";
import { FlowField } from "./fields/FlowField.js";
import { FlowFieldSystem } from "./systems/FlowFieldSystem.js";
import { BoundarySystem } from "./systems/BoundarySystem.js";
import { MovementSystem } from "./systems/MovementSystem.js";
import { RenderSystem } from "./systems/RenderSystem.js";
import { CanvasRenderer } from "./render/CanvasRenderer.js";
import { ParameterStore } from "./core/ParameterStore.js";
import { Particle } from "./entities/Particle.js";
import "./utils/loadUtils.js";

const params = new ParameterStore();
const world = new World();
const bounds = { width: renderer.width, height: renderer.height };
const canvas = document.getElementById("canvas");
const renderer = new CanvasRenderer(canvas);

window.addEventListener("resize", () => {
    bounds.width = renderer.width;
    bounds.height = renderer.height;
});

for (let i = 0; i < params.get("particleCount"); i++) {
    const x = Math.random() * bounds.width;
    const y = Math.random() * bounds.height;
    world.addEntity(Particle(x, y));
}

const field = new FlowField(params);
const engine = new Engine();

engine.addSystem(new FlowFieldSystem(field, params));
engine.addSystem(new MovementSystem());
engine.addSystem(new BoundarySystem(bounds));
engine.addSystem(new RenderSystem(renderer, params));

function loop() {
    engine.update(world);
    requestAnimationFrame(loop);
}
loop();