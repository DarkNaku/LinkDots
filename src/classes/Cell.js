export class Cell {
    constructor(x, y, worldX, worldY, size) {
        this.x = x;
        this.y = y;
        this.worldX = worldX;
        this.worldY = worldY;
        this.size = size;
        this.dotColor = null;
        this.pathColor = null;
        this.isOccupied = false;
        this.isStartDot = false;
        this.isEndDot = false;
    }
}
