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

    constructor(data, pos) {
        super();

        this.name = data.name;
        this.actions = data.actions;

        this.dir = true;
        this.size = new Vector2(this.actions['idle'].size.x, this.actions['idle'].size.y);
        this.pos = pos;
    }
    
    update = (game, activity, keys) => {

        // Action
        this.isWalking = this.platform && keys.left !== keys.right;
        this.action = !this.platform ? "jump" : (this.isWalking ? "walk" : "idle");

        // Velocity
        this.vel = this.vel.mult(this.velLoss);
        this.vel.x += (this.platform ? this.walkSpeed : this.aerialSpeed) * (keys.left === keys.right ? 0 : keys.left ? -1 : 1)
        this.vel.y += this.gravity;
        this.vel = new Vector2(Math.abs(this.vel.x) < 0.01 ? 0 : this.vel.x, Math.abs(this.vel.y) < 0.01 ? 0 : this.vel.y);

        // Jump
        if (this.platform && this.canJump && keys.jump) {
            this.vel.y = -2;
            this.canJump = false;
            this.platform = null;
        }
        if (!this.canJump && !keys.jump) this.canJump = true;

        // Direction
        this.dir = keys.left === keys.right ? this.dir : keys.right;

        // Position
        const newPos = this.pos.plus(this.vel);

        // Platform
        if (!this.platform) {
            this.platform = [activity.player.ship, ...activity.actors].find(a => a.isPlatform && a.pos.y <= newPos.y + this.size.y && a.lastPos.y >= this.pos.y + this.size.y && CollisionBox2.intersects(a, { pos:newPos, size:this.size }));
            if (this.platform) {
                this.pos.y = this.platform.pos.y - this.size.y;
                this.vel.y = 0;
            } else this.pos = newPos;
        } else {
            this.vel.y = 0;
            if (newPos.x + this.size.x < this.platform.pos.x || newPos.x > this.platform.pos.x + this.platform.size.x) this.platform = null;
            else this.pos = this.pos.plus(this.vel);
        }

        // Gun
        if (keys.attack && this.canShoot) {
            this.canShoot = false;
            
            let angle = 0;
            if (!keys.down && !keys.up) angle = this.dir ? 0 : Math.PI;
            if (keys.down) {
                angle = this.dir ? Math.PI * 0.25 : -Math.PI * 1.25;
            } else if (keys.up) {
                angle = this.dir ? -Math.PI * 0.25 : Math.PI * 1.25;
            }
            
            const pos = this.pos.plus(this.size.times(0.5)).plus(this.size.mult(new Vector2((this.dir ? 0.6 : -0.8) * (keys.down || keys.up ? 0.7 : 1), keys.down ? (0.1) : (keys.up ? (-0.4) : (-0.15)))));
            const bullet = new Bullet(pos, new Vector2(Math.cos(angle), Math.sin(angle)));
            activity.actors.push(bullet);
        }
        if (!keys.attack && !this.canShoot) this.canShoot = true;

        // item
        // activity.items.forEach(item => {
        //     if (CollisionBox2.intersects(this, item)) {
        //         this.item = 'gun';
        //         item.isDone = true;
        //     }
        // });
        this.displayAnimation(game.cx, game.assets, this.actions[this.action].animation, game.assets.images[`${this.name}_${this.action}`]);

        this.frameCount++;
    }
}