class Shoot extends Activity {

    constructor(keys) {
        super();
        this.player = new Ship(keys, new Vector2(-32, 182));
    }

    actors = [];

    waterLevel = 254-64;
    skewedFactor = [8, 0, 2, 6, 10, 12, 14, 15];
    particles = [];

    update = game => {
        const cx = game.cx;
        cx.save();

        this.actors = this.actors.filter(actor => !actor.isDone);

        // Actors logic
        const actors = [this.player, ...this.actors];
        actors.forEach(actor => actor.update(game, this));

        // Viewport
        cx.translate(game.width / 2, 0);

        // Background
        cx.drawImage(game.assets.images.bg, 0, 0, game.width, game.height, -game.width / 2 + game.width - Math.round(this.frameCount / 16) % game.width, 0, game.width, game.height);
        cx.drawImage(game.assets.images.bg, 0, 0, game.width, game.height, -game.width / 2 - Math.round(this.frameCount / 16) % game.width, 0, game.width, game.height);
        
        // Actors display
        actors.forEach(actor => {
            cx.save();
            actor.display(game, this);
            // actor.displayCollisionBox(game);
            cx.restore();
        });
        
        const dist = Math.max(0, Math.round(this.player.pos.y + this.player.size.y + 16 - this.waterLevel));
        if (dist) {
            for (let i = 1; i < 6; i++) {
                const effectHeight = Math.max(0, dist - this.skewedFactor[(this.player.frameCount + i) % 8]);
                game.cx.drawImage(game.assets.images.water, 0, 0, 16, effectHeight,
                    Math.round(this.player.pos.x - 16 + dist * 3 - ((this.player.frameCount + i) % 8) * dist / (Math.ceil(Math.random() * 2) * i / 2)),
                    this.waterLevel - effectHeight,
                    16, effectHeight);
            }
        }

        cx.fillStyle = '#fff';
        for (let i = 0; i < game.height; i++) {
            if (Math.random() > .99) {
                cx.fillRect(-game.width / 2, i, Math.round(game.width * (0.5 + Math.random() / 2)), 1);
            }
        }
        const size = Math.round(Math.exp((this.frameCount / 2) % 3) / 2);
        cx.fillRect(-game.width / 2, Math.round(this.player.pos.y + 3) - size, game.width / 2 + Math.round(this.player.pos.x - 4), 1 + size * 2);

        this.particles.push({
            x: Math.round(this.player.pos.x) + Math.round(Math.random() * 8),
            y: Math.round(this.player.pos.y + 8) + Math.round(Math.random() * 10 - 5),
            life: 1,
            step: 0.05 + Math.random() * 0.025,
            xSpeed: -6
        });
        cx.fillStyle = '#f00';
        this.particles = this.particles.filter(particle => particle.life > 0);
        this.particles.forEach(particle => {
            particle.life -= particle.step;
            particle.x += particle.xSpeed;
            cx.drawImage(game.assets.images.smoke, 8 * (particle.life > .6 ? 0 : particle.life > .2 ? 1 : 2), 0, 8, 8,
                particle.x - 4, particle.y - 4, 8, 8);
        });

        // Foreground
        cx.globalAlpha = .8;
        cx.drawImage(game.assets.images.bg, 0, this.waterLevel, game.width, game.height - this.waterLevel, -game.width / 2, this.waterLevel, game.width, game.height - this.waterLevel);

        cx.restore();
    }
}