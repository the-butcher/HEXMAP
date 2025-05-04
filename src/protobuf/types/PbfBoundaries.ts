import { PbfBoundary } from "./PbfBoundary";
import { PbfCoordinate } from "./PbfCoordinate";

export class PbfBoundaries {

    private readonly byteCount: number;
    private readonly boundaries: PbfBoundary[];

    constructor(byteCount: number, boundaries: PbfBoundary[]) {
        this.byteCount = byteCount;
        this.boundaries = boundaries;
    }

    getBoundaries(): PbfBoundary[] {
        return this.boundaries;
    }

}