class Character extends Actor {

    vel = new Vector2(0, 0);
    walkSpeed = 0.25;
    aerialSpeed = 0.25;
    velLoss = new Vector2(0.75, 1);
    gravity = 0.125;

    frameCountNoInput = 0;

    canShoot = true;
    canJump = true;
    chargedShot = 0;

    item = null;

    constructor(keys, data, pos, order) {
        super();
        this.keys = keys;

        this.name = data.name;
        this.actions = data.actions;

        this.dir = order;
        this.size = new Vector2(this.actions['idle'].size.x, this.actions['idle'].size.y);
        this.pos = pos;
    }
    
    update = (game, activity) => {
        if (!Object.entries(this.keys).find(key => key[1] === true)) this.frameCountNoInput++;
        else this.frameCountNoInput = 0;

        this.isGrounded = this.pos.y + this.size.y === 128;
        this.isWalking = this.isGrounded && this.keys.left !== this.keys.right;

        this.action = !this.isGrounded ? "jump" : (this.isWalking ? "walk" : "idle");

        // Velocity
        this.vel = this.vel.mult(this.velLoss);
        this.vel = this.vel.plus(new Vector2((this.isGrounded ? this.walkSpeed : this.aerialSpeed) * (this.keys.left === this.keys.right ? 0 : this.keys.left ? -1 : 1), this.gravity));
        // Velocity correction
        this.vel = new Vector2(Math.max(-16, Math.min(Math.abs(this.vel.x) < 0.01 ? 0 : this.vel.x, 16)), Math.max(-16, Math.min(Math.abs(this.vel.y) < 0.01 ? 0 : this.vel.y, 16)));

        // Jump & Gravity correction
        if (this.isGrounded && this.canJump) {
            this.vel = new Vector2(this.vel.x, this.keys.jump ? -2 : this.vel.y);
            this.canJump = false;
        }
        if (!this.canJump && !this.keys.jump) this.canJump = true;

        // Direction
        this.dir = this.keys.left === this.keys.right ? this.dir : this.keys.right;

        // Position correction
        this.pos = this.pos.plus(this.vel);
        if (this.pos.y + this.size.y > 128) this.pos.y = 128 - this.size.y;
        // const obstacles = CollisionBox2.intersectingCollisionBoxes({ pos:newPos, size:this.size }, activity.tiles);
        // obstacles.forEach(obstacle => {
        //     const xCollision = CollisionBox2.intersects({ pos:this.pos.plus(new Vector2(this.vel.x, 0)), size:this.size }, obstacle);
        //     const yCollision = CollisionBox2.intersects({ pos:this.pos.plus(new Vector2(0, this.vel.y)), size:this.size }, obstacle);
        //     if (xCollision) {
        //         newPos.x += (this.vel.x > 0 ? -(newPos.x + this.size.x - obstacle.pos.x) : obstacle.pos.x + obstacle.size.x - newPos.x) % obstacle.size.x;
        //         this.vel.x = 0;
        //     }
        //     if (yCollision) {
        //         newPos.y += (this.vel.y > 0 ? -(newPos.y + this.size.y - obstacle.pos.y) : obstacle.pos.y + obstacle.size.y - newPos.y) % obstacle.size.y;
        //         if (this.pos.y < obstacle.pos.y && this.vel.y > this.gravity) this.land = true;
        //         this.vel.y = 0;
        //     }
        // });

        if (this.land) this.land = false;

        // Gun
        if (this.keys.attack && this.canShoot) {
            this.canShoot = false;
            
            let angle = 0;
            if (!this.keys.down && !this.keys.up) angle = this.dir ? 0 : Math.PI;
            if (this.keys.down) {
                angle = this.dir ? Math.PI * 0.25 : -Math.PI * 1.25;
            } else if (this.keys.up) {
                angle = this.dir ? -Math.PI * 0.25 : Math.PI * 1.25;
            }
            
            const pos = this.pos.plus(this.size.times(0.5)).plus(this.size.mult(new Vector2((this.dir ? 0.6 : -0.8) * (this.keys.down || this.keys.up ? 0.7 : 1), this.keys.down ? (0.1) : (this.keys.up ? (-0.4) : (-0.15)))));
            const bullet = new Bullet(pos, new Vector2(Math.cos(angle), Math.sin(angle)));
            activity.actors.push(bullet);
        }
        if (!this.keys.attack && !this.canShoot) this.canShoot = true;

        // item
        activity.items.forEach(item => {
            if (CollisionBox2.intersects(this, item)) {
                this.item = 'gun';
                item.isDone = true;
            }
        });

        this.frameCount++;
    }
    
    display = (cx, assets) => {
        this.displayAnimation(cx, assets, this.actions[this.action].animation, assets.images[`${this.name}_${this.action}`]);
    }
}