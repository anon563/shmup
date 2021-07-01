class Fight extends Activity {

    turn = 0;

    constructor(keys) {
        super();
        this.p1 = new Character(keys, FLARE, new Vector2(-44, 112), true);
        this.p2 = new Character({}, MARINE, new Vector2(36, 112), false);
    }

    items = [new Item(new Vector2(-4, 0), new Vector2(8, 8))];

    actors = [];

    update = game => {
        const cx = game.cx;
        cx.save();

        this.items = this.items.filter(item => !item.isDone);
        this.actors = this.actors.filter(actor => !actor.isDone);

        // Actors logic
        const actors = [this.p1, this.p2, ...this.items, ...this.actors];
        actors.forEach(actor => actor.update(game, this));

        // Viewport
        cx.translate(game.width / 2, 0);

        // Background
        cx.drawImage(game.assets.images.bg, -game.width / 2, 0, game.width, game.height);
        
        // Actors display
        actors.forEach(actor => {
            cx.save();
            actor.display(cx, game.assets);
            // actor.displayCollisionBox(game);
            cx.restore();
        });

        cx.restore();
    }
}