class ShipBullet extends Actor {

    speed = 18;
    size = new Vector2(8, 8);
    
    isPlatform = false;

    constructor(pos) {
        super();

        this.pos = pos;
        this.vel = new Vector2(this.speed, 0);
    }
    
    update = (game, activity) => {
        if (Math.abs(activity.player.ship.pos.x - this.pos.x) > game.width) this.isDone = true;
        if (this.isDone) {
            return;
        }
        // this.isDone = this.pos.y + this.size.y > 128;
        this.action = this.isDone ? 'done' : 'idle';
        if (this.isDone) this.vel = new Vector2(0, 0);

        const newPos = this.pos.plus(this.vel);
        this.pos = newPos;

        this.frameCount++;
    }
    
    display = (game, activity) => {
        // cx.globalCompositeOperation = 'exclusion';
        game.cx.drawImage(game.assets.images['bullet_2'], 16 * (this.frameCount > 3 ? 2 : (this.frameCount === 3 ? 1 : 0)), 0, 16, 16,
            Math.round(this.pos.x) - this.size.x / 2, Math.round(this.pos.y) - this.size.y / 2, 16, 16);
    }
}