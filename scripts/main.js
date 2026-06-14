import { setupEngine, setupRendering} from "/scripts/utils/setup.js";
import { World } from "/scripts/core/World.js";
import { EntityManager } from "/scripts/core/EntityManager.js";
import { ParameterStore } from "/scripts/core/ParameterStore.js";
import { Particle } from "/scripts/entities/particle.js";
import { syncViewport } from "/scripts/utils/loadUtils.js";
import { setupFullscreenShortcut } from "/scripts/utils/loadUtils.js";

// --- Setup ---
const params = new ParameterStore();
const renderer = setupRendering();
const engine = setupEngine(renderer, params);
const world = new World();
const entityManager = new EntityManager(world);

window.addEventListener("keydown", (event) => {
    if (event.repeat) {
        return;
    }

    if (event.key.toLowerCase() === "v") {
        params.set("showFps", !params.get("showFps"));
    }
});

// --- Window Resizing ---
setupFullscreenShortcut();
// window.addEventListener("resize", () => syncViewport(renderer, world));
syncViewport(renderer, world);

// --- Spawn particles ---
for (let i = 0; i < params.get("particleCount"); i++) {
    entityManager.spawnRandomParticle(params.get("particleSize"));
}

// --- Main Loop ---
let previousFrameTime = performance.now();
const frameDurations = [];

function loop() {
    if (params.get("paused")) return requestAnimationFrame(loop);

    const now = performance.now();
    const deltaTime = now - previousFrameTime;
    previousFrameTime = now;

    frameDurations.push(deltaTime);
    if (frameDurations.length > 10) {
        frameDurations.shift();
    }

    engine.update(world);
    if (params.get("showFps")) {
        const averageDeltaTime = frameDurations.reduce((sum, value) => sum + value, 0) / frameDurations.length;
        const fps = averageDeltaTime > 0 ? Math.round(1000 / averageDeltaTime) : 0;
        renderer.drawFps(fps);
    }
    requestAnimationFrame(loop);
}
loop();