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
        this.ctx.fillRect(
            x,
            y,
            size,
            size
        );
    }
}