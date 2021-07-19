class Level extends Activity {    
    frameCountNoInput = 0;
    lastKeys = {}

    actors = [];

    waterLevel = 254-64;
    backgroundParallax = [
        0, 128, 8, 8, 16, 16, 48
    ]
    
    particles = new ParticleManager();

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
            // character: new Character(MARINE, new Vector2(-32, 64)),
            character: null,
            mode: 'ship'
        }
        this.actors.push(this.player.ship);
        this.actors.push(new Character(AQUA, new Vector2(40, 0)));
    }

    flash = (frame = 6) => this.flashBuffer = frame;

    update = game => {
        const cx = game.cx;
        cx.save();

        if (!Object.entries(this.keys).find(key => key[1] === true)) this.frameCountNoInput++;
        else this.frameCountNoInput = 0;

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

        // Particles
        this.particles.update(cx, game.assets);

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
        
        // Flash
        if (this.flashBuffer) {
            cx.fillStyle = "#fff";
            cx.fillRect(-game.width / 2, 0, game.width, game.height);
            this.flashBuffer--;
        }

        // DEBUG Hitboxes
        if (DEBUGMODE) this.actors.forEach(actor => actor.displayCollisionBox(game));

        cx.restore();

        cx.fillText("WASDJK", 1, 8);
        
        this.lastKeys = JSON.parse(JSON.stringify(this.keys));
        this.frameCount++;
    }
}