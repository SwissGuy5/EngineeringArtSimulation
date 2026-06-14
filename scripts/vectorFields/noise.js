export function noise(x, y, seed) {
    const xi = Math.floor(x);
    const yi = Math.floor(y);
    const xf = x - xi;
    const yf = y - yi;

    // Random values at the corners
    function rand(i, j) {
        return (Math.sin(i * 12.9898 + j * 78.233 + seed) * 43758.5453) % 1;
    }

    const topLeft = rand(xi, yi);
    const topRight = rand(xi + 1, yi);
    const bottomLeft = rand(xi, yi + 1);
    const bottomRight = rand(xi + 1, yi + 1);

    // Smooth interpolation function
    function lerp(a, b, t) {
        return a + (b - a) * (3 - 2 * t) * t * t; // smoothstep
    }

    const top = lerp(topLeft, topRight, xf);
    const bottom = lerp(bottomLeft, bottomRight, xf);
    return lerp(top, bottom, yf);
}