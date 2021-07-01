class Actor {
    frameCount = 0;

    constructor(pos, size) {
        this.pos = pos;
        this.size = size;
    }

    update = game => {
        this.frameCount++;
    }

    display = (cx, assets) => {}

    displayAnimation = (cx, assets, animation, asset) => {
        const pos = this.pos.round();
        cx.save();
        cx.translate(pos.x, pos.y);
        if (!this.dir) {
            cx.translate(this.size.x / 2, 0);
            cx.scale(-1, 1);
            cx.translate(-this.size.x / 2, 0);
        }
        if (this.item) {
            cx.drawImage(assets.images['gun'], 0, 0, 8, 8, this.size.x - 1, 5, 8, 8);
        }
        cx.drawImage(asset,
            Math.floor(this.frameCount * animation.speed) % animation.frames * animation.size.x, 0, animation.size.x, animation.size.y,
            animation.offset.x, animation.offset.y, animation.size.x, animation.size.y
        );
        cx.restore();
    }

    displayCollisionBox = game => {
        const cx = game.cx;
        cx.lineWidth = 2 / game.zoom;
        const pos = this.pos.round();
        cx.save();
        cx.strokeStyle = "#00f";
        cx.strokeRect(pos.x, pos.y, this.size.x, this.size.y);
        cx.fillStyle = "#00f4";
        cx.fillRect(pos.x, pos.y, this.size.x, this.size.y);
        cx.restore();
    }
}