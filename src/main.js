import { MainScene } from './scenes/MainScene.js';

const config = {
    type: Phaser.AUTO,
    title: 'LinkDots',
    description: 'Flow Free Clone',
    parent: 'game-container',
    width: 640,
    height: 1136,
    backgroundColor: '#000000',
    pixelArt: false,
    scene: [
        MainScene
    ],
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
}

new Phaser.Game(config);
