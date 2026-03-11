export class UIManager {
    constructor(scene) {
        this.scene = scene;
        this.width = scene.cameras.main.width;
        this.height = scene.cameras.main.height;
        this.texts = new Map();
    }

    createTitle(text) {
        return this.scene.add.text(this.width / 2, 80, text, {
            fontSize: '42px',
            fill: '#00F0FF',
            fontStyle: 'bold',
            stroke: '#005050',
            strokeThickness: 6
        }).setOrigin(0.5);
    }

    createHUD(packName, levelId, moves, flow) {
        // Title with Neon Style
        this.texts.set('title', this.scene.add.text(this.width / 2, 50, `${packName} - Level ${levelId}`, {
            fontSize: '32px',
            fill: '#00F0FF',
            fontStyle: 'bold',
            stroke: '#005050',
            strokeThickness: 4
        }).setOrigin(0.5));

        // Stats Container
        this.texts.set('moves', this.scene.add.text(this.width / 2 - 100, 110, `Moves: ${moves}`, {
            fontSize: '24px',
            fill: '#FFFFFF'
        }).setOrigin(0.5));

        this.texts.set('flow', this.scene.add.text(this.width / 2 + 100, 110, `Flow: ${flow}%`, {
            fontSize: '24px',
            fill: '#FFFFFF'
        }).setOrigin(0.5));
    }

    updateHUD(moves, flow) {
        const movesText = this.texts.get('moves');
        const flowText = this.texts.get('flow');
        if (movesText) movesText.setText(`Moves: ${moves}`);
        if (flowText) flowText.setText(`Flow: ${flow}%`);
    }

    createButton(x, y, text, callback) {
        const btn = this.scene.add.text(x, y, text, {
            fontSize: '28px',
            fill: '#FFF',
            backgroundColor: '#1A1A40',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        btn.on('pointerover', () => btn.setStyle({ fill: '#00F0FF', backgroundColor: '#2A2A60' }));
        btn.on('pointerout', () => btn.setStyle({ fill: '#FFF', backgroundColor: '#1A1A40' }));
        btn.on('pointerdown', () => {
            this.scene.tweens.add({
                targets: btn,
                scale: 0.9,
                duration: 50,
                yoyo: true,
                onComplete: callback
            });
        });

        return btn;
    }

    createBackButton(callback) {
        const btn = this.scene.add.text(30, 30, '< BACK', {
            fontSize: '20px',
            fill: '#FFF',
            backgroundColor: '#444',
            padding: { x: 10, y: 5 }
        }).setInteractive({ useHandCursor: true });

        btn.on('pointerover', () => btn.setStyle({ fill: '#00F0FF' }));
        btn.on('pointerout', () => btn.setStyle({ fill: '#FFF' }));
        btn.on('pointerdown', callback);

        return btn;
    }

    createGridButton(x, y, text, callback) {
        const size = 60;
        const btnBg = this.scene.add.rectangle(x, y, size, size, 0x1A1A40).setInteractive({ useHandCursor: true });
        const btnText = this.scene.add.text(x, y, text, {
            fontSize: '24px',
            fill: '#FFF'
        }).setOrigin(0.5);

        btnBg.on('pointerover', () => btnBg.setFillStyle(0x2A2A60));
        btnBg.on('pointerout', () => btnBg.setFillStyle(0x1A1A40));
        btnBg.on('pointerdown', () => {
            this.scene.tweens.add({
                targets: [btnBg, btnText],
                scale: 0.9,
                duration: 50,
                yoyo: true,
                onComplete: callback
            });
        });

        return btnBg;
    }

    showWinOverlay(isLastLevel, nextCallback, menuCallback) {
        const overlay = this.scene.add.rectangle(this.width / 2, this.height / 2, this.width, this.height, 0x000000, 0.8).setDepth(100);
        overlay.setAlpha(0);
        this.scene.tweens.add({ targets: overlay, alpha: 0.8, duration: 300 });

        const winText = this.scene.add.text(this.width / 2, this.height / 2 - 80, 'PERFECT!', {
            fontSize: '72px',
            fill: '#00FF00',
            fontStyle: 'bold',
            stroke: '#004400',
            strokeThickness: 8
        }).setOrigin(0.5).setDepth(101);

        if (!isLastLevel) {
            this.createButton(this.width / 2, this.height / 2 + 60, 'NEXT LEVEL', nextCallback).setDepth(101);
        } else {
            this.scene.add.text(this.width / 2, this.height / 2 + 40, 'PACK COMPLETED!', {
                fontSize: '32px',
                fill: '#FFD700'
            }).setOrigin(0.5).setDepth(101);
        }

        this.createButton(this.width / 2, this.height / 2 + 160, 'LEVEL SELECT', menuCallback).setDepth(101);
    }
}
