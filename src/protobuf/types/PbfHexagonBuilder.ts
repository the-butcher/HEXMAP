import { ITypeBuilder } from '../base/decode/ITypeBuilder';
import { PbfHexagon } from './PbfHexagon';

export class PbfHexagonBuilder implements ITypeBuilder<PbfHexagon, PbfHexagonBuilder> {

    private byteCount: number;
    private values: number[];

    constructor() {
        this.byteCount = -1;
        this.values = [];
    }

    setByteCount(byteCount: number): PbfHexagonBuilder {
        this.byteCount = byteCount;
        return this;
    }

    setValues(values: number[]): PbfHexagonBuilder {
        this.values = values;
        return this;
    }

    build(): PbfHexagon {
        return new PbfHexagon(this.byteCount, this.values);
    }

}