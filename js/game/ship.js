class Ship extends Actor {

    vel = new Vector2(0, 0);
    speed = new Vector2(1, 0.5)
    velLoss = new Vector2(0.75, 0.75);

    attackFrame = 0;

    maxHealth = 50;
    health = this.maxHealth;

    constructor(pos, size, width, waterLevel, isPlatform) {
        super(pos, size);
        this.dir = true;
        this.lastPos = pos;
        this.isPlatform = isPlatform;

        // Borders
        this.borders = {
            top: 0,
            bottom: waterLevel,
            left: -width / 2,
            right: width / 2
        }
    }
    
    hit = (game, activity, actor) => {
        this.gotHit = true;
        this.health--;
        if (!this.health) {
            this.isDone = true;
            activity.actors.forEach(actor => {
                if (actor.platform === this) actor.platform = null;
            });
            for (let i = 0; i < 16; i++) {
                activity.particles.push({
                    pos: this.pos.plus(this.size.times(.5)),
                    vel: new Vector2(
                        -1 - Math.random(),
                        Math.random() * 2 - 1
                    ),
                    life: 1,
                    step: 0.01 + Math.random() * 0.025,
                    asset: `scrap_${Math.ceil(Math.random() * 5)}`,
                    rotate: activity => (activity.frameCount % 360) * (Math.PI / 180) * Math.round(Math.random() * 2) * (Math.random() > .5 ? 1 : -1),
                    scale: activity => [
                        Math.sin(((Math.round(Math.random() * 360) + this.frameCount) % 360) * (Math.PI / 180) * (Math.random() > .5 ? 1 : -1) / 2),
                        Math.cos(((Math.round(Math.random() * 360) + this.frameCount) % 360) * (Math.PI / 180) * (Math.random() > .5 ? 1 : -1) / 2)]
                });
            }
            for (let i = 0; i < 2; i++) {
                activity.particles.push({
                    pos: actor.pos.plus(this.size.times(.5)),
                    size: new Vector2(128, 128),
                    vel: new Vector2(0, 0),
                    life: 1,
                    step: 0.25,
                    asset: `ray_${Math.ceil(Math.random() * 4)}`
                });
            }
        }
    }
    
    update = (game, activity) => {
        const keys = activity.player.mode === 'ship' ? activity.keys : {};
        const lastKeys = activity.player.mode === 'ship' ? activity.lastKeys : {};
        // Velocity
        this.vel = this.vel.mult(this.velLoss);
        this.vel = this.vel.plus(new Vector2(
            this.speed.x * (keys.left === keys.right ? 0 : keys.left ? -1 : 1),
            this.speed.y * (keys.up === keys.down ? 0 : keys.up ? -1 : 1)));
        this.vel = new Vector2(Math.abs(this.vel.x) < 0.01 ? 0 : this.vel.x, Math.abs(this.vel.y) < 0.01 ? 0 : this.vel.y);

        this.gotHit = false;

        // Position
        const newPos = this.pos.plus(this.vel);
        const overflow = new Vector2(
            -(newPos.x + this.size.x > this.borders.right ? newPos.x + this.size.x - this.borders.right : newPos.x < this.borders.left ? newPos.x - this.borders.left : 0),
            -(newPos.y + this.size.y > this.borders.bottom ? newPos.y + this.size.y - this.borders.bottom : newPos.y < this.borders.top ? newPos.y - this.borders.top : 0)
        );
        const char = activity.player.character;
        activity.actors.forEach(actor => {
            if (actor.platform === this) actor.pos = actor.pos.plus(this.vel).plus(overflow); 
        });
        this.lastPos = this.pos.value();
        this.pos = newPos.plus(overflow);

        // Bullet
        if (keys.attack) {
            const pos = this.pos.plus(new Vector2(this.size.x, 0));
            const angle = (this.frameCount % 360) * (Math.PI / 180);
            activity.actors.push(new Bullet(pos.plus(new Vector2(Math.round(Math.random() * 16), 4)), this, 8, 16, 0));
            if (this.attackFrame % 2 === 0) activity.actors.push(new Bullet(pos.plus(new Vector2(Math.round(Math.random() * 16), 4)), this, 8, 8, Math.cos(angle * 8) / 8));
            if (this.attackFrame % 2 === 1) activity.actors.push(new Bullet(pos.plus(new Vector2(Math.round(Math.random() * 16), 4)), this, 8, 8, -Math.cos(angle * 8) / 8));
            // activity.actors.push(new Bullet(pos.plus(new Vector2(Math.round(Math.random() * 16), 4)), 8, 12, Math.sin(angle) / 4));
            // activity.actors.push(new Bullet(pos.plus(new Vector2(Math.round(Math.random() * 16), 4)), 8, 12, -Math.sin(angle) / 4));
            this.attackFrame++;
        } else this.attackFrame = 0;
        
        game.cx.drawImage(game.assets.images.ship, 0, 0, 54, 16, Math.round(this.pos.x) - 1, Math.round(this.pos.y) - 1, 54, 16);
        if (keys.attack) game.cx.drawImage(game.assets.images.fire,
            24 * (this.frameCount % 4 < 2 ? 0 : 1), 0, 24, 24,
            Math.round(this.pos.x - 6) + this.size.x, Math.round(this.pos.y) - 4, 24, 24);

        this.frameCount++;
    }
}