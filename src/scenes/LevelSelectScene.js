import { UIManager } from '../classes/UIManager.js';

export class LevelSelectScene extends Phaser.Scene {
    constructor() {
        super({ key: 'LevelSelectScene' });
    }

    init(data) {
        this.packIndex = data.packIndex || 0;
    }

    create() {
        const ui = new UIManager(this);
        const levelsData = this.cache.json.get('levels');
        const packData = levelsData.packs[this.packIndex];

        ui.createTitle(packData.name);

        const cols = 5;
        const startX = 110;
        const startY = 220;
        const spacing = 95;

        packData.levels.forEach((level, index) => {
            const x = startX + (index % cols) * spacing;
            const y = startY + Math.floor(index / cols) * spacing;
            
            ui.createGridButton(x, y, `${index + 1}`, () => {
                this.scene.start('MainScene', { packIndex: this.packIndex, levelIndex: index });
            });
        });

        ui.createBackButton(() => {
            this.scene.start('PackSelectScene');
        });

        this.cameras.main.fadeIn(500, 0, 0, 0);
    }
}
