import { PbfHexagon } from './PbfHexagon';

export class PbfHexagons {

    readonly byteCount: number;
    readonly valueTypes: number[];
    readonly hexagons: PbfHexagon[];

    constructor(byteCount: number, valueTypes: number[], hexagons: PbfHexagon[]) {
        this.byteCount = byteCount;
        this.valueTypes = valueTypes;
        this.hexagons = hexagons;
    }

    getValueTypes(): number[] {
        return this.valueTypes;
    }

    getHexagons(): PbfHexagon[] {
        return this.hexagons;
    }

}