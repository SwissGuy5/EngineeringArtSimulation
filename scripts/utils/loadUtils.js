import { toggleFullscreen } from "./fullscreen.js";

console.log("Press 'f' to toggle fullscreen mode");
window.addEventListener("keydown",
    (event) => {
        if (event.key === "f") {
            console.log("Toggling fullscreen mode");
            toggleFullscreen();
        }
    }
);