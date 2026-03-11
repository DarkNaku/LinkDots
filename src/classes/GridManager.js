import { Cell } from './Cell.js';

export class GridManager {
    constructor(scene, size, gridSize) {
        this.scene = scene;
        this.size = size;
        this.gridSize = gridSize;
        this.cells = [];
        this.cellSize = gridSize / size;
        this.offsetX = (scene.cameras.main.width - gridSize) / 2;
        this.offsetY = (scene.cameras.main.height - gridSize) / 2;
        
        this.graphics = scene.add.graphics();
        this.init();
    }

    init() {
        for (let y = 0; y < this.size; y++) {
            this.cells[y] = [];
            for (let x = 0; x < this.size; x++) {
                const worldX = this.offsetX + x * this.cellSize + this.cellSize / 2;
                const worldY = this.offsetY + y * this.cellSize + this.cellSize / 2;
                this.cells[y][x] = new Cell(x, y, worldX, worldY, this.cellSize);
            }
        }
    }

    draw() {
        this.graphics.clear();

        // 1. Draw Cell Backgrounds (Glow effect)
        for (let y = 0; y < this.size; y++) {
            for (let x = 0; x < this.size; x++) {
                const cell = this.cells[y][x];
                if (cell.pathColor) {
                    const bx = this.offsetX + x * this.cellSize;
                    const by = this.offsetY + y * this.cellSize;
                    this.graphics.fillStyle(cell.pathColor, 0.2);
                    this.graphics.fillRect(bx, by, this.cellSize, this.cellSize);
                }
            }
        }

        // 2. Draw Grid Lines
        this.graphics.lineStyle(2, 0x333333, 0.5);
        for (let y = 0; y <= this.size; y++) {
            const py = this.offsetY + y * this.cellSize;
            this.graphics.moveTo(this.offsetX, py);
            this.graphics.lineTo(this.offsetX + this.gridSize, py);
        }
        
        for (let x = 0; x <= this.size; x++) {
            const px = this.offsetX + x * this.cellSize;
            this.graphics.moveTo(px, this.offsetY);
            this.graphics.lineTo(px, this.offsetY + this.gridSize);
        }
        
        this.graphics.strokePath();
    }

    getCellByWorldPos(worldX, worldY) {
        const x = Math.floor((worldX - this.offsetX) / this.cellSize);
        const y = Math.floor((worldY - this.offsetY) / this.cellSize);
        
        if (x >= 0 && x < this.size && y >= 0 && y < this.size) {
            return this.cells[y][x];
        }
        return null;
    }

    isAllFilled() {
        for (let y = 0; y < this.size; y++) {
            for (let x = 0; x < this.size; x++) {
                if (!this.cells[y][x].isOccupied) {
                    return false;
                }
            }
        }
        return true;
    }

    getFillPercentage() {
        let occupied = 0;
        const total = this.size * this.size;
        for (let y = 0; y < this.size; y++) {
            for (let x = 0; x < this.size; x++) {
                if (this.cells[y][x].isOccupied) {
                    occupied++;
                }
            }
        }
        return Math.floor((occupied / total) * 100);
    }

    resetOccupancy() {
        for (let y = 0; y < this.size; y++) {
            for (let x = 0; x < this.size; x++) {
                this.cells[y][x].pathColor = null;
                this.cells[y][x].isOccupied = false;
            }
        }
    }
}
