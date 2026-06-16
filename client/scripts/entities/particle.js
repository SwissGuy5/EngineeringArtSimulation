import { Position } from "../components/position.js";
import { Velocity } from "../components/velocity.js";
import { FlowFollower } from "../components/flowFollower.js";
import { Renderable } from "../components/renderable.js";
import { randomRgbColor } from "../utils/color.js";

export function Particle(x, y, vx = 0, vy = 0, size = 2) {
    return {
        components: {
            position: Position(x, y),
            velocity: Velocity(vx, vy),
            flowFollower: FlowFollower(),
            // renderable: Renderable(size, randomRgbColor())
            renderable: Renderable(size, `rgb(255, 255, 255)`)
        }
    };
}