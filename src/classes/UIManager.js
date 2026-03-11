export class UIManager {
    constructor(scene) {
        this.scene = scene;
        this.width = scene.cameras.main.width;
        this.height = scene.cameras.main.height;
        this.texts = new Map();
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

    showWinOverlay(isLastLevel, nextCallback) {
        const overlay = this.scene.add.rectangle(this.width / 2, this.height / 2, this.width, this.height, 0x000000, 0.8).setDepth(100);
        overlay.setAlpha(0);
        this.scene.tweens.add({ targets: overlay, alpha: 0.8, duration: 300 });

        const winText = this.scene.add.text(this.width / 2, this.height / 2 - 60, 'PERFECT!', {
            fontSize: '72px',
            fill: '#00FF00',
            fontStyle: 'bold',
            stroke: '#004400',
            strokeThickness: 8
        }).setOrigin(0.5).setDepth(101);

        const subText = this.scene.add.text(this.width / 2, this.height / 2 + 20, 'LEVEL COMPLETE', {
            fontSize: '32px',
            fill: '#FFFFFF'
        }).setOrigin(0.5).setDepth(101);

        if (!isLastLevel) {
            this.createButton(this.width / 2, this.height / 2 + 120, 'NEXT LEVEL', nextCallback).setDepth(101);
        } else {
            this.scene.add.text(this.width / 2, this.height / 2 + 120, 'ALL LEVELS COMPLETED!', {
                fontSize: '32px',
                fill: '#FFD700'
            }).setOrigin(0.5).setDepth(101);
        }
    }
}
