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

        // 1. Circular Back Button
        ui.createCircularBackButton(() => {
            this.scene.start('PackSelectScene');
        });

        // 2. Pack Title (Neon Green based on image)
        ui.createTitle(packData.name, '#00FF00');

        // 3. Pack SubTitle (e.g., 5x5 - Easy)
        const subTitle = `${packData.levels[0].size}x${packData.levels[0].size} - 쉬움`;
        ui.createSubTitle(subTitle, 170);

        // 4. Level Grid (5 columns)
        const cols = 5;
        const spacing = 85;
        const startX = (this.cameras.main.width - (cols - 1) * spacing) / 2;
        const startY = 260;

        const packColor = 0x00FF00; // Theme color for Classic Pack

        packData.levels.forEach((level, index) => {
            const x = startX + (index % cols) * spacing;
            const y = startY + Math.floor(index / cols) * spacing;
            
            // Assume level is not completed for now
            ui.createStyledGridButton(x, y, `${index + 1}`, packColor, false, () => {
                this.scene.start('MainScene', { packIndex: this.packIndex, levelIndex: index });
            });
        });

        // 5. Pagination Dots
        ui.createPagination(5, 0); // Total 5 pages, current page 0

        this.cameras.main.fadeIn(500, 0, 0, 0);
    }
}
