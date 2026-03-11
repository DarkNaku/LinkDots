import { UIManager } from '../classes/UIManager.js';

export class PackSelectScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PackSelectScene' });
    }

    create() {
        const ui = new UIManager(this);
        
        // 1. Circular Back Button
        ui.createCircularBackButton(() => {
            this.scene.start('TitleScene');
        });

        // 2. Multi-color Title "레벨"
        ui.createMultiColorTitle(this.cameras.main.width / 2, 80, [
            { text: '레', color: '#FF0000' },
            { text: '벨', color: '#00FF00' }
        ]);

        // 3. Subtitle / Promotion Text
        this.add.text(this.cameras.main.width / 2, 160, '추가 힌트가 필요하신가요? 지금 받으세요!', {
            fontSize: '22px',
            fill: '#FFFFFF'
        }).setOrigin(0.5);

        const levelsData = this.cache.json.get('levels');
        
        // 4. Group packs by category
        const categories = {};
        levelsData.packs.forEach(pack => {
            if (!categories[pack.category]) categories[pack.category] = [];
            categories[pack.category].push(pack);
        });

        // 5. Render Sections and Items
        let currentY = 220;
        const categoryOrder = ["소개", "마니아", "진행"];
        
        categoryOrder.forEach(catName => {
            const packs = categories[catName];
            if (!packs) return;

            // Section Header
            const headerColor = packs[0].headerColor || '0x444444';
            ui.createSectionHeader(currentY, catName, parseInt(headerColor));
            currentY += 55;

            // Pack Items
            packs.forEach((pack, index) => {
                const packIndexInData = levelsData.packs.indexOf(pack);
                const themeColor = pack.themeColor || '#FFFFFF';
                // Convert 0x format string to # format if necessary for text fill
                const textColor = themeColor.replace('0x', '#');
                
                ui.createPackListItem(currentY, pack.name, `0 / ${pack.levels.length * 50}`, textColor, () => {
                    this.scene.start('LevelSelectScene', { packIndex: packIndexInData });
                });
                currentY += 60;
            });

            currentY += 20; // Margin between categories
        });

        this.cameras.main.fadeIn(500, 0, 0, 0);
    }
}
