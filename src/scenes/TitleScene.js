import { UIManager } from '../classes/UIManager.js';

export class TitleScene extends Phaser.Scene {
    constructor() {
        super({ key: 'TitleScene' });
    }

    preload() {
        if (!this.cache.json.has('levels')) {
            this.load.json('levels', 'assets/levels/levels.json');
        }
    }

    create() {
        const ui = new UIManager(this);
        ui.createTitle('LINK DOTS');

        // Pulsing dots background effect
        for (let i = 0; i < 15; i++) {
            const dot = this.add.circle(
                Phaser.Math.Between(0, 600),
                Phaser.Math.Between(0, 800),
                Phaser.Math.Between(10, 30),
                Phaser.Math.RND.pick([0xFF0000, 0x00FF00, 0x0000FF, 0xFFFF00, 0xFF00FF])
            );
            dot.setAlpha(0.3);
            this.tweens.add({
                targets: dot,
                alpha: 0.6,
                scale: 1.5,
                duration: Phaser.Math.Between(1000, 3000),
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
        }

        ui.createButton(300, 450, 'START GAME', () => {
            this.cameras.main.fadeOut(500, 0, 0, 0);
            this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
                this.scene.start('PackSelectScene');
            });
        });

        this.cameras.main.fadeIn(500, 0, 0, 0);
    }
}
