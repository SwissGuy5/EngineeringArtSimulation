import { toggleFullscreen } from "./fullscreen.js";

export function setupFullscreenShortcut() {
    window.addEventListener("keydown", (event) => {
        if (event.key === "f") {
            toggleFullscreen();
        }
    });
}