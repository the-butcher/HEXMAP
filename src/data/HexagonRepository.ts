import { IHexagon } from "../components/IHexagon";
import { IHexagonBorders } from "../components/IHexagonBorders";
import { PbfHexagonsLoader } from "../protobuf/PbfHexagonsLoader";
import { PbfHexagons } from "../protobuf/types/PbfHexagons";
import { ColorUtil } from "../util/ColorUtil";
import { SpatialUtil } from "../util/SpatialUtil";
import { IHexagonPath } from "./IHexagonPath";
import { Statistics } from "./Statistics";

export class HexagonRepository {

    static readonly VALUE_INDEX__XY = 0;
    static readonly VALUE_TYPE____Z = 0;
    static readonly VALUE_TYPE____L = 1;
    static readonly VALUE_TYPE____G = 2;


    static getInstance(): HexagonRepository {
        if (!this.instance) {
            this.instance = new HexagonRepository();
        }
        return this.instance;
    }

    private static instance: HexagonRepository;

    private hexagons: IHexagon[];
    private readonly borderHexagons: { [K in string]: IHexagon[] };
    private readonly pathLengthHistory: number[];
    private readonly elevationStats: { [K in string]: Statistics };

    constructor() {
        this.hexagons = [];
        this.borderHexagons = {};
        this.pathLengthHistory = [];
        this.elevationStats = {};
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

    async update(pbfHexagons: PbfHexagons): Promise<boolean> {

        const valueTypes: number[] = pbfHexagons.getValueTypes();

        const updateHexagons = await this.parse(pbfHexagons);
        let hexagonIndex = 0;
        if (valueTypes) {
            // Nothing
        }
        let zUpdate = false;
        updateHexagons.forEach(updateHexagon => {
            for (; hexagonIndex <= this.hexagons.length; hexagonIndex++) {
                if (this.hexagons[hexagonIndex].id === updateHexagon.id) {
                    for (let valueIndex = 0; valueIndex < valueTypes.length; valueIndex++) {
                        if (valueTypes[valueIndex] === HexagonRepository.VALUE_TYPE____Z) {
                            this.hexagons[hexagonIndex].y = updateHexagon.y;
                            zUpdate = true;
                        } else if (valueTypes[valueIndex] === HexagonRepository.VALUE_TYPE____L) {
                            this.hexagons[hexagonIndex].luc = updateHexagon.luc;
                        } else if (valueTypes[valueIndex] === HexagonRepository.VALUE_TYPE____G) {
                            this.hexagons[hexagonIndex].gkz = updateHexagon.gkz;
                        }
                    }
                    break;
                }
            }
        });

        return zUpdate;

    }

    async load(): Promise<void> {
        const pbfHexagons = await new PbfHexagonsLoader().fromUrl('./hexagons_inner.pbf');
        this.hexagons = await this.parse(pbfHexagons);
    }

    async parse(pbfHexagons: PbfHexagons): Promise<IHexagon[]> {

        let hexagon: IHexagon;

        let values: number[];
        let valueXY: number;
        let valueX: number;
        let valueY: number;
        let valueZ = 0;
        let valueL = 0xcccccc; // NODATA
        let valueG = '#####';
        let yOffset: number;
        let counter = 0;

        const hexagonArray: IHexagon[] = [];

        const valueTypes: number[] = pbfHexagons.getValueTypes();
        // console.log('valueTypes', valueTypes);

        pbfHexagons.getHexagons().forEach(pbfHexagon => {

            // color = ColorUtil.getCorineColor(values[valueIndexCode]);
            values = pbfHexagon.getValues();
            valueXY = values[HexagonRepository.VALUE_INDEX__XY];
            valueY = valueXY >> 12 & 0xFFF; // convention
            valueX = valueXY & 0xFFF; // convention
            if (valueTypes) {
                for (let valueIndex = 0; valueIndex < valueTypes.length; valueIndex++) {
                    if (valueTypes[valueIndex] === HexagonRepository.VALUE_TYPE____Z) {
                        valueZ = SpatialUtil.toZ(values[valueIndex + 1] / SpatialUtil.SCALE_PRECISION) - 4
                    } else if (valueTypes[valueIndex] === HexagonRepository.VALUE_TYPE____L) {
                        valueL = values[valueIndex + 1];
                    } else if (valueTypes[valueIndex] === HexagonRepository.VALUE_TYPE____G) {
                        valueG = values[valueIndex + 1].toString();
                    }
                }
            }

            yOffset = valueX % 2 === 0 ? 0 : SpatialUtil.HEXAGON_SPACING_X / 2;

            /**
             * intial values
             */
            hexagon = {
                id: valueXY,
                sortkeyN: -1,
                sortkeyS: -1,
                x: valueX * SpatialUtil.HEXAGON_SPACING_Y + SpatialUtil.HEXAGON_ORIGIN_X,
                y: 0,
                z: valueY * SpatialUtil.HEXAGON_SPACING_X - yOffset - SpatialUtil.HEXAGON_ORIGIN_Y,
                col: valueX,
                row: valueY,
                gkz: valueG, // values[HexagonRepository.VALUE_INDEX_GKZ] >= 0 ? values[HexagonRepository.VALUE_INDEX_GKZ].toString() : undefined,
                luc: valueL, // values[HexagonRepository.VALUE_INDEX_LUC],
                ele: valueZ
            };
            hexagonArray.push(hexagon);
            hexagon.y = hexagon.ele; // props.renderer.getHeight(hexagonValue);

        });

        hexagonArray.sort((a, b) => (ColorUtil.getInstance().getCorineOpacity(b.luc) - ColorUtil.getInstance().getCorineOpacity(a.luc)) * 1000 + b.z - a.z);
        counter = 0;
        hexagonArray.forEach(hexagonValue => {
            hexagonValue.sortkeyN = counter++;
        });

        return hexagonArray;

    }

    calculateBordersAndStats(props: IHexagonPath): void {

        console.debug('⚙ calculating borders');

        const joinableHexagons = this.hexagons;

        // sort all hexagons by column and row
        let minCol = Number.MAX_SAFE_INTEGER;
        let maxCol = Number.MIN_SAFE_INTEGER;
        const joinableHexagonsByColAndRow: { [K in string]: { [K in string]: IHexagonBorders } } = {};
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

                if (!this.elevationStats[joinablePath]) {
                    this.elevationStats[joinablePath] = new Statistics();
                }
                this.elevationStats[joinablePath].addValue(joinableHexagon.ele);

                // // south
                joinableBorder.b090 = !this.hasPath(joinablePath, joinableHexagonsByColAndRow[joinableHexagon.col]?.[joinableHexagon.row - 1]); // || !this.hasPath(joinablePath, joinableHexagonsByColAndRow[joinableHexagon.col]?.[joinableHexagon.row - 2]);

                // // north
                joinableBorder.b270 = !this.hasPath(joinablePath, joinableHexagonsByColAndRow[joinableHexagon.col]?.[joinableHexagon.row + 1]); // || !this.hasPath(joinablePath, joinableHexagonsByColAndRow[joinableHexagon.col]?.[joinableHexagon.row + 2]);

                if (joinableHexagon.col % 2 === 0) {
                    joinableBorder.b030 = !this.hasPath(joinablePath, joinableHexagonsByColAndRow[joinableHexagon.col + 1]?.[joinableHexagon.row + 1]); // || !this.hasPath(joinablePath, joinableHexagonsByColAndRow[joinableHexagon.col + 2]?.[joinableHexagon.row + 1]);
                    joinableBorder.b150 = !this.hasPath(joinablePath, joinableHexagonsByColAndRow[joinableHexagon.col - 1]?.[joinableHexagon.row + 1]); // || !this.hasPath(joinablePath, joinableHexagonsByColAndRow[joinableHexagon.col - 2]?.[joinableHexagon.row + 1]);
                    joinableBorder.b210 = !this.hasPath(joinablePath, joinableHexagonsByColAndRow[joinableHexagon.col - 1]?.[joinableHexagon.row]); // || !this.hasPath(joinablePath, joinableHexagonsByColAndRow[joinableHexagon.col - 2]?.[joinableHexagon.row - 1]);
                    joinableBorder.b330 = !this.hasPath(joinablePath, joinableHexagonsByColAndRow[joinableHexagon.col + 1]?.[joinableHexagon.row]); // || !this.hasPath(joinablePath, joinableHexagonsByColAndRow[joinableHexagon.col + 2]?.[joinableHexagon.row - 1]);
                } else {
                    joinableBorder.b030 = !this.hasPath(joinablePath, joinableHexagonsByColAndRow[joinableHexagon.col + 1]?.[joinableHexagon.row]); // || !this.hasPath(joinablePath, joinableHexagonsByColAndRow[joinableHexagon.col + 2]?.[joinableHexagon.row + 1]);
                    joinableBorder.b150 = !this.hasPath(joinablePath, joinableHexagonsByColAndRow[joinableHexagon.col - 1]?.[joinableHexagon.row]); // || !this.hasPath(joinablePath, joinableHexagonsByColAndRow[joinableHexagon.col - 2]?.[joinableHexagon.row + 1]);
                    joinableBorder.b210 = !this.hasPath(joinablePath, joinableHexagonsByColAndRow[joinableHexagon.col - 1]?.[joinableHexagon.row - 1]); // || !this.hasPath(joinablePath, joinableHexagonsByColAndRow[joinableHexagon.col - 2]?.[joinableHexagon.row - 1]);
                    joinableBorder.b330 = !this.hasPath(joinablePath, joinableHexagonsByColAndRow[joinableHexagon.col + 1]?.[joinableHexagon.row - 1]); // || !this.hasPath(joinablePath, joinableHexagonsByColAndRow[joinableHexagon.col + 2]?.[joinableHexagon.row - 1]);
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

    getBorders(props: IHexagonPath): IHexagon[] {

        // console.debug('⚙ get border', path);

        if (this.hexagons.length === 0) {
            return [];
        }

        const samplePath = props.getPath(this.hexagons[0]);
        if (this.pathLengthHistory.indexOf(samplePath.length) < 0) {
            this.calculateBordersAndStats(props);
            this.pathLengthHistory.push(samplePath.length);
        }
        // const pathTrimmed = path.replaceAll('#', '');

        const borderHexagons: IHexagon[] = [];
        for (const [key, value] of Object.entries(this.borderHexagons)) {
            if (key.length === samplePath.length) {
                borderHexagons.push(...value);
            }
        }

        return borderHexagons;

    }

}