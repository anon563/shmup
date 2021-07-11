class Opening extends Activity {
    frameDuration = 120;

    update = game => {
        const cx = game.cx;

        if (this.frameCount > 30) {
            cx.save();
            cx.globalAlpha = this.frameCount < 90 ? 1 : (this.frameDuration - this.frameCount) / 30;
            cx.drawImage(game.assets.images.opening, 0, 0, 64, 24, game.width / 2 - 32, game.height / 2 - 12, 64, 24);
            cx.restore();
        }
        
        if (this.frameCount === this.frameDuration) game.activity = new Level(game.keys);
        this.frameCount++;
    }
}