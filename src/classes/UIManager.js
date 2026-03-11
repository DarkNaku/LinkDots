export class UIManager {
    constructor(scene) {
        this.scene = scene;
        this.width = scene.cameras.main.width;
        this.height = scene.cameras.main.height;
        this.texts = new Map();
    }

    createTitle(text, color = '#00F0FF') {
        return this.scene.add.text(this.width / 2, this.height * 0.08, text, {
            fontSize: '48px',
            fill: color,
            fontStyle: 'bold',
            stroke: '#005050',
            strokeThickness: 6
        }).setOrigin(0.5);
    }

    createMultiColorTitle(x, y, parts, fontSize = '54px') {
        const container = this.scene.add.container(x, y);
        let totalWidth = 0;
        const textObjects = parts.map(part => {
            const txt = this.scene.add.text(0, 0, part.text, {
                fontSize: fontSize,
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

    createSubTitle(text, y) {
        const posY = y || this.height * 0.15;
        return this.scene.add.text(this.width / 2, posY, text, {
            fontSize: '36px',
            fill: '#FFFFFF',
            fontStyle: 'normal'
        }).setOrigin(0.5);
    }

    createIconButton(x, y, icon, callback) {
        const btn = this.scene.add.text(x, y, icon, {
            fontSize: '42px',
            fill: '#FFF'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        btn.on('pointerdown', callback);
        return btn;
    }

    createBadge(x, y, text, color) {
        const container = this.scene.add.container(x, y);
        const bg = this.scene.add.graphics();
        const w = 60;
        const h = 36;
        
        bg.fillStyle(color, 1);
        bg.beginPath();
        bg.moveTo(-w/2, -h/2);
        bg.lineTo(w/2, -h/2);
        bg.lineTo(w/2 + 12, 0);
        bg.lineTo(w/2, h/2);
        bg.lineTo(-w/2, h/2);
        bg.lineTo(-w/2 - 12, 0);
        bg.closePath();
        bg.fillPath();

        const txt = this.scene.add.text(0, 0, text, {
            fontSize: '24px',
            fill: '#FFF',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        container.add([bg, txt]);
        return container;
    }

    createMenuListItem(y, text, rightElement, callback) {
        const container = this.scene.add.container(0, y);
        
        const label = this.scene.add.text(this.width * 0.12, 0, text, {
            fontSize: '48px',
            fill: '#FFF'
        }).setOrigin(0, 0.5);

        container.add(label);

        if (rightElement) {
            if (typeof rightElement === 'string') {
                const icon = this.scene.add.text(this.width * 0.88, 0, rightElement, {
                    fontSize: '48px',
                    fill: '#FFF'
                }).setOrigin(1, 0.5);
                container.add(icon);
            } else {
                rightElement.setPosition(this.width * 0.88, 0);
                container.add(rightElement);
            }
        }

        const hitArea = this.scene.add.rectangle(this.width / 2, 0, this.width, 100, 0xffffff, 0).setInteractive({ useHandCursor: true });
        container.add(hitArea);

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

    createUtilityButton(x, y, icon, text, callback) {
        const container = this.scene.add.container(x, y);
        
        const iconTxt = this.scene.add.text(0, -25, icon, {
            fontSize: '48px',
            fill: '#FFF'
        }).setOrigin(0.5);

        const labelTxt = this.scene.add.text(0, 30, text, {
            fontSize: '22px',
            fill: '#FFF'
        }).setOrigin(0.5);

        container.add([iconTxt, labelTxt]);

        const hitArea = this.scene.add.rectangle(0, 0, 160, 120, 0xffffff, 0).setInteractive({ useHandCursor: true });
        container.add(hitArea);

        hitArea.on('pointerdown', callback);
        return container;
    }

    createGameHeader(levelId, size, backCallback, settingsCallback) {
        // Back Button
        this.createCircularBackButton(backCallback);

        // Level Info
        const infoX = this.width / 2;
        const infoY = this.height * 0.08;
        
        const levelText = this.scene.add.text(infoX - 40, infoY, `레벨 ${levelId}`, {
            fontSize: '42px',
            fill: '#00FF00',
            fontStyle: 'bold'
        }).setOrigin(1, 0.5);

        const sizeText = this.scene.add.text(infoX - 20, infoY, `${size}x${size}`, {
            fontSize: '36px',
            fill: '#FFFFFF'
        }).setOrigin(0, 0.5);

        // Settings Icon
        this.createIconButton(this.width - 70, infoY, '⚙️', settingsCallback);
    }

    createStatsBar(y) {
        const statsY = y;
        const fontSize = '24px';
        const fill = '#FFFFFF';

        this.texts.set('flow', this.scene.add.text(30, statsY, '흐름: 0/0', { fontSize, fill }).setOrigin(0, 0.5));
        this.texts.set('moves', this.scene.add.text(this.width / 2, statsY, '무브: 0 최고: -', { fontSize, fill }).setOrigin(0.5, 0.5));
        this.texts.set('pipe', this.scene.add.text(this.width - 30, statsY, '파이프: 0%', { fontSize, fill }).setOrigin(1, 0.5));
    }

    updateStats(connected, total, moves, best, pipe) {
        const flowTxt = this.texts.get('flow');
        const movesTxt = this.texts.get('moves');
        const pipeTxt = this.texts.get('pipe');

        if (flowTxt) flowTxt.setText(`흐름: ${connected}/${total}`);
        if (movesTxt) movesTxt.setText(`무브: ${moves} 최고: ${best || '-'}`);
        if (pipeTxt) pipeTxt.setText(`파이프: ${pipe}%`);
    }

    createGameControls(callbacks) {
        const bottomY = this.height * 0.85;
        
        // Undo
        this.createIconButton(this.width * 0.15, bottomY, '↩️', callbacks.undo);
        
        // Hint (Bulb)
        const hintBtn = this.createIconButton(this.width / 2, bottomY, '💡', callbacks.hint);
        hintBtn.setFontSize('64px');
        
        // Hint Badge
        this.createBadge(this.width / 2 - 40, bottomY + 20, '+ 3', '#444');

        // Reset
        this.createIconButton(this.width * 0.85, bottomY, '🔄', callbacks.reset);
    }

    // Legacy method for compatibility during transition
    createHUD(packName, levelId, moves, flow) {
        // This will be replaced by createGameHeader and createStatsBar in MainScene
    }

    updateHUD(moves, flow) {
        // This will be replaced by updateStats in MainScene
    }

    createButton(x, y, text, callback) {
        const btn = this.scene.add.text(x, y, text, {
            fontSize: '32px',
            fill: '#FFF',
            backgroundColor: '#1A1A40',
            padding: { x: 25, y: 15 }
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
        const btn = this.scene.add.text(40, 40, '< BACK', {
            fontSize: '24px',
            fill: '#FFF',
            backgroundColor: '#444',
            padding: { x: 12, y: 8 }
        }).setInteractive({ useHandCursor: true });

        btn.on('pointerover', () => btn.setStyle({ fill: '#00F0FF' }));
        btn.on('pointerout', () => btn.setStyle({ fill: '#FFF' }));
        btn.on('pointerdown', callback);

        return btn;
    }

    createCircularBackButton(callback) {
        const x = 70;
        const y = this.height * 0.08;
        const radius = 30;
        
        const container = this.scene.add.container(x, y);
        const bg = this.scene.add.graphics();
        bg.lineStyle(3, 0xFFFFFF, 1);
        bg.strokeCircle(0, 0, radius);
        
        const arrow = this.scene.add.text(0, 0, '<', {
            fontSize: '36px',
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
        const size = 80;
        const container = this.scene.add.container(x, y);
        
        const bg = this.scene.add.graphics();
        if (isCompleted) {
            bg.fillStyle(color, 1);
            bg.fillRect(-size / 2, -size / 2, size, size);
        } else {
            bg.lineStyle(3, color, 1);
            bg.strokeRect(-size / 2, -size / 2, size, size);
        }

        const btnText = this.scene.add.text(0, 0, text, {
            fontSize: '36px',
            fill: '#FFF'
        }).setOrigin(0.5);

        container.add([bg, btnText]);
        
        const hitArea = this.scene.add.rectangle(0, 0, size, size).setInteractive({ useHandCursor: true });
        container.add(hitArea);

        hitArea.on('pointerover', () => {
            if (!isCompleted) bg.lineStyle(4, color, 1).strokeRect(-size / 2, -size / 2, size, size);
        });
        hitArea.on('pointerout', () => {
            if (!isCompleted) {
                bg.clear();
                bg.lineStyle(3, color, 1).strokeRect(-size / 2, -size / 2, size, size);
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
        bg.fillRect(0, y - 30, this.width, 60);

        const txt = this.scene.add.text(30, y, text, {
            fontSize: '32px',
            fill: '#FFF',
            fontStyle: 'bold'
        }).setOrigin(0, 0.5);

        return { bg, txt };
    }

    createPackListItem(y, name, progress, color, callback) {
        const container = this.scene.add.container(0, y);
        
        const nameTxt = this.scene.add.text(30, 0, name, {
            fontSize: '36px',
            fill: color,
            fontStyle: 'bold'
        }).setOrigin(0, 0.5);

        const progressTxt = this.scene.add.text(this.width - 30, 0, progress, {
            fontSize: '32px',
            fill: '#FFF'
        }).setOrigin(1, 0.5);

        container.add([nameTxt, progressTxt]);

        const hitArea = this.scene.add.rectangle(this.width / 2, 0, this.width, 80, 0xffffff, 0).setInteractive({ useHandCursor: true });
        container.add(hitArea);

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
        const startX = (this.width - (total - 1) * 30) / 2;
        const y = this.height * 0.92;
        
        for (let i = 0; i < total; i++) {
            const dot = this.scene.add.circle(startX + i * 30, y, 6, 0xFFFFFF);
            dot.setAlpha(i === current ? 1 : 0.4);
        }
    }

    showWinOverlay(isLastLevel, nextCallback, menuCallback) {
        const overlay = this.scene.add.rectangle(this.width / 2, this.height / 2, this.width, this.height, 0x000000, 0.8).setDepth(100);
        overlay.setAlpha(0);
        this.scene.tweens.add({ targets: overlay, alpha: 0.8, duration: 300 });

        const winText = this.scene.add.text(this.width / 2, this.height * 0.4, 'PERFECT!', {
            fontSize: '96px',
            fill: '#00FF00',
            fontStyle: 'bold',
            stroke: '#004400',
            strokeThickness: 10
        }).setOrigin(0.5).setDepth(101);

        if (!isLastLevel) {
            this.createButton(this.width / 2, this.height * 0.55, 'NEXT LEVEL', nextCallback).setDepth(101);
        } else {
            this.scene.add.text(this.width / 2, this.height * 0.55, 'PACK COMPLETED!', {
                fontSize: '48px',
                fill: '#FFD700'
            }).setOrigin(0.5).setDepth(101);
        }

        this.createButton(this.width / 2, this.height * 0.68, 'LEVEL SELECT', menuCallback).setDepth(101);
    }
}
