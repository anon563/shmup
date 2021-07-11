class Game {
    width = 256;
    height = 224;
    
    // Canvas used to draw
    dataCanvas = document.createElement('canvas');
    cx = this.dataCanvas.getContext('2d');
    
    // Canvas used to display
    displayCanvas = document.createElement('canvas');
    displayCx = this.displayCanvas.getContext('2d');

    // Force 60fps
    fpsInterval = 1000 / 60;
    lastTimestamp = window.performance.now();
    step = null;

    constructor(assets) {
        // Display
        this.assets = assets;
        this.dataCanvas.width = this.width;
        this.dataCanvas.height = this.height;
        this.resize();
        window.addEventListener('resize', this.resize);
        document.body.appendChild(this.displayCanvas);
        this.cx.imageSmoothingEnabled = false;

        // Keys
        this.keys = new KeyboardListener().keys;

        // Activity
        this.activity = new Level(this.keys, this.width, this.height);
    }

    loop = timestamp => {
        this.step = timestamp - this.lastTimestamp;
        if (this.step > this.fpsInterval) {
            this.lastTimestamp = timestamp - (this.step % this.fpsInterval);

            // Update
            this.activity.update(this);

            // Display
            this.displayCx.drawImage(this.dataCanvas, 0, 0);
        }
        requestAnimationFrame(this.loop);
    }

    // Resize display canvas
    resize = () => {
        this.zoom = Math.max(1, Math.min(Math.floor(innerWidth / this.width), Math.floor(innerHeight / this.height)));
        this.displayCanvas.width = this.width * this.zoom;
        this.displayCanvas.height = this.height * this.zoom;
        this.displayCx.imageSmoothingEnabled = false;
        this.displayCx.scale(this.zoom, this.zoom);
    }
}