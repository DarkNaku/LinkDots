import { Logger } from './Logger.js';

export class PathManager {
    constructor(scene, gridManager) {
        this.scene = scene;
        this.gridManager = gridManager;
        this.paths = new Map(); // color -> Array of Cells
        this.currentPath = null;
        this.currentColor = null;
        this.graphics = scene.add.graphics();
    }

    startPath(cell) {
        if (!cell.dotColor && !cell.pathColor) return;

        this.currentColor = cell.dotColor || cell.pathColor;
        Logger.gameEvent('path.start', { color: this.currentColor, x: cell.x, y: cell.y });
        
        // If it's a path color, we might be starting from a middle of a path
        // or re-starting a path.
        if (this.paths.has(this.currentColor)) {
            const existingPath = this.paths.get(this.currentColor);
            const index = existingPath.indexOf(cell);
            if (index !== -1) {
                // Backtrack to this point
                this.clearPathCells(existingPath.slice(index + 1));
                this.currentPath = existingPath.slice(0, index + 1);
            } else {
                // Completely restart or invalid start
                this.clearPath(this.currentColor);
                this.currentPath = [cell];
            }
        } else {
            this.currentPath = [cell];
        }
        
        this.paths.set(this.currentColor, this.currentPath);
        cell.pathColor = this.currentColor;
        cell.isOccupied = true;
        this.scene.events.emit('path-started');
    }

    extendPath(cell) {
        if (!this.currentPath || !this.currentColor) return;
        
        const lastCell = this.currentPath[this.currentPath.length - 1];
        if (cell === lastCell) return;

        // Check adjacency
        const dx = Math.abs(cell.x - lastCell.x);
        const dy = Math.abs(cell.y - lastCell.y);
        if (dx + dy !== 1) return;

        // If cell has another path, break it
        if (cell.pathColor && cell.pathColor !== this.currentColor) {
            this.clearPath(cell.pathColor);
        }

        // If cell is a dot of another color, skip
        if (cell.dotColor && cell.dotColor !== this.currentColor) return;

        // If cell is already in the current path, backtrack
        const existingIndex = this.currentPath.indexOf(cell);
        if (existingIndex !== -1) {
            this.clearPathCells(this.currentPath.slice(existingIndex + 1));
            this.currentPath = this.currentPath.slice(0, existingIndex + 1);
        } else {
            // New cell
            cell.pathColor = this.currentColor;
            cell.isOccupied = true;
            this.currentPath.push(cell);
        }

        this.paths.set(this.currentColor, this.currentPath);
        
        if (this.currentPath.length === 2) {
            this.scene.events.emit('path-extended-first', this.currentColor);
        }
        
        // If we reached the target dot, end the path
        if (cell.dotColor === this.currentColor && cell !== this.currentPath[0]) {
            this.endPath();
        }
    }

    endPath() {
        if (this.currentColor) {
            Logger.gameEvent('path.end', { color: this.currentColor, length: this.currentPath ? this.currentPath.length : 0 });
            
            // If the path is incomplete (less than 2 nodes), clear it
            if (this.currentPath && this.currentPath.length < 2) {
                this.clearPath(this.currentColor);
            }
        }
        this.currentPath = null;
        this.currentColor = null;
        this.scene.events.emit('path-completed');
    }

    clearPath(color) {
        if (this.paths.has(color)) {
            Logger.gameEvent('path.clear', { color: color });
            this.clearPathCells(this.paths.get(color));
            this.paths.delete(color);
        }
    }

    clearPathCells(cells) {
        cells.forEach(cell => {
            cell.pathColor = null;
            cell.isOccupied = false;
        });
    }

    draw() {
        this.graphics.clear();
        this.paths.forEach((cells, color) => {
            if (cells.length < 2) return;
            
            const thickness = cells[0].size * 0.45;
            const radius = thickness / 2;

            // 1. Draw joints (Circles) at every cell position
            this.graphics.fillStyle(color, 1);
            cells.forEach(cell => {
                this.graphics.fillCircle(cell.worldX, cell.worldY, radius);
            });

            // 2. Draw segments (Lines) between joints
            this.graphics.lineStyle(thickness, color, 1);
            this.graphics.beginPath();
            this.graphics.moveTo(cells[0].worldX, cells[0].worldY);
            
            for (let i = 1; i < cells.length; i++) {
                this.graphics.lineTo(cells[i].worldX, cells[i].worldY);
            }
            this.graphics.strokePath();
        });
    }

    reset() {
        this.paths.forEach((cells, color) => this.clearPathCells(cells));
        this.paths.clear();
        this.currentPath = null;
        this.currentColor = null;
        this.draw();
    }
}
