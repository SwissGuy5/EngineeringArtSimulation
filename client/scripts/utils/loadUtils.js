import { toggleFullscreen } from "./fullscreen.js";

export function setupFullscreenShortcut() {
    window.addEventListener("keydown", (event) => {
        if (event.key === "f") {
            toggleFullscreen();
        }
    });
}

export function syncViewport(renderer, world) {
    const width = window.innerWidth;
    const height = window.innerHeight;

    renderer.resize(width, height);
    world.setBounds(width, height);
}