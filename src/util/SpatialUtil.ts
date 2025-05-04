export class SpatialUtil {

    static readonly SCALE_SCENE = 0.001;
    static readonly SCALE_PRECISION = 4;

    static readonly HEXAGON_ORIGIN_X = -310535.3734 * SpatialUtil.SCALE_SCENE;
    static readonly HEXAGON_ORIGIN_Y = 212166.0648 * SpatialUtil.SCALE_SCENE;

    static readonly BOUNDARY_ORIGIN_X = 12630 * SpatialUtil.SCALE_SCENE;
    static readonly BOUNDARY_ORIGIN_Y = 299630 * SpatialUtil.SCALE_SCENE;

    static readonly HEXAGON_SPACING_X = 759.8356857 * SpatialUtil.SCALE_SCENE;
    static readonly HEXAGON_SPACING_Y = Math.cos(Math.PI / 6) * SpatialUtil.HEXAGON_SPACING_X;

    static toZ(value: number): number {
        return value * SpatialUtil.SCALE_SCENE * 2; // <-- would have to be divided by 4 for real scale
    }

}

