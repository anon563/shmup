class Enemy extends Actor {

    vel = new Vector2(0, 0);

    constructor(pos, size, isPlatform, maxHealth) {
        super(pos, size);

        this.maxHealth = maxHealth;
        this.health = maxHealth;

        this.isPlatform = isPlatform;
        this.dir = false;
        this.lastPos = pos;
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
        this.vel = new Vector2(
            Math.cos((this.frameCount % 360) * (Math.PI / 180)) / 2,
            Math.sin((this.frameCount % 360) * (Math.PI / 180)) / 2
        );
        this.vel = new Vector2(Math.abs(this.vel.x) < 0.01 ? 0 : this.vel.x, Math.abs(this.vel.y) < 0.01 ? 0 : this.vel.y);
        this.lastPos = this.pos.value();
        this.pos = this.pos.plus(this.vel);
        
        activity.actors.forEach(actor => {
            if (actor.platform === this) actor.pos = actor.pos.plus(this.vel);
        })
        
        const cx = game.cx;

        cx.save();
        cx.translate(Math.round(this.pos.x), Math.round(this.pos.y));

        if (this.isPlatform) {
            cx.drawImage(game.assets.images.ship_2, 0, 0, 25, 16);
        } else {
            cx.translate(12.5, 12.5);
            const angle = (this.frameCount % 360) * (Math.PI / 180) * 2;
            cx.rotate(angle);
            cx.drawImage(game.assets.images.ship_3, -12.5, -12.5, 25, 25);

            //shoot
            if (this.frameCount % 8 === 0 && !activity.player.ship.isDone) {
                const pos = new Vector2(this.pos.x, this.pos.y);

                const p1 = pos.plus(this.size.times(.5));
                const p2 = activity.player.ship.pos.plus(activity.player.ship.size.times(.5));

                activity.actors.push(new Bullet(pos.plus(this.size.times(.5).plus(new Vector2(-4, -4))), this, 8, 4, Math.atan2(p2.y - p1.y, p2.x - p1.x)))
            }
        }

        cx.restore();

        this.gotHit = false;
        this.frameCount++;
    }
}