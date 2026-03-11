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
        const { width, height } = this.cameras.main;

        // 1. Settings Icon (Top Right)
        ui.createIconButton(width - 60, height * 0.08, '⚙️', () => {
            console.log('Settings clicked');
        });

        // 2. Main Logo "flow"
        ui.createMultiColorTitle(width / 2, height * 0.25, [
            { text: 'f', color: '#FF0000' },
            { text: 'l', color: '#00FF00' },
            { text: 'o', color: '#0000FF' },
            { text: 'w', color: '#FFFF00' }
        ], '160px');

        // 3. Menu List
        let menuY = height * 0.45;
        const menuSpacing = 110;

        ui.createMenuListItem(menuY, '무료 플레이', '>', () => {
            this.scene.start('PackSelectScene');
        });
        menuY += menuSpacing;

        const dailyBadge = ui.createBadge(0, 0, '6', '#FF0000');
        ui.createMenuListItem(menuY, '일일 퍼즐', dailyBadge, () => console.log('Daily'));
        menuY += menuSpacing;

        const weeklyBadge = ui.createBadge(0, 0, '30', '#0000FF');
        ui.createMenuListItem(menuY, '주간 퍼즐', weeklyBadge, () => console.log('Weekly'));
        menuY += menuSpacing;

        ui.createMenuListItem(menuY, '타임 트라이얼', '⏱️', () => console.log('Time Trial'));

        // 4. Bottom Utility Buttons
        const bottomY = height - 120;
        ui.createUtilityButton(width * 0.2, bottomY, '🚫', '광고 제거', () => {});
        ui.createUtilityButton(width / 2, bottomY, '🛒', '스토어', () => {});
        ui.createUtilityButton(width * 0.8, bottomY, '➕', '다른 게임', () => {});

        this.cameras.main.fadeIn(500, 0, 0, 0);
    }
}
