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
    private readonly borderHexagons: { [K in string]: IHexagon[] };
    private readonly pathLengthHistory: number[];

    private hexagonIndicesN: number[];

    constructor() {
        this.hexagons = [];
        this.borderHexagons = {};
        this.pathLengthHistory = [];
    }

    getHexagons(): IHexagon[] {
        return this.hexagons;
    }

    getHexagon(i: number): IHexagon {
        return this.hexagons[i];
    }

    hasPath(path: string, hexagonBorder?: IHexagonBorders) {
        return hexagonBorder ? hexagonBorder.path === path : false;
    }

    calculateBorders(props: IHexagonsProps): void {

        console.debug('⚙ calculating borders');

        const joinableHexagons = this.hexagons;

        // sort all hexagons by column and row
        let minCol = Number.MAX_SAFE_INTEGER;
        let maxCol = Number.MIN_SAFE_INTEGER;
        let joinableHexagonsByColAndRow: { [K in string]: { [K in string]: IHexagonBorders } } = {};
        joinableHexagons.forEach(v => {
            if (!joinableHexagonsByColAndRow[v.col]) {
                joinableHexagonsByColAndRow[v.col] = {};
            }
            joinableHexagonsByColAndRow[v.col][v.row] = {
                i: v.sortkeyN,
                path: props.getPath(v)
            }
            minCol = Math.min(minCol, v.col);
            maxCol = Math.max(maxCol, v.col);
        });

        // all column keys
        const cols: string[] = Object.keys(joinableHexagonsByColAndRow);
        let rows: string[];
        let joinableCol: { [K in string]: IHexagonBorders };
        let joinableBorder: IHexagonBorders;
        let joinableHexagon: IHexagon;
        let joinablePath: string;

        for (let c = 0; c < cols.length; c++) {

            joinableCol = joinableHexagonsByColAndRow[cols[c]];

            rows = Object.keys(joinableCol);
            for (let r = 0; r < rows.length; r++) {

                joinableBorder = joinableCol[rows[r]];
                joinableHexagon = this.hexagons[joinableBorder.i];
                joinablePath = joinableBorder.path;

                // // south
                joinableBorder.b090 = !this.hasPath(joinablePath, joinableHexagonsByColAndRow[joinableHexagon.col]?.[joinableHexagon.row - 1]) || !this.hasPath(joinablePath, joinableHexagonsByColAndRow[joinableHexagon.col]?.[joinableHexagon.row - 2]);

                // // north
                joinableBorder.b270 = !this.hasPath(joinablePath, joinableHexagonsByColAndRow[joinableHexagon.col]?.[joinableHexagon.row + 1]) || !this.hasPath(joinablePath, joinableHexagonsByColAndRow[joinableHexagon.col]?.[joinableHexagon.row + 2]);

                if (joinableHexagon.col % 2 === 0) {
                    joinableBorder.b030 = !this.hasPath(joinablePath, joinableHexagonsByColAndRow[joinableHexagon.col + 1]?.[joinableHexagon.row + 1]) || !this.hasPath(joinablePath, joinableHexagonsByColAndRow[joinableHexagon.col + 2]?.[joinableHexagon.row + 1]);
                    joinableBorder.b150 = !this.hasPath(joinablePath, joinableHexagonsByColAndRow[joinableHexagon.col - 1]?.[joinableHexagon.row + 1]) || !this.hasPath(joinablePath, joinableHexagonsByColAndRow[joinableHexagon.col - 2]?.[joinableHexagon.row + 1]);
                    joinableBorder.b210 = !this.hasPath(joinablePath, joinableHexagonsByColAndRow[joinableHexagon.col - 1]?.[joinableHexagon.row]) || !this.hasPath(joinablePath, joinableHexagonsByColAndRow[joinableHexagon.col - 2]?.[joinableHexagon.row - 1]);
                    joinableBorder.b330 = !this.hasPath(joinablePath, joinableHexagonsByColAndRow[joinableHexagon.col + 1]?.[joinableHexagon.row]) || !this.hasPath(joinablePath, joinableHexagonsByColAndRow[joinableHexagon.col + 2]?.[joinableHexagon.row - 1]);
                } else {
                    joinableBorder.b030 = !this.hasPath(joinablePath, joinableHexagonsByColAndRow[joinableHexagon.col + 1]?.[joinableHexagon.row]) || !this.hasPath(joinablePath, joinableHexagonsByColAndRow[joinableHexagon.col + 2]?.[joinableHexagon.row + 1]);
                    joinableBorder.b150 = !this.hasPath(joinablePath, joinableHexagonsByColAndRow[joinableHexagon.col - 1]?.[joinableHexagon.row]) || !this.hasPath(joinablePath, joinableHexagonsByColAndRow[joinableHexagon.col - 2]?.[joinableHexagon.row + 1]);
                    joinableBorder.b210 = !this.hasPath(joinablePath, joinableHexagonsByColAndRow[joinableHexagon.col - 1]?.[joinableHexagon.row - 1]) || !this.hasPath(joinablePath, joinableHexagonsByColAndRow[joinableHexagon.col - 2]?.[joinableHexagon.row - 1]);
                    joinableBorder.b330 = !this.hasPath(joinablePath, joinableHexagonsByColAndRow[joinableHexagon.col + 1]?.[joinableHexagon.row - 1]) || !this.hasPath(joinablePath, joinableHexagonsByColAndRow[joinableHexagon.col + 2]?.[joinableHexagon.row - 1]);
                }

                const isBorderHexagon = [joinableBorder.b030, joinableBorder.b090, joinableBorder.b150, joinableBorder.b210, joinableBorder.b270, joinableBorder.b330].find(v => v);
                if (isBorderHexagon) {
                    if (!this.borderHexagons[joinablePath]) {
                        this.borderHexagons[joinablePath] = [];
                    }
                    this.borderHexagons[joinablePath].push(joinableHexagon);
                }

            }

        }

    }

    async getBorder(path: string, props: IHexagonsProps): Promise<IHexagon[]> {

        // console.debug('⚙ get border', path);

        if (this.hexagons.length === 0) {
            return [];
        }

        if (this.pathLengthHistory.indexOf(path.length) < 0) {
            this.calculateBorders(props);
            this.pathLengthHistory.push(path.length);
        }
        const pathTrimmed = path.replaceAll('#', '');

        return this.borderHexagons[pathTrimmed] ? this.borderHexagons[pathTrimmed] : [];

    }

    getLegendFraction(values: IHexagon): number {
        // 164 - 180
        const fraction = ((values.x - SpatialUtil.HEXAGON_ORIGIN_X) / SpatialUtil.HEXAGON_SPACING_Y - 164) / 180;
        return fraction;
    }

    async load(): Promise<void> {

        let hexagon: IHexagon;
        const pbfHexagons = await new PbfHexagonsLoader().load('./hexagons.pbf');

        // console.log('hexagons loaded ...');

        let values: number[];
        let yOffset: number;
        let counter = 0;

        pbfHexagons.getHexagons().forEach(pbfHexagon => {

            // color = ColorUtil.getCorineColor(values[valueIndexCode]);
            values = pbfHexagon.getValues();
            yOffset = values[HexagonRepository.VALUE_INDEX___X] % 2 === 0 ? 0 : SpatialUtil.HEXAGON_SPACING_X / 2;
            yOffset += values[HexagonRepository.VALUE_INDEX_LUC] == 1 ? SpatialUtil.HEXAGON_SPACING_X * 17 : 0;

            /**
             * intial values
             */
            hexagon = {
                sortkeyN: -1,
                sortkeyS: -1,
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
            this.hexagons.push(hexagon);
            hexagon.y = hexagon.ele; // props.renderer.getHeight(hexagonValue);

        });

        // console.log('hexagons built ...');

        this.hexagons.sort((a, b) => a.z - b.z);
        counter = 0;
        this.hexagons.forEach(hexagonValue => {
            hexagonValue.sortkeyS = counter++;
        });

        // console.log('hexagons sorted 1 ...');

        this.hexagons.sort((a, b) => b.z - a.z);
        counter = 0;
        this.hexagons.forEach(hexagonValue => {
            hexagonValue.sortkeyN = counter++;
        });

        // console.log('hexagons sorted 2 ...');

        return;

    }

}