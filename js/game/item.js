class Item extends Actor {

    vel = new Vector2(0, 0);
    velLoss = new Vector2(0.75, 1);
    gravity = 0.125;

    constructor(pos, size) {
        super(pos, size);
    }
    
    update = () => {
        // Velocity
        this.vel = this.vel.mult(this.velLoss);
        this.vel = this.vel.plus(new Vector2(0, this.gravity));
        // Velocity correction
        this.vel = new Vector2(Math.max(-16, Math.min(Math.abs(this.vel.x) < 0.01 ? 0 : this.vel.x, 16)), Math.max(-16, Math.min(Math.abs(this.vel.y) < 0.01 ? 0 : this.vel.y, 16)));

        // Position correction
        this.pos = this.pos.plus(this.vel);
        if (this.pos.y + this.size.y > 128) this.pos.y = 128 - this.size.y;
        
        this.frameCount++;
    }
    
    display = (cx, assets) => {
        cx.drawImage(assets.images['item'], 0, 0, this.size.x, this.size.y, this.pos.x, this.pos.y, this.size.x, this.size.y);
    }
}