class KeyboardListener {
    keys = { up: false, left: false, down: false, right: false, jump: false, attack: false, subattack: false }
    keyCodes = { KeyW: "up", KeyA: "left", KeyS: "down", KeyD: "right", KeyK: "jump", KeyJ: "attack", KeyL: "subattack" }

    constructor() {
        document.body.onkeydown = event => this.handler(event);
        document.body.onkeyup = event => this.handler(event);
    }

    handler = event => {
        event.preventDefault;
        if(event.code in this.keyCodes) this.keys[this.keyCodes[event.code]] = event.type === "keydown";
    }
}