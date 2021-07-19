class Ship extends Actor {

    vel = new Vector2(0, 0);
    speed = new Vector2(1, 0.5)
    velLoss = new Vector2(0.75, 0.75);

    attackFrame = 0;
    skewedFactor = [8, 0, 2, 6, 10, 12, 14, 15];

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
            activity.particles.scrap(this);
            activity.particles.ray(this);
            activity.particles.explosion(this);
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

        activity.actors.forEach(actor => {
            if (actor.platform === this) actor.pos = actor.pos.plus(this.vel).plus(overflow); 
        });
        this.lastPos = this.pos.value();
        this.pos = newPos.plus(overflow);

        // Bullet
        if (keys.attack) {
            const pos = this.pos.plus(new Vector2(this.size.x, 0));
            const angle = (this.attackFrame % 360) * (Math.PI / 180);
            activity.actors.push(new Bullet(pos.plus(new Vector2(Math.round(Math.random() * 16), 4)), this, 8, 16, 0));
            if (this.attackFrame % 2 === 0) activity.actors.push(new Bullet(pos.plus(new Vector2(Math.round(Math.random() * 16), 4)), this, 8, 8, Math.sin(angle * 8) / 8));
            if (this.attackFrame % 2 === 1) activity.actors.push(new Bullet(pos.plus(new Vector2(Math.round(Math.random() * 16), 4)), this, 8, 8, -Math.sin(angle * 8) / 8));
            // activity.actors.push(new Bullet(pos.plus(new Vector2(Math.round(Math.random() * 16), 4)), 8, 12, Math.sin(angle) / 4));
            // activity.actors.push(new Bullet(pos.plus(new Vector2(Math.round(Math.random() * 16), 4)), 8, 12, -Math.sin(angle) / 4));
            this.attackFrame++;
        } else this.attackFrame = 0;
        
        if (activity.player.mode === 'ship') game.cx.drawImage(game.assets.images.ship, 0, 0, 54, 18, Math.round(this.pos.x) - 1, Math.round(this.pos.y) - 4, 54, 18);
        else game.cx.drawImage(game.assets.images.ship_open, 0, 0, 54, 24, Math.round(this.pos.x) - 1, Math.round(this.pos.y) - 10, 54, 24);

        if (keys.attack) game.cx.drawImage(game.assets.images.fire,
            24 * (this.frameCount % 4 < 2 ? 0 : 1), 0, 24, 24,
            Math.round(this.pos.x - 6) + this.size.x, Math.round(this.pos.y) - 4, 24, 24);

        activity.particles.smoke(this);

        if (!this.isDone) {
            // ship water splash
            const dist = Math.max(0, Math.round(this.pos.y + this.size.y + 16 - activity.waterLevel));
            if (dist) {
                for (let i = 1; i < 6; i++) {
                    const effectHeight = Math.max(0, dist - this.skewedFactor[(this.frameCount + i) % 8]);
                    game.cx.drawImage(game.assets.images.water, 0, 0, 16, effectHeight,
                        Math.round(this.pos.x - 16 + dist * 3 - ((this.frameCount + i) % 8) * dist / (Math.ceil(Math.random() * 2) * i / 2)),
                        activity.waterLevel - effectHeight,
                        16, effectHeight);
                }
            }

            // ship blast
            game.cx.fillStyle = '#fff';
            const size = Math.round(Math.exp((this.frameCount / 2) % 3) / 2);
            game.cx.fillRect(-game.width / 2, Math.round(this.pos.y + 3) - size, game.width / 2 + Math.round(this.pos.x), 1 + size * 2);

            const pos = this.pos.plus(new Vector2(this.size.x / 2 + 6, -2));

            if (activity.player.mode === 'character') {
                game.cx.save();
                game.cx.translate(pos.x, pos.y);
                game.cx.scale(Math.sin(((this.frameCount * 4) % 180) * (Math.PI / 180)), 1);
                game.cx.drawImage(game.assets.images.in, 0, 0, 18, 18, -9, -18, 18, 18);
                game.cx.restore();
            }

            // change mode
            if (keys.jump && !lastKeys.jump && activity.player.mode === 'ship') {
                activity.player.mode = 'character';
                const DATA = MARINE;
                activity.player.character = new Character(DATA, pos.plus(new Vector2(DATA.size.x, DATA.size.y).times(-.5)));
                activity.player.character.vel.y = -3;
                activity.actors.push(activity.player.character);
                activity.flash();
            }
        }

        this.frameCount++;
    }
}