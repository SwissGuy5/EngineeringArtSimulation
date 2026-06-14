export class WebGLRenderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.gl = canvas.getContext("webgl", {
            alpha: false,
            antialias: false,
            depth: false,
            stencil: false,
            preserveDrawingBuffer: false,
            powerPreference: "high-performance",
            premultipliedAlpha: false,
        });

        if (!this.gl) {
            throw new Error("WebGL is not supported in this browser.");
        }

        this.fpsOverlay = document.createElement("div");
        this.fpsOverlay.style.position = "fixed";
        this.fpsOverlay.style.top = "12px";
        this.fpsOverlay.style.left = "12px";
        this.fpsOverlay.style.color = "#ffffff";
        this.fpsOverlay.style.font = '16px monospace';
        this.fpsOverlay.style.pointerEvents = "none";
        this.fpsOverlay.style.userSelect = "none";
        this.fpsOverlay.style.zIndex = "10";
        this.fpsOverlay.style.display = "none";
        document.body.appendChild(this.fpsOverlay);

        this.program = this.createProgram();
        this.gl.useProgram(this.program);

        this.positionLocation = this.gl.getAttribLocation(this.program, "a_position");
        this.colorLocation = this.gl.getAttribLocation(this.program, "a_color");
        this.pointSizeLocation = this.gl.getAttribLocation(this.program, "a_pointSize");
        this.resolutionLocation = this.gl.getUniformLocation(this.program, "u_resolution");

        this.batchBuffer = this.gl.createBuffer();
        this.vertexStride = 7;
        this.vertexCapacity = 16384;
        this.vertexData = new Float32Array(this.vertexCapacity * this.vertexStride);
        this.vertexCount = 0;

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.batchBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, this.vertexData.byteLength, this.gl.DYNAMIC_DRAW);

        this.gl.enableVertexAttribArray(this.positionLocation);
        this.gl.vertexAttribPointer(this.positionLocation, 2, this.gl.FLOAT, false, this.vertexStride * 4, 0);
        this.gl.enableVertexAttribArray(this.colorLocation);
        this.gl.vertexAttribPointer(this.colorLocation, 4, this.gl.FLOAT, false, this.vertexStride * 4, 2 * 4);
        this.gl.enableVertexAttribArray(this.pointSizeLocation);
        this.gl.vertexAttribPointer(this.pointSizeLocation, 1, this.gl.FLOAT, false, this.vertexStride * 4, 6 * 4);

        this.gl.disable(this.gl.DEPTH_TEST);
        this.gl.clearColor(0, 0, 0, 1);
        this.resize(this.canvas.width || window.innerWidth, this.canvas.height || window.innerHeight);
        this.colorCache = new Map();
    }

    createShader(type, source) {
        const shader = this.gl.createShader(type);
        this.gl.shaderSource(shader, source);
        this.gl.compileShader(shader);

        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            const message = this.gl.getShaderInfoLog(shader);
            this.gl.deleteShader(shader);
            throw new Error(`WebGL shader compilation failed: ${message}`);
        }

        return shader;
    }

    createProgram() {
        const vertexShader = this.createShader(
            this.gl.VERTEX_SHADER,
            `
            attribute vec2 a_position;
            attribute vec4 a_color;
            attribute float a_pointSize;
            uniform vec2 u_resolution;

            varying vec4 v_color;

            void main() {
                vec2 position = a_position;
                vec2 zeroToOne = position / u_resolution;
                vec2 zeroToTwo = zeroToOne * 2.0;
                vec2 clipSpace = zeroToTwo - 1.0;

                gl_Position = vec4(clipSpace * vec2(1.0, -1.0), 0.0, 1.0);
                gl_PointSize = a_pointSize;
                v_color = a_color;
            }`
        );

        const fragmentShader = this.createShader(
            this.gl.FRAGMENT_SHADER,
            `precision mediump float;
            varying vec4 v_color;

            void main() {
                gl_FragColor = v_color;
            }`
        );

        const program = this.gl.createProgram();
        this.gl.attachShader(program, vertexShader);
        this.gl.attachShader(program, fragmentShader);
        this.gl.linkProgram(program);

        if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
            const message = this.gl.getProgramInfoLog(program);
            this.gl.deleteProgram(program);
            throw new Error(`WebGL program linking failed: ${message}`);
        }

        return program;
    }

    resize(width, height) {
        this.width = width;
        this.height = height;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.gl.viewport(0, 0, this.width, this.height);
        this.gl.useProgram(this.program);
        this.gl.uniform2f(this.resolutionLocation, this.width, this.height);
    }

    clear(color) {
        const [red, green, blue, alpha] = this.parseColor(color);
        this.gl.clearColor(red, green, blue, alpha);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
        this.vertexCount = 0;
    }

    drawPoint(x, y, size, color) {
        const [red, green, blue, alpha] = this.parseColor(color);

        if (this.vertexCount >= this.vertexCapacity) {
            this.growBatchBuffer();
        }

        const offset = this.vertexCount * this.vertexStride;
        this.vertexData[offset] = x;
        this.vertexData[offset + 1] = y;
        this.vertexData[offset + 2] = red;
        this.vertexData[offset + 3] = green;
        this.vertexData[offset + 4] = blue;
        this.vertexData[offset + 5] = alpha;
        this.vertexData[offset + 6] = size;

        this.vertexCount += 1;
    }

    flush() {
        if (this.vertexCount === 0) {
            return;
        }

        this.gl.useProgram(this.program);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.batchBuffer);
        this.gl.bufferSubData(
            this.gl.ARRAY_BUFFER,
            0,
            this.vertexData.subarray(0, this.vertexCount * this.vertexStride)
        );
        this.gl.drawArrays(this.gl.POINTS, 0, this.vertexCount);
        this.vertexCount = 0;
    }

    drawFps(fps) {
        this.fpsOverlay.textContent = `FPS: ${fps}`;
        this.fpsOverlay.style.display = "block";
    }

    setFpsVisible(isVisible) {
        this.fpsOverlay.style.display = isVisible ? "block" : "none";
    }

    growBatchBuffer() {
        this.vertexCapacity *= 2;
        const nextVertexData = new Float32Array(this.vertexCapacity * this.vertexStride);
        nextVertexData.set(this.vertexData);
        this.vertexData = nextVertexData;
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.batchBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, this.vertexData.byteLength, this.gl.DYNAMIC_DRAW);
    }

    parseColor(color) {
        if (typeof color !== "string" || !color.startsWith("#")) {
            if (color.startsWith("rgb(") || color.startsWith("rgba(")) {
                const channelValues = color
                    .slice(color.indexOf("(") + 1, color.lastIndexOf(")"))
                    .split(",")
                    .map((value) => value.trim());

                const red = Number(channelValues[0]) / 255;
                const green = Number(channelValues[1]) / 255;
                const blue = Number(channelValues[2]) / 255;
                const alpha = channelValues.length > 3 ? Number(channelValues[3]) : 1;
                const parsedColor = [red, green, blue, alpha];
                this.colorCache.set(color, parsedColor);
                return parsedColor;
            }

            return [1, 1, 1, 1];
        }

        const cachedColor = this.colorCache.get(color);
        if (cachedColor) {
            return cachedColor;
        }

        if (color.length === 4) {
            const red = parseInt(color[1] + color[1], 16) / 255;
            const green = parseInt(color[2] + color[2], 16) / 255;
            const blue = parseInt(color[3] + color[3], 16) / 255;
            const parsedColor = [red, green, blue, 1];
            this.colorCache.set(color, parsedColor);
            return parsedColor;
        }

        if (color.length >= 7) {
            const red = parseInt(color.slice(1, 3), 16) / 255;
            const green = parseInt(color.slice(3, 5), 16) / 255;
            const blue = parseInt(color.slice(5, 7), 16) / 255;
            const parsedColor = [red, green, blue, 1];
            this.colorCache.set(color, parsedColor);
            return parsedColor;
        }

        return [1, 1, 1, 1];
    }
}