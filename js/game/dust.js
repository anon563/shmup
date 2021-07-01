class Dust {
    constructor(pos, vel, life, size) {
        this.pos = pos;
        this.vel = vel;
        this.life = life;
        this.size = size;
    }

    update = game => {
        this.pos = this.pos.plus(this.vel);
        this.life--;
    }

    display = cx => {
        cx.fillRect(Math.round(this.pos.x), Math.round(this.pos.y), this.size, this.size);
    }
}