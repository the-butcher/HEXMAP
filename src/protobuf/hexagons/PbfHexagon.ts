
export class PbfHexagon {

    private readonly byteCount: number;
    private readonly codes: number[];
    private readonly coordinates: number[];

    constructor(byteCount: number, codes: number[], coordinates: number[]) {
        this.byteCount = byteCount;
        this.codes = codes;
        this.coordinates = coordinates;
    }

    getCodes(): number[] {
        return this.codes;
    }

    getCoordinates(): number[] {
        return this.coordinates;
    }    

}