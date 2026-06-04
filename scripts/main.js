import { Engine } from "./core/Engine.js";
import { World } from "./core/World.js";
import { FlowField } from "./fields/FlowField.js";
import { WaveFlowField } from "./fields/waveFlowField.js";
import { SwirlFlowField } from "./fields/swirlFlowField.js";
import { RadialFlowField } from "./fields/radialFlowField.js";
import { LatticeFlowField } from "./fields/latticeFlowField.js";
import { FlowFieldManager } from "./fields/FlowFieldManager.js";
import { FlowFieldSystem } from "./systems/FlowFieldSystem.js";
import { BoundarySystem } from "./systems/BoundarySystem.js";
import { MovementSystem } from "./systems/MovementSystem.js";
import { FlockSystem } from "./systems/FlockSystem.js";
import { RenderSystem } from "./systems/RenderSystem.js";
import { CanvasRenderer } from "./render/CanvasRenderer.js";
import { ParameterStore } from "./core/ParameterStore.js";
import { Particle } from "./entities/particle.js";
import { setupFullscreenShortcut } from "./utils/loadUtils.js";

const canvas = document.getElementById("canvas");
const renderer = new CanvasRenderer(canvas);
const params = new ParameterStore();
const world = new World();
const flowFields = new FlowFieldManager(
    {
        wave: new WaveFlowField(params),
        swirl: new SwirlFlowField(world, params),
        radial: new RadialFlowField(world, params),
        lattice: new LatticeFlowField(params),
        legacy: new FlowField(params)
    },
    "swirl"
);
const engine = new Engine();

function syncViewport() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    renderer.resize(width, height);
    world.setBounds(width, height);
}

function updateFieldTitle() {
    document.title = `Swarm Simulation - ${flowFields.getActiveFieldName()}`;
}

setupFullscreenShortcut();
window.addEventListener("resize", syncViewport);
document.addEventListener("fullscreenchange", syncViewport);
window.addEventListener("keydown", (event) => {
    if (event.key === "1") {
        flowFields.setActiveField("wave");
        updateFieldTitle();
    }

    if (event.key === "2") {
        flowFields.setActiveField("swirl");
        updateFieldTitle();
    }

    if (event.key === "3") {
        flowFields.setActiveField("radial");
        updateFieldTitle();
    }

    if (event.key === "4") {
        flowFields.setActiveField("lattice");
        updateFieldTitle();
    }

    if (event.key === "5") {
        flowFields.setActiveField("legacy");
        updateFieldTitle();
    }
});

syncViewport();
updateFieldTitle();

for (let i = 0; i < params.get("particleCount"); i++) {
    const { width, height } = world.getBounds();
    const x = Math.random() * width;
    const y = Math.random() * height;
    world.addEntity(Particle(x, y, params.get("particleSize")));
}

engine.addSystem(new FlowFieldSystem(flowFields, params));
// engine.addSystem(new FlockSystem(params));
engine.addSystem(new MovementSystem());
engine.addSystem(new BoundarySystem());
engine.addSystem(new RenderSystem(renderer, params));

function loop() {
    engine.update(world);
    requestAnimationFrame(loop);
}
loop();