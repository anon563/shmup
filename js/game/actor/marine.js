const MARINE = {
    name: 'marine',
    size: { x: 8, y: 16 },

    actions: {
        idle: {
            animation: {
                offset: { x: -8, y: -8 },
                size: { x: 24, y: 24 },
                speed: 1 / 16,
                frames: 2
            }
        },
        walk: {
            animation: {
                offset: { x: -8, y: -8 },
                size: { x: 24, y: 24 },
                speed: 1 / 12,
                frames: 2
            }
        },
        jump: {
            animation: {
                duration: 1,
                offset: { x: -8, y: -8 },
                size: { x: 24, y: 24 },
                speed: 1,
                frames: 1
            }
        }
    }
}