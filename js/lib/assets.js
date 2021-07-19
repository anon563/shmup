class Assets {
    images = new Object;
    imageList = [
        // Opening
        'opening',

        // Level
        'background_01',
        
        'scrap_1',
        'scrap_2',
        'scrap_3',
        'scrap_4',
        'scrap_5',
        
        'ray_1',
        'ray_2',
        'ray_3',
        'ray_4',
        
        'explosion',

        'in',

        'circle_4',
        'circle_8',
        'item',
        'fire',
        'smoke',
        'water',
        'bullet_2',
        'bullet_3',
        'bullet_4',
        'gun',

        'ship',
        'ship_open',
        'ship_2',
        'ship_3',
        // 'flare_idle',
        // 'flare_walk',
        // 'flare_jump',

        'aqua_idle',
        'aqua_walk',
        'aqua_jump',

        'marine_idle',
        'marine_walk',
        'marine_jump'
    ];
    
    constructor() {
        this.imageList.forEach(id => {
            this.images[id] = new Image;
            this.images[id].src = `img/${id}.png`;
        });
    }

    load = () => Promise.all(Object.keys(this.images).map(key => new Promise(resolve => this.images[key].onload = () => resolve())));
}