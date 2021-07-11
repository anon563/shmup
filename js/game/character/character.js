class Character extends Actor {

    vel = new Vector2(0, 0);
    walkSpeed = 0.5;
    aerialSpeed = 0.5;
    velLoss = new Vector2(0.75, 1);
    gravity = 0.125;

    frameCountNoInput = 0;

    isPlatform = false;

    canShoot = true;
    canJump = true;
    chargedShot = 0;

    item = null;
    
    maxHealth = 50;
    health = this.maxHealth;

    constructor(data, pos) {
        super(pos);

        this.name = data.name;
        this.actions = data.actions;

        this.dir = true;
        this.size = new Vector2(this.actions['idle'].size.x, this.actions['idle'].size.y);
        this.lastPos = pos;
    }

    hit = (game, activity, actor) => {
        this.gotHit = true;
        this.health--;
        if (!this.health) {
            this.isDone = true;
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
        if (this.platform && this.canJump && keys.jump) {
            this.vel.y = -2.5;
            this.canJump = false;
            this.platform = null;
        }
        if (!this.canJump && !keys.jump) this.canJump = true;

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
            
            let angle = 0;
            if (!keys.down && !keys.up) angle = this.dir ? 0 : Math.PI;
            if (keys.down) {
                angle = this.dir ? Math.PI * 0.25 : -Math.PI * 1.25;
            } else if (keys.up) {
                angle = this.dir ? -Math.PI * 0.25 : Math.PI * 1.25;
            }
            
            const pos = this.pos.plus(this.size.times(0.5)).plus(this.size.mult(new Vector2((this.dir ? 0.6 : -0.8) * (keys.down || keys.up ? 0.7 : 1), keys.down ? (0.1) : (keys.up ? (-0.4) : (-0.15)))));
            activity.actors.push(new Bullet(pos, this, 8, 8, angle));
        }
        if (!keys.attack && !this.canShoot) this.canShoot = true;

        this.displayAnimation(game.cx, game.assets, this.actions[this.action].animation, game.assets.images[`${this.name}_${this.action}`]);

        this.frameCount++;
    }
}