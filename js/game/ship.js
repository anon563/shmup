class Ship extends Actor {

    vel = new Vector2(0, 0);
    speed = new Vector2(1, 0.5)
    velLoss = new Vector2(0.75, 0.75);

    isPlatform = true;

    constructor(pos) {
        super();

        this.dir = true;
        this.size = new Vector2(51, 9);
        this.pos = pos;
    }
    
    update = (game, activity, keys) => {
        // Velocity
        this.vel = this.vel.mult(this.velLoss);
        this.vel = this.vel.plus(new Vector2(
            this.speed.x * (keys.left === keys.right ? 0 : keys.left ? -1 : 1),
            this.speed.y * (keys.up === keys.down ? 0 : keys.up ? -1 : 1)));
        this.vel = new Vector2(Math.abs(this.vel.x) < 0.01 ? 0 : this.vel.x, Math.abs(this.vel.y) < 0.01 ? 0 : this.vel.y);

        // Position
        const limit = {
            top: 0,
            bottom: activity.waterLevel,
            left: -game.width / 2,
            right: game.width / 2
        }
        const newPos = this.pos.plus(this.vel);
        const overflow = new Vector2(
            -(newPos.x + this.size.x > limit.right ? newPos.x + this.size.x - limit.right : newPos.x < limit.left ? newPos.x - limit.left : 0),
            -(newPos.y + this.size.y > limit.bottom ? newPos.y + this.size.y - limit.bottom : newPos.y < limit.top ? newPos.y - limit.top : 0)
        );
        const char = activity.player.character;
        if (char.platform === this) char.pos = char.pos.plus(this.vel).plus(overflow);
        this.lastPos = this.pos.value();
        this.pos = newPos.plus(overflow);

        // Gun
        if (keys.attack && this.frameCount % 5 !== 0) {
            
            const pos = this.pos.plus(new Vector2(this.size.x - 16, 4));
            const bullet = new ShipBullet(pos);
            activity.actors.push(bullet);
        }
        
        game.cx.drawImage(game.assets.images.ship, 0, 0, 51, 13, Math.round(this.pos.x), Math.round(this.pos.y), 51, 13);
        if (keys.attack) game.cx.drawImage(game.assets.images.fire, 24 * (this.frameCount % 4 < 2 ? 0 : 1), 0, 24, 24, Math.round(this.pos.x - 8) + this.size.x, Math.round(this.pos.y) - 4, 24, 24);

        this.frameCount++;
    }
}