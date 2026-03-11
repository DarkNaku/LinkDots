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
        const { width, height } = this.cameras.main;
        const levelsData = this.cache.json.get('levels');
        const packData = levelsData.packs[this.packIndex];

        ui.createCircularBackButton(() => {
            this.scene.start('PackSelectScene');
        });

        ui.createTitle(packData.name, '#00FF00');

        const subTitle = `${packData.levels[0].size}x${packData.levels[0].size} - 쉬움`;
        ui.createSubTitle(subTitle, height * 0.18);

        const cols = 5;
        const spacing = 110;
        const startX = (width - (cols - 1) * spacing) / 2;
        const startY = height * 0.28;

        const packColor = parseInt(packData.themeColor || '0x00FF00');

        packData.levels.forEach((level, index) => {
            const x = startX + (index % cols) * spacing;
            const y = startY + Math.floor(index / cols) * spacing;
            
            ui.createStyledGridButton(x, y, `${index + 1}`, packColor, false, () => {
                this.scene.start('MainScene', { packIndex: this.packIndex, levelIndex: index });
            });
        });

        ui.createPagination(5, 0);

        this.cameras.main.fadeIn(500, 0, 0, 0);
    }
}
