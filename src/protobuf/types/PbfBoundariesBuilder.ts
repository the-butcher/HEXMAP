import { ITypeBuilder } from '../base/decode/ITypeBuilder';
import { PbfBoundaries } from './PbfBoundaries';
import { PbfBoundary } from './PbfBoundary';

export class PbfBoundariesBuilder implements ITypeBuilder<PbfBoundaries, PbfBoundariesBuilder> {

    private byteCount: number;
    private readonly boundaries: PbfBoundary[];

    constructor() {
        this.byteCount = -1;
        this.boundaries = [];
    }

    setByteCount(byteCount: number): PbfBoundariesBuilder {
        this.byteCount = byteCount;
        return this;
    }

    addBoundary(boundary: PbfBoundary): PbfBoundariesBuilder {
        this.boundaries.push(boundary);
        return this;
    }

    build(): PbfBoundaries {
        return new PbfBoundaries(this.byteCount, this.boundaries);
    }

}