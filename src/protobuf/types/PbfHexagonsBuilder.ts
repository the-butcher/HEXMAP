import { ITypeBuilder } from '../base/decode/ITypeBuilder';
import { PbfHexagon } from './PbfHexagon';
import { PbfHexagons } from './PbfHexagons';

export class PbfHexagonsBuilder implements ITypeBuilder<PbfHexagons, PbfHexagonsBuilder> {

    private byteCount: number;
    private valueTypes: number[];
    private hexagons: PbfHexagon[];

    constructor() {
        this.byteCount = -1;
        this.hexagons = [];
    }

    setByteCount(byteCount: number): PbfHexagonsBuilder {
        this.byteCount = byteCount;
        return this;
    }

    setValueTypes(valueTypes: number[]): PbfHexagonsBuilder {
        this.valueTypes = valueTypes;
        return this;
    }

    addHexagon(hexagon: PbfHexagon): PbfHexagonsBuilder {
        this.hexagons.push(hexagon);
        return this;
    }

    build(): PbfHexagons {
        return new PbfHexagons(this.byteCount, this.valueTypes, this.hexagons);
    }

}