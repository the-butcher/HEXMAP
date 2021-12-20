import { IHierarchyEvents } from "@amcharts/amcharts5/.internal/charts/hierarchy/Hierarchy";
import { IHexagon } from "../components/IHexagon";
import { IHexagonBorders } from "../components/IHexagonBorders";
import { IHexagonsProps } from "../components/IHexagonsProps";
import { PbfHexagonsLoader } from "../protobuf/PbfHexagonsLoader";
import { SpatialUtil } from "../util/SpatialUtil";

export class HexagonRepository {

    static readonly VALUE_INDEX_GKZ = 0;
    static readonly VALUE_INDEX_LUC = 1;
    static readonly VALUE_INDEX___X = 2;
    static readonly VALUE_INDEX___Y = 3;
    static readonly VALUE_INDEX___Z = 4;


    static getInstance(): HexagonRepository {
        if (!this.instance) {
            this.instance = new HexagonRepository();
        }
        return this.instance;
    }

    private static instance: HexagonRepository;

    private readonly hexagons: IHexagon[];
    private readonly hexagonBorders: { [K in string]: IHexagonBorders[] };

    constructor() {
        this.hexagons = [];
        this.hexagonBorders = {};
    }

    getHexagons(): IHexagon[] {
        return this.hexagons;
    }

    // getHexagon(i: number): IHexagon {
    //     return this.hexagons[i];
    // }

    getBorder(i: number, props: IHexagonsProps): IHexagon[] {

        const hexagonValue = this.hexagons[i];
        const key = props.getKey(hexagonValue);
        // console.log('key', key);

        const borderHexagons: IHexagon[] = [];

        const joinableValues = this.hexagons.filter(v => props.getKey(v) === key);

        // collect by column and find min/max col
        let minCol = Number.MAX_SAFE_INTEGER;
        let maxCol = Number.MIN_SAFE_INTEGER;
        let joinableValuesByColAndRow: { [K in string]: { [K in string]: IHexagonBorders } } = {};
        joinableValues.forEach(v => {
            if (!joinableValuesByColAndRow[v.col]) {
                joinableValuesByColAndRow[v.col] = {};
            }
            joinableValuesByColAndRow[v.col][v.row] = {
                i: v.i
            }
            minCol = Math.min(minCol, v.col);
            maxCol = Math.max(maxCol, v.col);
        });

        // all column keys
        const cols: string[] = Object.keys(joinableValuesByColAndRow);
        let rows: string[];
        let joinableCol: { [K in string]: IHexagonBorders };
        let joinableBorder: IHexagonBorders;
        let joinableHexagon: IHexagon;

        for (let c = 0; c < cols.length; c++) {

            joinableCol = joinableValuesByColAndRow[cols[c]];

            rows = Object.keys(joinableCol);
            for (let r = 0; r < rows.length; r++) {

                joinableBorder = joinableCol[rows[r]];
                joinableHexagon = this.hexagons[joinableBorder.i];

                // south
                joinableBorder.b090 = joinableValuesByColAndRow[joinableHexagon.col][joinableHexagon.row - 1] === undefined;

                // north
                joinableBorder.b270 = joinableValuesByColAndRow[joinableHexagon.col][joinableHexagon.row + 1] === undefined;

                // southwest
                if (joinableValuesByColAndRow[joinableHexagon.col - 1] === undefined) {
                    joinableBorder.b150 = true;
                    joinableBorder.b210 = true;
                } else {
                    if (joinableHexagon.col % 2 === 0) {
                        joinableBorder.b150 = joinableValuesByColAndRow[joinableHexagon.col - 1][joinableHexagon.row + 1] === undefined;
                        joinableBorder.b210 = joinableValuesByColAndRow[joinableHexagon.col - 1][joinableHexagon.row] === undefined;
                    } else {
                        joinableBorder.b150 = joinableValuesByColAndRow[joinableHexagon.col - 1][joinableHexagon.row] === undefined;
                        joinableBorder.b210 = joinableValuesByColAndRow[joinableHexagon.col - 1][joinableHexagon.row - 1] === undefined;
                    }
                }

                if (joinableValuesByColAndRow[joinableHexagon.col + 1] === undefined) {
                    joinableBorder.b030 = true;
                    joinableBorder.b330 = true;
                } else {
                    if (joinableHexagon.col % 2 === 0) {
                        joinableBorder.b030 = joinableValuesByColAndRow[joinableHexagon.col + 1][joinableHexagon.row + 1] === undefined;
                        joinableBorder.b330 = joinableValuesByColAndRow[joinableHexagon.col + 1][joinableHexagon.row] === undefined;
                    } else {
                        joinableBorder.b030 = joinableValuesByColAndRow[joinableHexagon.col + 1][joinableHexagon.row] === undefined;
                        joinableBorder.b330 = joinableValuesByColAndRow[joinableHexagon.col + 1][joinableHexagon.row - 1] === undefined;
                    }
                }

                const isBorderHexagon = [joinableBorder.b030, joinableBorder.b090, joinableBorder.b150, joinableBorder.b210, joinableBorder.b270, joinableBorder.b330].find(v => v);
                if (isBorderHexagon) {
                    borderHexagons.push(joinableHexagon);
                }

            }

        }

        return borderHexagons;

    }

    async load(): Promise<void> {

        let hexagonValue: IHexagon;
        new PbfHexagonsLoader().load('./hexagons.pbf').then(pbfHexagons => {

            // console.log('loading hexagons');

            let values: number[];
            let yOffset: number;
            let color: number[];

            pbfHexagons.getHexagons().forEach(pbfHexagon => {

                // color = ColorUtil.getCorineColor(values[valueIndexCode]);
                values = pbfHexagon.getValues();
                yOffset = values[HexagonRepository.VALUE_INDEX___X] % 2 === 0 ? 0 : SpatialUtil.HEXAGON_SPACING_X / 2;

                /**
                 * intial values
                 */
                hexagonValue = {
                    i: -1,
                    x: values[HexagonRepository.VALUE_INDEX___X] * SpatialUtil.HEXAGON_SPACING_Y + SpatialUtil.HEXAGON_ORIGIN_X,
                    y: 0,
                    z: values[HexagonRepository.VALUE_INDEX___Y] * SpatialUtil.HEXAGON_SPACING_X - yOffset - SpatialUtil.HEXAGON_ORIGIN_Y,
                    r: 0,
                    g: 0,
                    b: 0,
                    col: values[HexagonRepository.VALUE_INDEX___X],
                    row: values[HexagonRepository.VALUE_INDEX___Y],
                    gkz: values[HexagonRepository.VALUE_INDEX_GKZ] >= 0 ? values[HexagonRepository.VALUE_INDEX_GKZ].toString() : undefined,
                    luc: values[HexagonRepository.VALUE_INDEX_LUC],
                    ele: SpatialUtil.toZ(values[HexagonRepository.VALUE_INDEX___Z] / SpatialUtil.SCALE_PRECISION)
                };
                this.hexagons.push(hexagonValue);
                hexagonValue.y = hexagonValue.ele; // props.renderer.getHeight(hexagonValue);

            });

            this.hexagons.sort((a, b) => b.z - a.z);

            let counter = 0;
            this.hexagons.forEach(hexagonValue => {
                hexagonValue.i = counter++;
            });

        });

    }

}