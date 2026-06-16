export function randomRgbColor() {
    const min = 96;
    const max = 256;
    const channel = () => Math.floor(min + Math.random() * (max - min));
    return `rgb(${channel()}, ${channel()}, ${channel()})`;
}

// export function hexToRgb01(hex) {
//     const h = hex.replace("#", "");

//     const r = parseInt(h.substring(0, 2), 16) / 255;
//     const g = parseInt(h.substring(2, 4), 16) / 255;
//     const b = parseInt(h.substring(4, 6), 16) / 255;

//     return [r, g, b, 1];
// }

export function parseRgba(str) {
  const match = str.match(/rgba?\(([^)]+)\)/);
  if (!match) throw new Error("Invalid color: " + str);

  const parts = match[1].split(",").map(v => v.trim());

  return {
    r: Number(parts[0]),
    g: Number(parts[1]),
    b: Number(parts[2]),
    a: parts[3] !== undefined ? Number(parts[3]) : 1,
  };
}

export function toRgba({ r, g, b, a }) {
  return `rgba(${r | 0}, ${g | 0}, ${b | 0}, ${a})`;
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

export function interpolateColor(base, target, t) {
//   const alpha = lerp(base.a, target.a, t);
    const alpha = 0.5;
    const noise = (Math.random() - 0.5) * 1; // ±0.5
    const a = Math.max(0, Math.min(1, alpha + noise));

    return toRgba({
        r: lerp(base.r, target.r, t),
        g: lerp(base.g, target.g, t),
        b: lerp(base.b, target.b, t),
        a,
    });
}