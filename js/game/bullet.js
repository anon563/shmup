class Bullet extends Actor {

    speed = 4;
    size = new Vector2(4, 4);

    constructor(pos, n) {
        super();

        this.pos = pos;
        this.vel = n.times(this.speed);
    }
    
    update = (game, activity) => {
        if (Math.abs(activity.p1.pos.x - this.pos.x) > game.width) this.isDone = true;
        if (this.isDone) {
            return;
        }
        this.isDone = CollisionBox2.intersects(this, activity.p2) || this.pos.y + this.size.y > 128;
        this.action = this.isDone ? 'done' : 'idle';
        if (this.isDone) this.vel = new Vector2(0, 0);

        const newPos = this.pos.plus(this.vel);
        this.pos = newPos;

        this.frameCount++;
    }
    
    display = (cx, assets) => {
        cx.drawImage(assets.images['bullet'], this.isDone ? 8 : 0, 0, 8, 8, this.pos.x - this.size.x / 2, this.pos.y - this.size.y / 2, 8, 8);
        if (this.frameCount === 1) {
            cx.drawImage(assets.images['bullet'], 16, 0, 8, 8, this.pos.x - this.size.x / 2, this.pos.y - this.size.y / 2, 8, 8);
        }
    }
}