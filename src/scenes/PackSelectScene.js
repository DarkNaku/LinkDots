import { UIManager } from '../classes/UIManager.js';

export class PackSelectScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PackSelectScene' });
    }

    create() {
        const ui = new UIManager(this);
        ui.createTitle('SELECT PACK');

        const levelsData = this.cache.json.get('levels');
        
        levelsData.packs.forEach((pack, index) => {
            ui.createButton(300, 250 + (index * 100), `${pack.name}`, () => {
                this.scene.start('LevelSelectScene', { packIndex: index });
            });
        });

        ui.createBackButton(() => {
            this.scene.start('TitleScene');
        });

        this.cameras.main.fadeIn(500, 0, 0, 0);
    }
}
