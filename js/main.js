let DEBUGMODE = false;

window.onload = () => {
    const game = new Game(new Assets());
    game.assets.load().then(requestAnimationFrame(game.loop));
}