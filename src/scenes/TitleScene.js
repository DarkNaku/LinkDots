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
        ui.createIconButton(width - 50, 50, '⚙️', () => {
            console.log('Settings clicked');
        });

        // 2. Main Logo "flow"
        ui.createMultiColorTitle(width / 2, 220, [
            { text: 'f', color: '#FF0000' },
            { text: 'l', color: '#00FF00' },
            { text: 'o', color: '#0000FF' },
            { text: 'w', color: '#FFFF00' }
        ], '120px');

        // 3. Menu List
        let menuY = 420;
        const menuSpacing = 90;

        // 무료 플레이
        ui.createMenuListItem(menuY, '무료 플레이', '>', () => {
            this.scene.start('PackSelectScene');
        });
        menuY += menuSpacing;

        // 일일 퍼즐
        const dailyBadge = ui.createBadge(0, 0, '6', '#FF0000');
        ui.createMenuListItem(menuY, '일일 퍼즐', dailyBadge, () => {
            console.log('Daily Puzzles clicked');
        });
        menuY += menuSpacing;

        // 주간 퍼즐
        const weeklyBadge = ui.createBadge(0, 0, '30', '#0000FF');
        ui.createMenuListItem(menuY, '주간 퍼즐', weeklyBadge, () => {
            console.log('Weekly Puzzles clicked');
        });
        menuY += menuSpacing;

        // 타임 트라이얼
        ui.createMenuListItem(menuY, '타임 트라이얼', '⏱️', () => {
            console.log('Time Trial clicked');
        });

        // 4. Bottom Utility Buttons
        const bottomY = height - 80;
        ui.createUtilityButton(120, bottomY, '🚫', '광고 제거', () => console.log('Remove Ads'));
        ui.createUtilityButton(width / 2, bottomY, '🛒', '스토어', () => console.log('Store'));
        ui.createUtilityButton(width - 120, bottomY, '➕', '다른 게임', () => console.log('More Games'));

        this.cameras.main.fadeIn(500, 0, 0, 0);
    }
}
