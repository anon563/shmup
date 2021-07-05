class Game {
    width = 256;
    height = 224;
    
    dataCanvas = document.createElement('canvas');
    cx = this.dataCanvas.getContext('2d');
    
    displayCanvas = document.createElement('canvas');
    displayCx = this.displayCanvas.getContext('2d');


    fpsInterval = 1000 / 60;
    lastTimestamp = null;
    step = null;

    constructor(assets) {
        // Display
        this.assets = assets;

        this.dataCanvas.width = this.width;
        this.dataCanvas.height = this.height;
        this.resize();
        window.addEventListener('resize', this.resize);
        document.body.appendChild(this.displayCanvas);

        // Keys
        this.keys = new KeyboardListener().keys;

        this.activity = new Shoot(this.keys);
    }

    loop = timestamp => {
        if (!this.lastTimestamp) this.lastTimestamp = window.performance.now();
        this.step = timestamp - this.lastTimestamp;
        if (this.step > this.fpsInterval) {
            this.lastTimestamp = timestamp - (this.step % this.fpsInterval);

            // Update activity
            this.activity.update(this);
            this.activity.frameCount++;

            const imgData = this.cx.getImageData(0, 0, this.width, this.height);

            let tmpCanvas = document.createElement("canvas");
            tmpCanvas.width = this.width;
            tmpCanvas.height = this.height;
            let tmpCx = tmpCanvas.getContext("2d");
            tmpCx.imageSmoothingEnabled = false;
            tmpCx.putImageData(imgData, 0, 0);

            this.displayCx.drawImage(tmpCanvas, 0, 0);
        }
        requestAnimationFrame(this.loop);
    }

    // Resize canvas
    resize = () => {
        this.zoom = Math.max(1, Math.min(Math.floor(innerWidth / this.width), Math.floor(innerHeight / this.height)));
        this.displayCanvas.width = this.width * this.zoom;
        this.displayCanvas.height = this.height * this.zoom;
        this.displayCx.imageSmoothingEnabled = false;
        this.displayCx.scale(this.zoom, this.zoom);
    }
}