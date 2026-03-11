import { GridManager } from '../classes/GridManager.js';
import { PathManager } from '../classes/PathManager.js';

export class MainScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainScene' });
    }

    create() {
        // Sample Level Data
        this.levelData = {
            level: 1,
            size: 5,
            dots: [
                { color: 0xFF0000, positions: [[0, 0], [4, 4]] },
                { color: 0x00FF00, positions: [[0, 4], [4, 0]] },
                { color: 0x0000FF, positions: [[1, 1], [3, 3]] },
                { color: 0xFFFF00, positions: [[1, 3], [3, 1]] },
                { color: 0xFF00FF, positions: [[2, 0], [2, 4]] }
            ]
        };

        this.gridSize = 400;
        this.gridManager = new GridManager(this, this.levelData.size, this.gridSize);
        this.pathManager = new PathManager(this, this.gridManager);
        this.moves = 0;

        this.initDots();
        this.gridManager.draw();

        this.input.on('pointerdown', (pointer) => {
            const cell = this.gridManager.getCellByWorldPos(pointer.x, pointer.y);
            if (cell) {
                this.pathManager.startPath(cell);
            }
        });

        this.input.on('pointermove', (pointer) => {
            if (pointer.isDown) {
                const cell = this.gridManager.getCellByWorldPos(pointer.x, pointer.y);
                if (cell) {
                    this.pathManager.extendPath(cell);
                    this.updateHUD();
                }
            }
        });

        this.input.on('pointerup', () => {
            this.pathManager.endPath();
        });

        this.events.on('path-started', () => {
            this.moves++;
            this.updateHUD();
        }, this);

        this.events.on('path-completed', this.checkWinCondition, this);

        this.createUI();
    }

    initDots() {
        this.levelData.dots.forEach(dot => {
            dot.positions.forEach(pos => {
                const cell = this.gridManager.cells[pos[1]][pos[0]];
                cell.dotColor = dot.color;
                
                // Draw dot
                this.add.circle(cell.worldX, cell.worldY, cell.size * 0.35, dot.color);
            });
        });
    }

    update() {
        this.pathManager.draw();
    }

    createUI() {
        const { width, height } = this.cameras.main;
        
        // HUD
        this.add.text(width / 2, 50, `Level ${this.levelData.level}`, {
            fontSize: '32px',
            fill: '#FFF'
        }).setOrigin(0.5);

        this.movesText = this.add.text(width / 2 - 80, 100, 'Moves: 0', {
            fontSize: '24px',
            fill: '#FFF'
        }).setOrigin(0.5);

        this.flowText = this.add.text(width / 2 + 80, 100, 'Flow: 0%', {
            fontSize: '24px',
            fill: '#FFF'
        }).setOrigin(0.5);

        // Reset Button
        const resetBtn = this.add.text(width / 2, height - 80, 'RESET', {
            fontSize: '28px',
            backgroundColor: '#444',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5).setInteractive();

        resetBtn.on('pointerdown', () => {
            this.pathManager.reset();
            this.moves = 0;
            this.updateHUD();
        });
    }

    updateHUD() {
        if (this.movesText) this.movesText.setText(`Moves: ${this.moves}`);
        if (this.flowText) {
            const percentage = this.gridManager.getFillPercentage();
            this.flowText.setText(`Flow: ${percentage}%`);
        }
    }

    checkWinCondition() {
        const allDotsConnected = this.levelData.dots.every(dot => {
            const path = this.pathManager.paths.get(dot.color);
            if (!path || path.length < 2) return false;
            
            const startPos = dot.positions[0];
            const endPos = dot.positions[1];
            
            const startCell = this.gridManager.cells[startPos[1]][startPos[0]];
            const endCell = this.gridManager.cells[endPos[1]][endPos[0]];
            
            return (path[0] === startCell && path[path.length - 1] === endCell) ||
                   (path[0] === endCell && path[path.length - 1] === startCell);
        });

        const allFilled = this.gridManager.isAllFilled();

        if (allDotsConnected && allFilled) {
            this.showWinMessage();
        }
    }

    showWinMessage() {
        const { width, height } = this.cameras.main;
        const overlay = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.7);
        this.add.text(width / 2, height / 2, 'PERFECT!\nLEVEL COMPLETE', {
            fontSize: '48px',
            fill: '#FFF',
            align: 'center',
            fontStyle: 'bold'
        }).setOrigin(0.5);
    }
}
