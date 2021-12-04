import { ITypeBuilder } from '../base/decode/ITypeBuilder';
import { PbfCoordinate } from './PbfCoordinate';

export class PbfCoordinateBuilder implements ITypeBuilder<PbfCoordinate, PbfCoordinateBuilder> {

    private byteCount: number;
    private x: number;
    private y: number;

    constructor() {
        this.byteCount = -1;
        this.x = Number.NaN;
        this.y = Number.NaN;
    }

    setByteCount(byteCount: number): PbfCoordinateBuilder {
        this.byteCount = byteCount;
        return this;
    }

    setX(x: number): PbfCoordinateBuilder {
        this.x = x;
        return this;
    }

    setY(y: number): PbfCoordinateBuilder { 
        this.y = y;
        return this;
    }    

    build(): PbfCoordinate {
        return new PbfCoordinate(this.byteCount, this.x, this.y);
    }

}