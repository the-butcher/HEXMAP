import { ITypeBuilder } from '../base/decode/ITypeBuilder';
import { PbfBoundary } from './PbfBoundary';
import { PbfCoordinate } from './PbfCoordinate';

export class PbfBoundaryBuilder implements ITypeBuilder<PbfBoundary, PbfBoundaryBuilder> {

    private byteCount: number;
    private readonly coordinates: PbfCoordinate[];
    private directions: number[];

    constructor() {
        this.byteCount = -1;
        this.coordinates = [];
        this.directions = [];
    }

    setByteCount(byteCount: number): PbfBoundaryBuilder {
        this.byteCount = byteCount;
        return this;
    }

    addCoordinate(coordinate: PbfCoordinate): PbfBoundaryBuilder {
        this.coordinates.push(coordinate);
        return this;
    }

    setDirections(directions: number[]): PbfBoundaryBuilder {
        this.directions = directions;
        return this;
    }


    build(): PbfBoundary {
        return new PbfBoundary(this.byteCount, this.coordinates, this.directions);
    }

}