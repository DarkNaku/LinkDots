import { TitleScene } from './scenes/TitleScene.js';
import { PackSelectScene } from './scenes/PackSelectScene.js';
import { LevelSelectScene } from './scenes/LevelSelectScene.js';
import { MainScene } from './scenes/MainScene.js';

const config = {
    type: Phaser.AUTO,
    title: 'LinkDots',
    description: 'Flow Free Clone',
    parent: 'game-container',
    width: 720,
    height: 1280,
    backgroundColor: '#000000',
    pixelArt: false,
    scene: [
        TitleScene,
        PackSelectScene,
        LevelSelectScene,
        MainScene
    ],
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
}

new Phaser.Game(config);
