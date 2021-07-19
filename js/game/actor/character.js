class Character extends Actor {

    vel = new Vector2(0, 0);
    walkSpeed = 0.5;
    aerialSpeed = 0.5;
    velLoss = new Vector2(0.75, 1);
    gravity = 0.125;

    frameCountNoInput = 0;

    isPlatform = false;

    canShoot = true;
    chargedShot = 0;

    item = null;
    
    maxHealth = 50;
    health = this.maxHealth;

    constructor(data, pos) {
        super(pos);

        this.name = data.name;
        this.actions = data.actions;

        this.dir = true;
        this.size = new Vector2(data.size.x, data.size.y);
        this.lastPos = pos;
    }

    hit = (game, activity, actor) => {
        this.gotHit = true;
        this.health--;
        if (!this.health) {
            this.isDone = true;
            activity.particles.ray(this);
        }
    }
    
    update = (game, activity) => {
        const keys = activity.player.mode === 'character' && this === activity.player.character ? activity.keys : {};
        // Action
        this.isWalking = this.platform && keys.left !== keys.right;
        this.action = !this.platform ? "jump" : (this.isWalking ? "walk" : "idle");

        this.gotHit = false;
        
        // Velocity
        this.vel = this.vel.mult(this.velLoss);
        this.vel.x += (this.platform ? this.walkSpeed : this.aerialSpeed) * (keys.left === keys.right ? 0 : keys.left ? -1 : 1)
        this.vel.y += this.gravity;
        this.vel = new Vector2(Math.abs(this.vel.x) < 0.01 ? 0 : this.vel.x, Math.abs(this.vel.y) < 0.01 ? 0 : this.vel.y);

        // Jump
        if (this.platform && keys.jump) {
            this.vel.y = -2.5;
            this.platform = null;
        }

        // Direction
        this.dir = keys.left === keys.right ? this.dir : keys.right;

        // Position
        this.lastPos = this.pos.value();
        const newPos = this.pos.plus(this.vel);

        // Platform
        if (!this.platform) {
            this.platform = activity.actors.find(a => a.isPlatform && !a.isDone && a.pos.y <= newPos.y + this.size.y && a.lastPos.y >= this.pos.y + this.size.y && CollisionBox2.intersects(a, { pos:newPos, size:this.size }));
            if (this.platform) {
                this.pos.y = this.platform.pos.y - this.size.y;
                this.vel.y = 0;
            } else this.pos = newPos;
        } else {
            this.vel.y = 0;
            if (newPos.x + this.size.x < this.platform.pos.x || newPos.x > this.platform.pos.x + this.platform.size.x) this.platform = null;
            else this.pos = this.pos.plus(this.vel);
        }

        if (this.pos.y > game.height) this.pos.y = 0;
        if (this.pos.x < -game.width / 2) this.pos.x = -game.width / 2;
        if (this.pos.x + this.size.x > game.width / 2) this.pos.x = game.width / 2 - this.size.x;

        // Gun
        // if (keys.attack && this.canShoot) {
        if (keys.attack && this.frameCount % 2) {
            this.canShoot = false;
            
            let angle = this.dir ? 0 : Math.PI;
            
            const pos = this.pos.plus(new Vector2(this.dir ? this.size.x : -8, this.size.y / 2));
            activity.actors.push(new Bullet(pos, this, 4, 8, angle));
        }
        if (!keys.attack && !this.canShoot) this.canShoot = true;

        if (this.frameCount % 2 || this.frameCount > 60) this.displayAnimation(game.cx, game.assets, this.actions[this.action].animation, game.assets.images[`${this.name}_${this.action}`]);

        if (this === activity.player.character && activity.player.ship && this.frameCount > 60) {
            if (CollisionBox2.intersects(this, {pos:activity.player.ship.pos.plus(new Vector2(26, -1)), size:new Vector2(12, 1)})) {
                this.isDone = true;
                activity.player.mode = 'ship';
                activity.flash();
            }
        }

        this.frameCount++;
    }
}