export class CanvasRenderer {

    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
    }

    resize(width, height) {
        this.width = width;
        this.height = height;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
    }

    clear(color) {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(
            0,
            0,
            this.width,
            this.height
        );
    }

    drawPoint(x, y, size, color) {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x, y, size, size);
    }

    drawFps(fps) {
        const ctx = this.ctx;

        ctx.save();
        ctx.fillStyle = "#ffffff";
        ctx.font = "16px monospace";
        ctx.textAlign = "left";
        ctx.textBaseline = "top";
        ctx.fillText(`FPS: ${fps}`, 12, 12);
        ctx.restore();
    }
}