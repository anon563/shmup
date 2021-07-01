class Ship extends Actor {

    vel = new Vector2(0, 0);
    speed = new Vector2(0.5, 0.25)
    velLoss = new Vector2(0.75, 0.75);

    frameCountNoInput = 0;

    constructor(keys, pos) {
        super();
        this.keys = keys;

        this.dir = true;
        this.size = new Vector2(40, 8);
        this.pos = pos;
    }
    
    update = (game, activity) => {
        if (!Object.entries(this.keys).find(key => key[1] === true)) this.frameCountNoInput++;
        else this.frameCountNoInput = 0;

        // Velocity
        this.vel = this.vel.mult(this.velLoss);
        this.vel = this.vel.plus(new Vector2(
            this.speed.x * (this.keys.left === this.keys.right ? 0 : this.keys.left ? -1 : 1),
            this.speed.y * (this.keys.up === this.keys.down ? 0 : this.keys.up ? -1 : 1)));
        // Velocity correction
        this.vel = new Vector2(Math.max(-16, Math.min(Math.abs(this.vel.x) < 0.01 ? 0 : this.vel.x, 16)), Math.max(-16, Math.min(Math.abs(this.vel.y) < 0.01 ? 0 : this.vel.y, 16)));

        // Position correction
        this.pos = this.pos.plus(this.vel);
        if (this.pos.y + this.size.y > activity.waterLevel) this.pos.y = activity.waterLevel - this.size.y;

        // Gun
        if (this.keys.attack && this.frameCount % 5 !== 0) {
            
            const pos = this.pos.plus(new Vector2(this.size.x - 8, 4));
            const bullet = new ShipBullet(pos);
            activity.actors.push(bullet);
        }

        this.frameCount++;
    }
    
    display = (game, activity) => {
        game.cx.drawImage(game.assets.images['marine_idle'], (Math.floor(this.frameCount / 32) % 2) * 24, 0, 24, 24, Math.round(this.pos.x) + 16, Math.round(this.pos.y) - 25, 24, 24);
        game.cx.drawImage(game.assets.images.ship, 0, 0, 64, 16, Math.round(this.pos.x) - 10, Math.round(this.pos.y) - 2, 64, 16);
        if (this.keys.attack) game.cx.drawImage(game.assets.images.fire, 24 * (this.frameCount % 4 < 2 ? 0 : 1), 0, 24, 24, Math.round(this.pos.x) + this.size.x, Math.round(this.pos.y) - 4, 24, 24);
    }
}