class Enemy extends Actor {

    vel = new Vector2(0, 0);

    frameCountNoInput = 0;

    isPlatform = true;

    constructor(pos) {
        super();

        this.dir = false;
        this.size = new Vector2(25, 12);
        this.pos = pos;
    }
    
    update = (game, activity) => {

        this.vel = new Vector2(
            Math.cos((this.frameCount % 360) * (Math.PI / 180)) / 2,
            Math.sin((this.frameCount % 360) * (Math.PI / 180)) / 2
        );
        this.vel = new Vector2(Math.abs(this.vel.x) < 0.01 ? 0 : this.vel.x, Math.abs(this.vel.y) < 0.01 ? 0 : this.vel.y);
        this.lastPos = this.pos.value();
        this.pos = this.pos.plus(this.vel);
        
        const char = activity.player.character;
        if (char.platform === this) char.pos = char.pos.plus(this.vel);

        this.frameCount++;
    }
    
    display = (game, activity) => {
        game.cx.drawImage(game.assets.images.ship_2, 0, 0, 25, 16, Math.round(this.pos.x), Math.round(this.pos.y), 25, 16);
    }
}