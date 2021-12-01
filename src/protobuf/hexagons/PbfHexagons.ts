import { PbfHexagon } from './PbfHexagon';

export class PbfHexagons {

    readonly byteCount: number;
    readonly hexagons: PbfHexagon[];

    constructor(byteCount: number, hexagons: PbfHexagon[]) {
        this.byteCount = byteCount;
        this.hexagons = hexagons;
    }

    getHexagons(): PbfHexagon[] {
        return this.hexagons;
    }

}