
export class PbfHexagon {

    private readonly byteCount: number;
    private readonly values: number[];

    constructor(byteCount: number, values: number[]) {
        this.byteCount = byteCount;
        this.values = values;
    }

    getValues(): number[] {
        return this.values;
    }    

}