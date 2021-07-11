class Actor {
    frameCount = 0;

    constructor(pos, size) {
        this.pos = pos;
        this.size = size;
    }

    update = game => this.frameCount++;

    display = (cx, assets) => {}

    displayAnimation = (cx, assets, animation, asset) => {
        cx.save();
        cx.translate(this.pos.x, this.pos.y);
        if (!this.dir) {
            cx.translate(this.size.x / 2, 0);
            cx.scale(-1, 1);
            cx.translate(-this.size.x / 2, 0);
        }
        cx.drawImage(asset,
            Math.floor(this.frameCount * animation.speed) % animation.frames * animation.size.x, 0, animation.size.x, animation.size.y,
            animation.offset.x, animation.offset.y, animation.size.x, animation.size.y
        );
        cx.restore();
    }

    displayCollisionBox = game => {
        const cx = game.cx;
        const pos = this.pos.round();
        cx.save();
        cx.fillStyle = "#00f";
        cx.fillRect(pos.x, pos.y, this.size.x, 1);
        cx.fillRect(pos.x, pos.y, 1, this.size.y);
        cx.fillRect(pos.x + this.size.x - 1, pos.y, 1, this.size.y);
        cx.fillRect(pos.x, pos.y + this.size.y - 1, this.size.x, 1);
        cx.fillStyle = "#00f4";
        cx.fillRect(pos.x, pos.y, this.size.x, this.size.y);
        cx.restore();
    }
}