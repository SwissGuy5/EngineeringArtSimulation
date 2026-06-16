import { parseRgba, toRgba, interpolateColor } from "/scripts/utils/color.js";

export class ColorSystem {
  constructor(params) {
    this.params = params;
  }

  update(world) {
    const entities = world.query(["renderable"]);
    const baseColor = parseRgba(this.params.get("baseColor"));
    const targetColor = parseRgba(this.params.get("targetColor"));
    const factor = this.params.get("colorFactor");
    const color = interpolateColor(baseColor, targetColor, factor);

    for (const entity of entities) {
      const renderable = entity.components.renderable;
      renderable.color = color;
      // renderable.color = interpolateColor(baseColor, targetColor, factor);
    }
  }
}