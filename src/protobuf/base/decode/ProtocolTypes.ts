import { PbfBoundaries } from "../../types/PbfBoundaries";
import { PbfBoundariesBuilder } from "../../types/PbfBoundariesBuilder";
import { PbfBoundary } from "../../types/PbfBoundary";
import { PbfBoundaryBuilder } from "../../types/PbfBoundaryBuilder";
import { PbfCoordinate } from "../../types/PbfCoordinate";
import { PbfCoordinateBuilder } from "../../types/PbfCoordinateBuilder";
import { PbfHexagon } from "../../types/PbfHexagon";
import { PbfHexagonBuilder } from "../../types/PbfHexagonBuilder";
import { PbfHexagons } from "../../types/PbfHexagons";
import { PbfHexagonsBuilder } from "../../types/PbfHexagonsBuilder";
import { IProtocolTypeDefined } from "./IProtocolTypeDefined";
import { ITypeBuilder } from "./ITypeBuilder";
import { ProtocolTypeDefined } from "./ProtocolTypeDefined";
import { ProtocolTypeDouble } from './ProtocolTypeDouble';
import { ProtocolTypeSint64 } from './ProtocolTypeSint64';
import { ProtocolTypeString } from './ProtocolTypeString';
import { ProtocolTypeVarint32 } from './ProtocolTypeVarint32';
import { ProtocolTypeVarintPacked } from './ProtocolTypeVarintPacked';

/**
 * central collection of IProtocolType instances currently stored in scope<br>
 *
 * @author h.fleischer
 * @since 26.07.2019
 */
export class ProtocolTypes {

    // common
    static TYPE_UID_______VARINT32: string = 'd87c82ff-5dea-4bdd-9589-64073dadca22';
    static TYPE_UID_________SINT64: string = '14d0f1c9-b264-4d72-99a2-35d637cc69a9';
    static TYPE_UID_________DOUBLE: string = '0391f666-0911-440d-8a08-09e576cfe0a6';
    static TYPE_UID_________STRING: string = '81470f91-dc95-4668-8746-1e698e51e57a';
    static TYPE_UID__VARINT_PACKED: string = 'cde7a995-a930-41e9-bc33-ef4417021564';

    // report
    static TYPE_UID_______HEXAGONS: string = '0dfefe70-51e5-11ec-bf63-0242ac130002';
    static TYPE_UID________HEXAGON: string = '1b4d4082-51e5-11ec-bf63-0242ac130002';
    static TYPE_UID_____BOUNDARIES: string = '552e8fa1-9225-42fb-a1ec-204af46d4d50';
    static TYPE_UID_______BOUNDARY: string = '9a32c90d-6071-4925-aa6c-ce08df6feae0';
    static TYPE_UID_____COORDINATE: string = 'ebb15d79-35d8-4b65-9efb-14eab6b983ba';

    static ALL: { [K in string]: any } = {};
    static init() {
        ProtocolTypes.ALL[ProtocolTypes.TYPE_UID_______VARINT32] = new ProtocolTypeVarint32();
        ProtocolTypes.ALL[ProtocolTypes.TYPE_UID_________SINT64] = new ProtocolTypeSint64();
        ProtocolTypes.ALL[ProtocolTypes.TYPE_UID_________DOUBLE] = new ProtocolTypeDouble();
        ProtocolTypes.ALL[ProtocolTypes.TYPE_UID_________STRING] = new ProtocolTypeString();
        ProtocolTypes.ALL[ProtocolTypes.TYPE_UID__VARINT_PACKED] = new ProtocolTypeVarintPacked();
        ProtocolTypes.ALL[ProtocolTypes.TYPE_UID_______HEXAGONS] = ProtocolTypes.createPbfTypeHexagons();
        ProtocolTypes.ALL[ProtocolTypes.TYPE_UID________HEXAGON] = ProtocolTypes.createPbfTypeHexagon();
        ProtocolTypes.ALL[ProtocolTypes.TYPE_UID_____BOUNDARIES] = ProtocolTypes.createPbfTypeBoundaries();
        ProtocolTypes.ALL[ProtocolTypes.TYPE_UID_______BOUNDARY] = ProtocolTypes.createPbfTypeBoundary();
        ProtocolTypes.ALL[ProtocolTypes.TYPE_UID_____COORDINATE] = ProtocolTypes.createPbfTypeCoordinate();
    };

    static define<T, F extends ITypeBuilder<T, F>>(name: string, supplierOfFactory: Function): IProtocolTypeDefined<T, F> {
        return new ProtocolTypeDefined<T, F>(name, supplierOfFactory);
    }

    static fromTypeUid<T, F extends ITypeBuilder<T, F>>(typeUid: string): IProtocolTypeDefined<T, F> {
        const protocolType = ProtocolTypes.ALL[typeUid];
        if (protocolType) {
            return protocolType;
        } else {
            const message: string = "failed to find protocol type (typeUid: " + typeUid + ")";
            throw new Error(message);
        }
    }

    static createPbfTypeHexagons(): IProtocolTypeDefined<PbfHexagons, PbfHexagonsBuilder> {
        const protocolType: IProtocolTypeDefined<PbfHexagons, PbfHexagonsBuilder> = ProtocolTypes.define('hexagons', () => new PbfHexagonsBuilder());
        protocolType.defineKey('key__________hexagons', 0x1, ProtocolTypes.TYPE_UID________HEXAGON, (builder: PbfHexagonsBuilder, hexagon: PbfHexagon) => builder.addHexagon(hexagon));
        protocolType.defineKey('key_______value_types', 0x2, ProtocolTypes.TYPE_UID__VARINT_PACKED, (builder: PbfHexagonsBuilder, valueTypes: number[]) => builder.setValueTypes(valueTypes));
        return protocolType;
    }

    static createPbfTypeHexagon(): IProtocolTypeDefined<PbfHexagon, PbfHexagonBuilder> {
        const protocolType: IProtocolTypeDefined<PbfHexagon, PbfHexagonBuilder> = ProtocolTypes.define('hexagon', () => new PbfHexagonBuilder());
        protocolType.defineKey('key____________values', 0x1, ProtocolTypes.TYPE_UID__VARINT_PACKED, (builder: PbfHexagonBuilder, values: number[]) => builder.setValues(values));
        return protocolType;
    }

    static createPbfTypeBoundaries(): IProtocolTypeDefined<PbfBoundaries, PbfBoundariesBuilder> {
        const protocolType: IProtocolTypeDefined<PbfBoundaries, PbfBoundariesBuilder> = ProtocolTypes.define('boundaries', () => new PbfBoundariesBuilder());
        protocolType.defineKey('key________boundaries', 0x1, ProtocolTypes.TYPE_UID_______BOUNDARY, (builder: PbfBoundariesBuilder, boundary: PbfBoundary) => builder.addBoundary(boundary));
        return protocolType;
    }

    static createPbfTypeBoundary(): IProtocolTypeDefined<PbfBoundary, PbfBoundaryBuilder> {
        const protocolType: IProtocolTypeDefined<PbfBoundary, PbfBoundaryBuilder> = ProtocolTypes.define('boundary', () => new PbfBoundaryBuilder());
        protocolType.defineKey('key_______coordinates', 0x1, ProtocolTypes.TYPE_UID_____COORDINATE, (builder: PbfBoundaryBuilder, coordinate: PbfCoordinate) => builder.addCoordinate(coordinate));
        protocolType.defineKey('key________directions', 0x2, ProtocolTypes.TYPE_UID__VARINT_PACKED, (builder: PbfBoundaryBuilder, directions: number[]) => builder.setDirections(directions));
        return protocolType;
    }

    static createPbfTypeCoordinate(): IProtocolTypeDefined<PbfCoordinate, PbfCoordinateBuilder> {
        const protocolType: IProtocolTypeDefined<PbfCoordinate, PbfCoordinateBuilder> = ProtocolTypes.define('boundary', () => new PbfCoordinateBuilder());
        protocolType.defineKey('key_________________x', 0x1, ProtocolTypes.TYPE_UID_______VARINT32, (builder: PbfCoordinateBuilder, x: number) => builder.setX(x));
        protocolType.defineKey('key_________________y', 0x2, ProtocolTypes.TYPE_UID_______VARINT32, (builder: PbfCoordinateBuilder, y: number) => builder.setY(y));
        return protocolType;
    }

}
ProtocolTypes.init();
