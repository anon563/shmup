class Level extends Activity {    
    frameCountNoInput = 0;
    lastKeys = {}

    actors = [];

    waterLevel = 254-64;
    skewedFactor = [8, 0, 2, 6, 10, 12, 14, 15];
    backgroundParallax = [
        0, 128, 8, 8, 16, 16, 48
    ]
    
    particles = [];

    events = {
        0: (game, activity) => {
            activity.actors.push(new Enemy(new Vector2(0, 50), new Vector2(25, 12), true, 32));
            activity.actors.push(new Enemy(new Vector2(25, 25), new Vector2(25, 12), true, 32));
            activity.actors.push(new Enemy(new Vector2(0, 75), new Vector2(25, 12), true, 32));
            activity.actors.push(new Enemy(new Vector2(25, 100), new Vector2(25, 12), true, 32));
            activity.actors.push(new Enemy(new Vector2(75, 50), new Vector2(25, 12), true, 32));
            activity.actors.push(new Enemy(new Vector2(50, 25), new Vector2(25, 12), true, 32));
            activity.actors.push(new Enemy(new Vector2(75, 75), new Vector2(25, 12), true, 32));
            activity.actors.push(new Enemy(new Vector2(50, 100), new Vector2(25, 12), true, 32));
            activity.actors.push(new Enemy(new Vector2(37, 57), new Vector2(25, 25), false, 128));
        }
    }

    constructor(keys, width, height) {
        super();
        this.keys = keys;
        this.player = {
            ship: new Ship(new Vector2(-64, this.waterLevel - 9), new Vector2(51, 9), width, this.waterLevel, true),
            character: new Character(MARINE, new Vector2(-32, 64)),
            mode: 'ship'
        }
        this.actors.push(this.player.ship);
        this.actors.push(this.player.character);
        this.actors.push(new Character(AQUA, new Vector2(40, 0)))
    }

    update = game => {
        const cx = game.cx;
        cx.save();

        
        if (!Object.entries(this.keys).find(key => key[1] === true)) this.frameCountNoInput++;
        else this.frameCountNoInput = 0;

        if (this.keys.subattack && !this.lastKeys.subattack) this.player.mode = this.player.mode === 'ship' ? 'character' : 'ship';

        if (this.events[this.frameCount]) this.events[this.frameCount](game, this);

        //debugmode
        if (!this.actors.find(a => a instanceof Enemy)) {
            this.events[0](game, this);
        }

        this.actors = this.actors.filter(actor => !actor.isDone);

        // Viewport
        const rumble = this.actors.find(a => a.gotHit);
        cx.translate(game.width / 2 + (rumble ? Math.round(Math.random() * 4 - 2) : 0), (rumble ? Math.round(Math.random() * 4 - 2) : 0));

        // Background
        let backgroundHeightBuffer = 0;
        for (let i = 0; i < this.backgroundParallax.length - 1; i++) {
            backgroundHeightBuffer += this.backgroundParallax[i];
            cx.drawImage(game.assets.images.background_01,
                0, backgroundHeightBuffer, game.width, this.backgroundParallax[i + 1],
                -game.width / 2 + game.width - Math.round(this.frameCount * (i + 1)) % game.width, backgroundHeightBuffer, game.width, this.backgroundParallax[i + 1]);

            cx.drawImage(game.assets.images.background_01,
                0, backgroundHeightBuffer, game.width, this.backgroundParallax[i + 1],
                -game.width / 2 - Math.round(this.frameCount * (i + 1)) % game.width, backgroundHeightBuffer, game.width, this.backgroundParallax[i + 1]);
        }
        
        // Actors logic
        this.actors.forEach(actor => actor.update(game, this));

        if (!this.player.ship.isDone) {
            // ship water splash
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

            // ship blast
            cx.fillStyle = '#fff';
            const size = Math.round(Math.exp((this.frameCount / 2) % 3) / 2);
            cx.fillRect(-game.width / 2, Math.round(this.player.ship.pos.y + 3) - size, game.width / 2 + Math.round(this.player.ship.pos.x), 1 + size * 2);
            
            // ship particles
            this.particles.push({
                pos: new Vector2(
                    Math.round(this.player.ship.pos.x) + Math.round(Math.random() * 8),
                    Math.round(this.player.ship.pos.y + 8) + Math.round(Math.random() * 10 - 5)
                ),
                vel: new Vector2(
                    -6,
                    0
                ),
                life: 1,
                step: 0.05 + Math.random() * 0.025,
                asset: 'smoke'
            });
        }

        // cx.translate(-game.width / 2, 0);
        this.particles = this.particles.filter(particle => particle.life > 0);
        this.particles.forEach(particle => {
            cx.save();
            cx.translate(particle.pos.x, particle.pos.y);
            if (particle.rotate) cx.rotate(particle.rotate(this));
            if (particle.scale) cx.scale(...particle.scale(this));
            particle.life -= particle.step;
            particle.pos = particle.pos.plus(particle.vel);
            if (particle.asset === 'smoke') cx.drawImage(game.assets.images[particle.asset],
                8 * (particle.life > .6 ? 0 : particle.life > .2 ? 1 : 2), 0, 8, 8,
                -4, -4, 8, 8);
            else if (particle.size) {
                cx.drawImage(game.assets.images[particle.asset],
                    0, 0, particle.size.x, particle.size.y,
                    -particle.size.x / 2, -particle.size.y / 2, particle.size.x, particle.size.y);
            }
            else cx.drawImage(game.assets.images[particle.asset],
                0, 0, 10, 10,
                -5, -5, 10, 10);
            cx.restore();
        });
        // cx.translate(game.width / 2, 0);

        // Foreground
        cx.globalAlpha = .8;
        let bgoffset = 14;
        cx.drawImage(game.assets.images.background_01,
            0, backgroundHeightBuffer + bgoffset, game.width, 48 - bgoffset,
            -game.width / 2 + game.width - Math.round(this.frameCount * 7) % game.width, backgroundHeightBuffer + bgoffset, game.width, 48 - bgoffset);

        cx.drawImage(game.assets.images.background_01,
            0, backgroundHeightBuffer + bgoffset, game.width, 48 - bgoffset,
            -game.width / 2 - Math.round(this.frameCount * 7) % game.width, backgroundHeightBuffer + bgoffset, game.width, 48 - bgoffset);
        cx.globalAlpha = 1;

        // dust trails
        cx.fillStyle = '#fff';
        for (let i = 0; i < game.height; i++) {
            if (Math.random() > .99) {
                cx.fillRect(-game.width / 2, i, Math.round(game.width * (0.5 + Math.random() / 2)), 1);
            }
        }
        
        // DEBUG Hitboxes
        if (DEBUGMODE) this.actors.forEach(actor => actor.displayCollisionBox(game));

        cx.restore();

        cx.save();
        cx.imageSmoothingEnabled = false;
        cx.translate(12, game.height - 12);
        const angle = (this.frameCount % 360) * (Math.PI / 180) * 2;
        cx.rotate(angle);
        cx.scale(Math.sin(angle) / 2, Math.cos(angle) / 2);
        cx.drawImage(game.assets.images['ship'], 0, 0, 54, 16, -27, -8, 54, 16);
        cx.restore();

        cx.fillText("WASD: move, J: shoot, K: jump (marine), L: switch", 1, 8);
        
        this.lastKeys = JSON.parse(JSON.stringify(this.keys));
        this.frameCount++;
    }
}