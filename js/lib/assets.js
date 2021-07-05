class Assets {
    images = new Object;
    imageDataList = [
        { id: 'bg', src: 'img/bg.png' },
        { id: 'item', src: 'img/item.png' },
        { id: 'bullet', src: 'img/bullet.png' },
        { id: 'fire', src: 'img/fire.png' },
        { id: 'smoke', src: 'img/smoke.png' },
        { id: 'water', src: 'img/water.png' },
        { id: 'bullet_2', src: 'img/bullet_2.png' },
        { id: 'gun', src: 'img/gun.png' },
        { id: 'ship', src: 'img/ship.png' },
        { id: 'ship_2', src: 'img/ship_2.png' },
        { id: 'flare_idle', src: 'img/flare_idle.png' },
        { id: 'flare_walk', src: 'img/flare_walk.png' },
        { id: 'flare_jump', src: 'img/flare_jump.png' },
        { id: 'marine_idle', src: 'img/marine_idle.png' },
        { id: 'marine_walk', src: 'img/marine_walk.png' },
        { id: 'marine_jump', src: 'img/marine_jump.png' }
    ];
    
    constructor() {
        this.imageDataList.forEach(imageData => {
            this.images[imageData.id] = new Image;
            this.images[imageData.id].src = imageData.src;
        });
    }

    load = () => Promise.all(Object.keys(this.images).map(key => new Promise(resolve => this.images[key].onload = () => resolve())));
}