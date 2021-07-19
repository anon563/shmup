class ParticleManager {
    pool = [];

    update = (cx, assets) => {
        this.pool = this.pool.filter(particle => particle.life > 0);
        this.pool.forEach(particle => particle.update(cx, assets));
    }

    explosion = actor => {
        for (let i = 0; i < 16; i++) {
            this.pool.push(new Particle(
                actor.pos.plus(actor.size.times(.5)).plus(new Vector2(Math.round(Math.random() * 48 - 24), Math.round(Math.random() * 48 - 24))),
                new Vector2(18, 18),
                new Vector2(0, 0), 24, 1, 'explosion', i, null, null));
        }
    }

    scrap = actor => {
        for (let i = 0; i < 16; i++) {
            this.pool.push(new Particle(
                actor.pos.plus(actor.size.times(.5)),
                new Vector2(10, 10),
                new Vector2(-1 - Math.random(), Math.random() * 2 - 1),
                1,
                0.01 + Math.random() * 0.025,
                `scrap_${Math.ceil(Math.random() * 5)}`,
                null,
                activity => (activity.frameCount % 360) * (Math.PI / 180) * Math.round(Math.random() * 2) * (Math.random() > .5 ? 1 : -1),
                activity => [
                    Math.sin(((Math.round(Math.random() * 360) + actor.frameCount) % 360) * (Math.PI / 180) * (Math.random() > .5 ? 1 : -1) / 2),
                    Math.cos(((Math.round(Math.random() * 360) + actor.frameCount) % 360) * (Math.PI / 180) * (Math.random() > .5 ? 1 : -1) / 2)]
            ));
        }
    }

    ray = actor => {
        for (let i = 0; i < 2; i++) {
            this.pool.push(new Particle(
                actor.pos.plus(actor.size.times(.5)),
                new Vector2(128, 128),
                new Vector2(0, 0),
                1,
                0.25,
                `ray_${Math.ceil(Math.random() * 4)}`,
                i * 2, null, null
            ));
        }
    }

    smoke = actor => {
        this.pool.push(new Particle(
            new Vector2(Math.round(actor.pos.x) + Math.round(Math.random() * 8 - 4), Math.round(actor.pos.y + 9) + Math.round(Math.random() * 10 - 5)),
            new Vector2(8, 8), new Vector2(-6, 0), 1, 0.05 + Math.random() * 0.025, 'smoke', null, null, null));
    }
}

class Particle {
    constructor(pos, size, vel, life, step, asset, delay, rotate, scale) {
        this.pos = pos;
        this.size = size;
        this.vel = vel;
        this.life = life;
        this.step = step;
        this.asset = asset;
        this.delay = delay;
        this.rotate = rotate;
        this.scale = scale;
    }

    update = (cx, assets) => {
        if (this.delay) this.delay--;
        else {
            cx.save();
            cx.translate(this.pos.x, this.pos.y);
            if (this.rotate) cx.rotate(this.rotate(this));
            if (this.scale) cx.scale(...this.scale(this));
            this.life -= this.step;
            this.pos = this.pos.plus(this.vel);
            const posX = this.asset === 'explosion' ? 18 * (8 - Math.floor(this.life / 3)) : this.asset === 'smoke' ? 8 * (this.life > .6 ? 0 : this.life > .2 ? 1 : 2) : 0;
            cx.drawImage(assets.images[this.asset], posX, 0, this.size.x, this.size.y, -this.size.x / 2, -this.size.y / 2, this.size.x, this.size.y);
            cx.restore();
        }
    }
}