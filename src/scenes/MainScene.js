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

        this.gridSize = 400;
        this.gridManager = new GridManager(this, this.levelData.size, this.gridSize);
        this.pathManager = new PathManager(this, this.gridManager);
        this.uiManager = new UIManager(this);
        this.moves = 0;

        this.initDots();
        this.gridManager.draw();
        
        // UI Initialized
        this.uiManager.createHUD(this.packData.name, this.levelData.id, this.moves, 0);
        this.uiManager.createButton(this.cameras.main.width / 2, this.cameras.main.height - 80, 'RESET', () => {
            this.pathManager.reset();
            this.moves = 0;
            this.updateHUD();
        });

        this.setupInputs();
        this.setupEvents();
    }

    setupInputs() {
        this.input.on('pointerdown', (pointer) => {
            if (this.isLevelComplete) return;
            const cell = this.gridManager.getCellByWorldPos(pointer.x, pointer.y);
            if (cell) this.pathManager.startPath(cell);
        });

        this.input.on('pointermove', (pointer) => {
            if (this.isLevelComplete) return;
            if (pointer.isDown) {
                const cell = this.gridManager.getCellByWorldPos(pointer.x, pointer.y);
                if (cell) {
                    this.pathManager.extendPath(cell);
                    this.updateHUD();
                }
            }
        });

        this.input.on('pointerup', () => this.pathManager.endPath());
    }

    setupEvents() {
        this.events.on('path-started', () => {
            this.moves++;
            this.updateHUD();
        }, this);
        this.events.on('path-completed', this.checkWinCondition, this);
    }

    initDots() {
        this.levelData.dots.forEach(dot => {
            dot.positions.forEach(pos => {
                const cell = this.gridManager.cells[pos[1]][pos[0]];
                cell.dotColor = dot.color;
                
                const dotObj = this.add.circle(cell.worldX, cell.worldY, cell.size * 0.35, dot.color);
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
        this.uiManager.updateHUD(this.moves, this.gridManager.getFillPercentage());
    }

    checkWinCondition() {
        const allDotsConnected = this.levelData.dots.every(dot => {
            const path = this.pathManager.paths.get(dot.color);
            if (!path || path.length < 2) return false;
            const startCell = this.gridManager.cells[dot.positions[0][1]][dot.positions[0][0]];
            const endCell = this.gridManager.cells[dot.positions[1][1]][dot.positions[1][0]];
            return (path[0] === startCell && path[path.length - 1] === endCell) ||
                   (path[0] === endCell && path[path.length - 1] === startCell);
        });

        if (allDotsConnected && this.gridManager.isAllFilled()) {
            this.isLevelComplete = true;
            this.showWinMessage();
        }
    }

    showWinMessage() {
        Logger.gameEvent('level.win', { moves: this.moves, flow: 100 });
        const isLastLevel = (this.levelIndex + 1 >= this.packData.levels.length);
        this.uiManager.showWinOverlay(isLastLevel, () => {
            this.scene.restart({ packIndex: this.packIndex, levelIndex: this.levelIndex + 1 });
        });
    }
}
