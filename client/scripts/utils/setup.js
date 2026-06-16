import { WebGLRenderer } from "/scripts/render/WebGLRenderer.js";
export function setupRendering() {
    const canvas = document.getElementById("canvas");
    const renderer = new WebGLRenderer(canvas);
    return renderer;
}

function setupField(renderer, params) {
    const vectorField = new VectorField(params);
    // vectorField.initField(0);
    return vectorField;
}

import { Engine } from "/scripts/core/Engine.js";
import { BoundarySystem } from "/scripts/systems/BoundarySystem.js";
import { MovementSystem } from "/scripts/systems/MovementSystem.js";
import { FlockSystem } from "/scripts/systems/FlockSystem.js";
import { RenderSystem } from "/scripts/systems/RenderSystem.js";
import { VectorFieldSystem } from "/scripts/systems/VectorFieldSystem.js";
import { ColorSystem } from "/scripts/systems/ColorSystem.js";
import { VectorField } from "/scripts/vectorFields/VectorField.js";
export function setupEngine (renderer, params) {
    const engine = new Engine()

    // engine.addSystem(new FlowFieldSystem(flowFields, params));
    // engine.addSystem(new FlockSystem(params));
    engine.addSystem(new VectorFieldSystem(setupField(), params));
    engine.addSystem(new MovementSystem(params));
    engine.addSystem(new BoundarySystem(params));
    engine.addSystem(new ColorSystem(params));
    engine.addSystem(new RenderSystem(renderer, params));

    return engine
}