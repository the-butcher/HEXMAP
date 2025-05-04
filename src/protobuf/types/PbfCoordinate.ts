
export class PbfCoordinate {

    private readonly byteCount: number;
    private readonly x: number;
    private readonly y: number;

    constructor(byteCount: number, x: number, y: number) {
        this.byteCount = byteCount;
        this.x = x;
        this.y = y;
    }

    getX(): number {
        return this.x;
    }    

    getY(): number {
        return this.y;
    }

}