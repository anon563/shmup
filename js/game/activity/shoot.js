class Shoot extends Activity {

    constructor(keys) {
        super();
        this.keys = keys;
        this.player = {
            ship: new Ship(new Vector2(-32, 182)),
            character: new Character(MARINE, new Vector2(0, 64)),
            mode: 'ship'
        }
    }
    
    frameCountNoInput = 0;
    lastKeys = {}

    actors = [];

    waterLevel = 254-64;
    skewedFactor = [8, 0, 2, 6, 10, 12, 14, 15];
    particles = [];
    backgroundParallax = [
        0, 128, 8, 8, 16, 16, 48
    ]

    events = {
        0: (game, activity) => {
            activity.actors.push(new Enemy(new Vector2(32, 64)));
        }
    }


    update = game => {
        const cx = game.cx;
        cx.save();
        
        if (!Object.entries(this.keys).find(key => key[1] === true)) this.frameCountNoInput++;
        else this.frameCountNoInput = 0;

        if (this.keys.subattack && !this.lastKeys.subattack) this.player.mode = this.player.mode === 'ship' ? 'character' : 'ship';
        this.lastKeys = JSON.parse(JSON.stringify(this.keys));

        if (this.events[this.frameCount]) this.events[this.frameCount](game, this);

        this.actors = this.actors.filter(actor => !actor.isDone);

        // Viewport
        cx.translate(game.width / 2, 0);

        // Background
        let backgroundHeightBuffer = 0;
        for (let i = 0; i < this.backgroundParallax.length - 1; i++) {
            backgroundHeightBuffer += this.backgroundParallax[i];
            cx.drawImage(game.assets.images.bg,
                0, backgroundHeightBuffer, game.width, this.backgroundParallax[i + 1],
                -game.width / 2 + game.width - Math.round(this.frameCount * (i + 1)) % game.width, backgroundHeightBuffer, game.width, this.backgroundParallax[i + 1]);

            cx.drawImage(game.assets.images.bg,
                0, backgroundHeightBuffer, game.width, this.backgroundParallax[i + 1],
                -game.width / 2 - Math.round(this.frameCount * (i + 1)) % game.width, backgroundHeightBuffer, game.width, this.backgroundParallax[i + 1]);
        }
        
        // Actors logic
        const actors = [this.player.ship, ...this.actors, this.player.character];
        actors.forEach(actor => {
            const keys = actor === this.player[this.player.mode] ? this.keys : {};
            actor.update(game, this, keys);
        });

        // Actors display
        actors.forEach(actor => {
            cx.save();
            actor.display(game, this);
            // actor.displayCollisionBox(game);
            cx.restore();
        });
        
        const dist = Math.max(0, Math.round(this.player.ship.pos.y + this.player.ship.size.y + 16 - this.waterLevel));
        if (dist) {
            for (let i = 1; i < 6; i++) {
                const effectHeight = Math.max(0, dist - this.skewedFactor[(this.player.ship.frameCount + i) % 8]);
                game.cx.drawImage(game.assets.images.water, 0, 0, 16, effectHeight,
                    Math.round(this.player.ship.pos.x - 16 + dist * 3 - ((this.player.ship.frameCount + i) % 8) * dist / (Math.ceil(Math.random() * 2) * i / 2)),
                    this.waterLevel - effectHeight,
                    16, effectHeight);
            }
        }

        cx.fillStyle = '#fff';

        // ship blast
        const size = Math.round(Math.exp((this.frameCount / 2) % 3) / 2);
        cx.fillRect(-game.width / 2, Math.round(this.player.ship.pos.y + 3) - size, game.width / 2 + Math.round(this.player.ship.pos.x), 1 + size * 2);

        // ship particles
        this.particles.push({
            x: Math.round(this.player.ship.pos.x) + Math.round(Math.random() * 8),
            y: Math.round(this.player.ship.pos.y + 8) + Math.round(Math.random() * 10 - 5),
            life: 1,
            step: 0.05 + Math.random() * 0.025,
            xSpeed: -6
        });
        // this.actors.filter(e => e instanceof Enemy).forEach(e => {
        //     this.particles.push({
        //         x: Math.round(e.pos.x + 16) + Math.round(Math.random() * 4),
        //         y: Math.round(e.pos.y + 12) + Math.round(Math.random() * 6 - 3),
        //         life: 1,
        //         step: 0.1 + Math.random() * 0.05,
        //         xSpeed: -6
        //     });
        // });

        this.particles = this.particles.filter(particle => particle.life > 0);
        this.particles.forEach(particle => {
            particle.life -= particle.step;
            particle.x += particle.xSpeed;
            cx.drawImage(game.assets.images.smoke, 8 * (particle.life > .6 ? 0 : particle.life > .2 ? 1 : 2), 0, 8, 8,
                particle.x - 4, particle.y - 4, 8, 8);
        });

        // Foreground
        cx.globalAlpha = .8;
        let bgoffset = 14;
        cx.drawImage(game.assets.images.bg,
            0, backgroundHeightBuffer + bgoffset, game.width, 48 - bgoffset,
            -game.width / 2 + game.width - Math.round(this.frameCount * 7) % game.width, backgroundHeightBuffer + bgoffset, game.width, 48 - bgoffset);

        cx.drawImage(game.assets.images.bg,
            0, backgroundHeightBuffer + bgoffset, game.width, 48 - bgoffset,
            -game.width / 2 - Math.round(this.frameCount * 7) % game.width, backgroundHeightBuffer + bgoffset, game.width, 48 - bgoffset);

        // dust trails
        for (let i = 0; i < game.height; i++) {
            if (Math.random() > .99) {
                cx.fillRect(-game.width / 2, i, Math.round(game.width * (0.5 + Math.random() / 2)), 1);
            }
        }

        cx.restore();
    }
}