import { UIManager } from '../classes/UIManager.js';

export class PackSelectScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PackSelectScene' });
    }

    create() {
        const ui = new UIManager(this);
        const { width, height } = this.cameras.main;
        
        ui.createCircularBackButton(() => {
            this.scene.start('TitleScene');
        });

        ui.createMultiColorTitle(width / 2, height * 0.08, [
            { text: '레', color: '#FF0000' },
            { text: '벨', color: '#00FF00' }
        ], '64px');

        this.add.text(width / 2, height * 0.15, '추가 힌트가 필요하신가요? 지금 받으세요!', {
            fontSize: '24px',
            fill: '#FFFFFF'
        }).setOrigin(0.5);

        const levelsData = this.cache.json.get('levels');
        const categories = {};
        levelsData.packs.forEach(pack => {
            if (!categories[pack.category]) categories[pack.category] = [];
            categories[pack.category].push(pack);
        });

        let currentY = height * 0.22;
        const categoryOrder = ["소개", "마니아", "진행"];
        
        categoryOrder.forEach(catName => {
            const packs = categories[catName];
            if (!packs) return;

            ui.createSectionHeader(currentY, catName, parseInt(packs[0].headerColor || '0x444444'));
            currentY += 70;

            packs.forEach(pack => {
                const packIndexInData = levelsData.packs.indexOf(pack);
                const textColor = (pack.themeColor || '0xFFFFFF').replace('0x', '#');
                
                ui.createPackListItem(currentY, pack.name, `0 / ${pack.levels.length * 50}`, textColor, () => {
                    this.scene.start('LevelSelectScene', { packIndex: packIndexInData });
                });
                currentY += 85;
            });

            currentY += 30;
        });

        this.cameras.main.fadeIn(500, 0, 0, 0);
    }
}
