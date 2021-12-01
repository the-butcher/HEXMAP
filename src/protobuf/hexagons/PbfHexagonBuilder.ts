import { ITypeBuilder } from '../base/decode/ITypeBuilder';
import { PbfHexagon } from './PbfHexagon';

export class PbfHexagonBuilder implements ITypeBuilder<PbfHexagon, PbfHexagonBuilder> {

    private byteCount: number;
    private codes: number[];
    private coordinates: number[];

    constructor() {
        this.byteCount = -1;
        this.codes = [];
        this.coordinates = [];
    }

    setByteCount(byteCount: number): PbfHexagonBuilder {
        this.byteCount = byteCount;
        return this;
    }

    setCodes(codes: number[]): PbfHexagonBuilder {
        this.codes = codes;
        return this;
    }

    setCoordinates(coordinates: number[]): PbfHexagonBuilder {
        this.coordinates = coordinates;
        return this;
    }

    build(): PbfHexagon {
        return new PbfHexagon(this.byteCount, this.codes, this.coordinates);
    }

}