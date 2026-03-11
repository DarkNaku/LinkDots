import { GridManager } from '../classes/GridManager.js';
import { PathManager } from '../classes/PathManager.js';
import { UIManager } from '../classes/UIManager.js';
import { Logger } from '../classes/Logger.js';

export class MainScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainScene' });
    }

    init(data) {
        this.packIndex = data.packIndex || 0;
        this.levelIndex = data.levelIndex || 0;
        Logger.gameEvent('level.start', { pack: this.packIndex, level: this.levelIndex });
    }

    preload() {
        if (!this.cache.json.has('levels')) {
            this.load.json('levels', 'assets/levels/levels.json');
        }
    }

    create() {
        const levelsData = this.cache.json.get('levels');
        this.packData = levelsData.packs[this.packIndex];
        this.levelData = this.packData.levels[this.levelIndex];

        if (!this.levelData) return;

        const { width, height } = this.cameras.main;
        
        // 1. Initialize Managers
        this.gridSize = Math.min(width * 0.85, 600); 
        this.gridManager = new GridManager(this, this.levelData.size, this.gridSize);
        this.pathManager = new PathManager(this, this.gridManager);
        this.pathManager.graphics.setDepth(5);
        this.uiManager = new UIManager(this);
        
        // Touch Highlight Circle
        this.touchHighlight = this.add.circle(0, 0, this.gridManager.cellSize * 0.4, 0xffffff, 0.35);
        this.touchHighlight.setVisible(false);
        this.touchHighlight.setDepth(15);
        
        this.moves = 0;
        this.lastMovedColor = null;
        this.isLevelComplete = false;

        // 2. Setup UI
        this.uiManager.createGameHeader(this.levelData.id, this.levelData.size, () => {
            this.scene.start('LevelSelectScene', { packIndex: this.packIndex });
        }, () => {
            console.log('Settings clicked');
        });

        // Calculate Stats Bar Y (above grid)
        const statsY = this.gridManager.offsetY - 40;
        this.uiManager.createStatsBar(statsY);

        this.uiManager.createGameControls({
            undo: () => console.log('Undo'),
            hint: () => console.log('Hint'),
            reset: () => {
                this.pathManager.reset();
                this.moves = 0;
                this.lastMovedColor = null;
                this.updateHUD();
                this.gridManager.draw();
            }
        });

        // 3. Initialize Game Board
        this.initDots();
        this.gridManager.draw();
        this.updateHUD();

        this.setupInputs();
        this.setupEvents();

        this.cameras.main.fadeIn(500, 0, 0, 0);
    }

    setupInputs() {
        this.input.on('pointerdown', (pointer) => {
            if (this.isLevelComplete) return;
            const cell = this.gridManager.getCellByWorldPos(pointer.x, pointer.y);
            if (cell) {
                this.pathManager.startPath(cell);
                this.updateHUD();
                this.gridManager.draw();

                if (this.pathManager.currentColor) {
                    this.touchHighlight.setFillStyle(this.pathManager.currentColor, 0.35);
                    this.touchHighlight.setPosition(pointer.x, pointer.y);
                    this.touchHighlight.setVisible(true);
                }
            }
        });

        this.input.on('pointermove', (pointer) => {
            if (this.isLevelComplete) return;
            if (pointer.isDown) {
                const cell = this.gridManager.getCellByWorldPos(pointer.x, pointer.y);
                if (cell) {
                    this.pathManager.extendPath(cell);
                    this.updateHUD();
                    this.gridManager.draw();
                }
                if (this.touchHighlight.visible) {
                    this.touchHighlight.setPosition(pointer.x, pointer.y);
                }
            }
        });

        this.input.on('pointerup', () => {
            this.pathManager.endPath();
            this.updateHUD();
            this.gridManager.draw();
            this.touchHighlight.setVisible(false);
        });
    }

    setupEvents() {
        this.events.on('path-extended-first', (color) => {
            if (this.lastMovedColor !== color) {
                this.moves++;
                this.lastMovedColor = color;
                this.updateHUD();
            }
        }, this);
        this.events.on('path-completed', this.checkWinCondition, this);
    }

    initDots() {
        this.levelData.dots.forEach(dot => {
            dot.positions.forEach(pos => {
                const cell = this.gridManager.cells[pos[1]][pos[0]];
                cell.dotColor = dot.color;
                
                const dotObj = this.add.circle(cell.worldX, cell.worldY, cell.size * 0.35, dot.color).setDepth(10);
                this.tweens.add({
                    targets: dotObj,
                    scale: 1.1,
                    duration: 1000,
                    yoyo: true,
                    repeat: -1,
                    ease: 'Sine.easeInOut'
                });
            });
        });
    }

    update() {
        this.pathManager.draw();
    }

    updateHUD() {
        const connectedCount = this.levelData.dots.filter(dot => {
            const path = this.pathManager.paths.get(dot.color);
            if (!path || path.length < 2) return false;
            const startCell = this.gridManager.cells[dot.positions[0][1]][dot.positions[0][0]];
            const endCell = this.gridManager.cells[dot.positions[1][1]][dot.positions[1][0]];
            return (path[0] === startCell && path[path.length - 1] === endCell) ||
                   (path[0] === endCell && path[path.length - 1] === startCell);
        }).length;

        this.uiManager.updateStats(
            connectedCount, 
            this.levelData.dots.length, 
            this.moves, 
            null, 
            this.gridManager.getFillPercentage()
        );
    }

    checkWinCondition() {
        const connectedCount = this.levelData.dots.filter(dot => {
            const path = this.pathManager.paths.get(dot.color);
            if (!path || path.length < 2) return false;
            const startCell = this.gridManager.cells[dot.positions[0][1]][dot.positions[0][0]];
            const endCell = this.gridManager.cells[dot.positions[1][1]][dot.positions[1][0]];
            return (path[0] === startCell && path[path.length - 1] === endCell) ||
                   (path[0] === endCell && path[path.length - 1] === startCell);
        }).length;

        if (connectedCount === this.levelData.dots.length && this.gridManager.isAllFilled()) {
            this.isLevelComplete = true;
            this.showWinMessage();
        }
    }

    showWinMessage() {
        Logger.gameEvent('level.win', { moves: this.moves, flow: 100 });
        const isLastLevel = (this.levelIndex + 1 >= this.packData.levels.length);
        this.uiManager.showWinOverlay(
            isLastLevel, 
            () => {
                this.scene.restart({ packIndex: this.packIndex, levelIndex: this.levelIndex + 1 });
            },
            () => {
                this.scene.start('LevelSelectScene', { packIndex: this.packIndex });
            }
        );
    }
}
