export function randomRgbColor() {
    const min = 96;
    const max = 256;
    const channel = () => Math.floor(min + Math.random() * (max - min));
    return `rgb(${channel()}, ${channel()}, ${channel()})`;
}