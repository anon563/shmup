class Vector2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    value = () => new Vector2(this.x, this.y);
    plus = other => new Vector2(this.x + other.x, this.y + other.y);
    times = factor => new Vector2(this.x * factor, this.y * factor);
    mult = other => new Vector2(this.x * other.x, this.y * other.y);
    dot = other => this.x * other.x + this.y * other.y;
    equals = other => this.x === other.x && this.y === other.y;
    floor = () => new Vector2(Math.floor(this.x), Math.floor(this.y));
    round = () => new Vector2(Math.round(this.x), Math.round(this.y));
    lerp = (other, amt) => new Vector2((1 - amt) * this.x + amt * other.x, (1 - amt) * this.y + amt * other.y);
    distance = other => Math.sqrt((this.x - other.x) ** 2 + (this.y - other.y) ** 2);
}

class CollisionBox2 {}
CollisionBox2.center = a => new Vector2(a.pos.x + a.size.x / 2, a.pos.y + a.size.y / 2);
CollisionBox2.collidesWith = (a, b) => CollisionBox2.collidesWithInAxis(a, b, "x") && CollisionBox2.collidesWithInAxis(a, b, "y");
CollisionBox2.collidesWithInAxis = (a, b, axis) => !(a.pos[axis] + a.size[axis] < b.pos[axis] || a.pos[axis] > b.pos[axis] + b.size[axis]);
CollisionBox2.collidingCollisionBoxes = (a, b) => b.filter(c => CollisionBox2.collidesWith(a, c));
CollisionBox2.intersects = (a, b) => CollisionBox2.intersectsInAxis(a, b, "x") && CollisionBox2.intersectsInAxis(a, b, "y");
CollisionBox2.intersectsInAxis = (a, b, axis) => !(a.pos[axis] + a.size[axis] <= b.pos[axis] || a.pos[axis] >= b.pos[axis] + b.size[axis]);
CollisionBox2.intersectingCollisionBoxes = (a, b) => b.filter(c => CollisionBox2.intersects(a, c));
CollisionBox2.includedIn = (a, b) => CollisionBox2.includedInAxis(a, b, "x") && CollisionBox2.includedInAxis(a, b, "y");
CollisionBox2.includedInAxis = (a, b, axis) => !(a.pos[axis] + a.size[axis] > b.pos[axis] + b.size[axis] || a.pos[axis] < b.pos[axis]);
CollisionBox2.includingCollisionBoxes = (a, b) => b.filter(c => CollisionBox2.includedIn(a, c));