class Bullet extends Actor {
    
    isPlatform = false;

    constructor(pos, owner, diameter, speed, angle) {
        super(pos);
        this.owner = owner;
        this.size = new Vector2(diameter, diameter);
        this.diameter = diameter;
        this.speed = speed;
        this.angle = angle;
        this.vel = new Vector2(Math.cos(angle), Math.sin(angle)).times(this.speed);
    }
    
    update = (game, activity) => {
        const enemyHit = activity.actors.filter(a => this.owner instanceof Enemy !== a instanceof Enemy && a.maxHealth).find(actor => CollisionBox2.intersects(this, actor));
        if (enemyHit) enemyHit.hit(game, activity, this);

        if (Math.abs(activity.player.ship.pos.x - this.pos.x) > game.width * 1.5 || enemyHit) this.isDone = true;

        // this.isDone = this.pos.y + this.size.y > 128;
        this.action = this.isDone ? 'done' : 'idle';
        if (this.isDone) this.vel = new Vector2(0, 0);
        
        this.lastPos = this.pos.value();
        const newPos = this.pos.plus(this.vel);
        this.pos = newPos;
        
        const cx = game.cx;
        cx.save();
        cx.translate(this.pos.x + this.size.x / 2, this.pos.y + this.size.y / 2);
        if (this.isDone) {
            cx.drawImage(game.assets.images['bullet_3'], Math.random() > .5 ? 0 : 32, 0, 32, 32,
                -16 + Math.round(Math.random() * 16 - 8), -16 + Math.round(Math.random() * 16 - 8), 32, 32);
        } else {
            cx.drawImage(game.assets.images[`circle_${this.diameter}`], 0, 0, 10, 10,
            -5, -5, 10, 10);
        }
        cx.restore();

        this.frameCount++;
    }
}