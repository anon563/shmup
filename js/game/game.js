class Game {
    canvas = document.createElement('canvas');
    cx = this.canvas.getContext('2d');
    width = 256;
    height = 224;

    fpsInterval = 1000 / 60;
    lastTimestamp = null;
    step = null;

    constructor(assets) {
        // Display
        this.assets = assets;
        this.resize();
        window.addEventListener('resize', this.resize);
        document.body.innerHTML = "";
        document.body.appendChild(this.canvas);

        // Keys
        this.keys = new KeyboardListener().keys;

        this.activity = new Shoot(this.keys);
    }

    loop = timestamp => {
        if (!this.lastTimestamp) this.lastTimestamp = window.performance.now();
        this.step = timestamp - this.lastTimestamp;
        if (this.step > this.fpsInterval) {
            this.lastTimestamp = timestamp - (this.step % this.fpsInterval);
            // Clear display
            this.cx.clearRect(0, 0, this.width, this.height);
            // Update activity
            this.activity.update(this);
            this.activity.frameCount++;
        }
        requestAnimationFrame(this.loop);
    }

    // Resize canvas
    resize = () => {
        this.zoom = Math.max(1, Math.min(Math.floor(innerWidth / this.width), Math.floor(innerHeight / this.height)));
        this.canvas.width = this.width * this.zoom;
        this.canvas.height = this.height * this.zoom;
        this.cx.imageSmoothingEnabled = false;
        this.cx.scale(this.zoom, this.zoom);
    }
}