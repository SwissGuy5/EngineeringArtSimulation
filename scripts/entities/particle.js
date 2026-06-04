import { Position } from "../components/position.js";
import { Velocity } from "../components/velocity.js";
import { FlowFollower } from "../components/flowFollower.js";
import { Renderable } from "../components/renderable.js";

export function Particle(x, y, size = 2) {
    return {
        components: {
            position: Position(x, y),
            velocity: Velocity(),
            flowFollower: FlowFollower(),
            renderable: Renderable(size)
        }
    };
}