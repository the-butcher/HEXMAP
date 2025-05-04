import { PbfCoordinate } from "./PbfCoordinate";

export class PbfBoundary {

    private readonly byteCount: number;
    private readonly coordinates: PbfCoordinate[];
    private readonly directions: number[];

    constructor(byteCount: number, coordinates: PbfCoordinate[], directions: number[]) {
        this.byteCount = byteCount;
        this.coordinates = coordinates;
        this.directions = directions;
    }

    getCoordinates(): PbfCoordinate[] {
        return this.coordinates;
    }

    getDirections(): number[] {
        return this.directions;
    }

}