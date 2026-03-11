export class UIManager {
    constructor(scene) {
        this.scene = scene;
        this.width = scene.cameras.main.width;
        this.height = scene.cameras.main.height;
        this.texts = new Map();
    }

    createTitle(text, color = '#00F0FF') {
        return this.scene.add.text(this.width / 2, 80, text, {
            fontSize: '42px',
            fill: color,
            fontStyle: 'bold',
            stroke: '#005050',
            strokeThickness: 6
        }).setOrigin(0.5);
    }

    createMultiColorTitle(x, y, parts) {
        const container = this.scene.add.container(x, y);
        let currentX = 0;
        
        // Calculate total width to center it manually if needed, 
        // but here we assume x is the start or center.
        // Let's calculate total width first.
        let totalWidth = 0;
        const textObjects = parts.map(part => {
            const txt = this.scene.add.text(0, 0, part.text, {
                fontSize: '54px',
                fill: part.color,
                fontStyle: 'bold'
            }).setOrigin(0, 0.5);
            totalWidth += txt.width;
            return txt;
        });

        let startX = -totalWidth / 2;
        textObjects.forEach((txt, i) => {
            txt.x = startX;
            startX += txt.width;
            container.add(txt);
        });

        return container;
    }

    createSubTitle(text, y = 150) {
        return this.scene.add.text(this.width / 2, y, text, {
            fontSize: '36px',
            fill: '#FFFFFF',
            fontStyle: 'normal'
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

    createCircularBackButton(callback) {
        const x = 55;
        const y = 80;
        const radius = 24;
        
        const container = this.scene.add.container(x, y);
        const bg = this.scene.add.graphics();
        bg.lineStyle(3, 0xFFFFFF, 1);
        bg.strokeCircle(0, 0, radius);
        
        const arrow = this.scene.add.text(0, 0, '<', {
            fontSize: '28px',
            fill: '#FFF',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        container.add([bg, arrow]);
        
        const hitArea = this.scene.add.circle(0, 0, radius).setInteractive({ useHandCursor: true });
        container.add(hitArea);

        hitArea.on('pointerover', () => arrow.setFill('#00FF00'));
        hitArea.on('pointerout', () => arrow.setFill('#FFFFFF'));
        hitArea.on('pointerdown', () => {
            this.scene.tweens.add({
                targets: container,
                scale: 0.9,
                duration: 50,
                yoyo: true,
                onComplete: callback
            });
        });

        return container;
    }

    createStyledGridButton(x, y, text, color, isCompleted, callback) {
        const size = 64;
        const container = this.scene.add.container(x, y);
        
        const bg = this.scene.add.graphics();
        if (isCompleted) {
            bg.fillStyle(color, 1);
            bg.fillRect(-size / 2, -size / 2, size, size);
        } else {
            bg.lineStyle(2, color, 1);
            bg.strokeRect(-size / 2, -size / 2, size, size);
        }

        const btnText = this.scene.add.text(0, 0, text, {
            fontSize: '28px',
            fill: '#FFF'
        }).setOrigin(0.5);

        container.add([bg, btnText]);
        
        const hitArea = this.scene.add.rectangle(0, 0, size, size).setInteractive({ useHandCursor: true });
        container.add(hitArea);

        hitArea.on('pointerover', () => {
            if (!isCompleted) bg.lineStyle(3, color, 1).strokeRect(-size / 2, -size / 2, size, size);
        });
        hitArea.on('pointerout', () => {
            if (!isCompleted) {
                bg.clear();
                bg.lineStyle(2, color, 1).strokeRect(-size / 2, -size / 2, size, size);
            }
        });
        hitArea.on('pointerdown', () => {
            this.scene.tweens.add({
                targets: container,
                scale: 0.9,
                duration: 50,
                yoyo: true,
                onComplete: callback
            });
        });

        return container;
    }

    createSectionHeader(y, text, color) {
        const bg = this.scene.add.graphics();
        bg.fillStyle(color, 1);
        bg.fillRect(0, y - 22, this.width, 45);

        const txt = this.scene.add.text(20, y, text, {
            fontSize: '24px',
            fill: '#FFF',
            fontStyle: 'bold'
        }).setOrigin(0, 0.5);

        return { bg, txt };
    }

    createPackListItem(y, name, progress, color, callback) {
        const container = this.scene.add.container(0, y);
        
        const nameTxt = this.scene.add.text(20, 0, name, {
            fontSize: '28px',
            fill: color,
            fontStyle: 'bold'
        }).setOrigin(0, 0.5);

        const progressTxt = this.scene.add.text(this.width - 20, 0, progress, {
            fontSize: '28px',
            fill: '#FFF'
        }).setOrigin(1, 0.5);

        container.add([nameTxt, progressTxt]);

        const hitArea = this.scene.add.rectangle(this.width / 2, 0, this.width, 60, 0xffffff, 0).setInteractive({ useHandCursor: true });
        container.add(hitArea);

        hitArea.on('pointerover', () => {
            nameTxt.setAlpha(0.8);
            progressTxt.setAlpha(0.8);
        });
        hitArea.on('pointerout', () => {
            nameTxt.setAlpha(1);
            progressTxt.setAlpha(1);
        });
        hitArea.on('pointerdown', () => {
            this.scene.tweens.add({
                targets: container,
                scale: 0.98,
                duration: 50,
                yoyo: true,
                onComplete: callback
            });
        });

        return container;
    }

    createPagination(total, current) {
        const startX = (this.width - (total - 1) * 20) / 2;
        const y = 740;
        
        for (let i = 0; i < total; i++) {
            const dot = this.scene.add.circle(startX + i * 20, y, 4, 0xFFFFFF);
            dot.setAlpha(i === current ? 1 : 0.4);
        }
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
