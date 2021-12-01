import { PbfHexagon } from "../../hexagons/PbfHexagon";
import { PbfHexagonBuilder } from "../../hexagons/PbfHexagonBuilder";
import { PbfHexagons } from "../../hexagons/PbfHexagons";
import { PbfHexagonsBuilder } from "../../hexagons/PbfHexagonsBuilder";
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

    static ALL: { [K in string ]: any } = {};
    static init() {
        ProtocolTypes.ALL[ProtocolTypes.TYPE_UID_______VARINT32] = new ProtocolTypeVarint32();
        ProtocolTypes.ALL[ProtocolTypes.TYPE_UID_________SINT64] = new ProtocolTypeSint64();
        ProtocolTypes.ALL[ProtocolTypes.TYPE_UID_________DOUBLE] = new ProtocolTypeDouble();
        ProtocolTypes.ALL[ProtocolTypes.TYPE_UID_________STRING] = new ProtocolTypeString();
        ProtocolTypes.ALL[ProtocolTypes.TYPE_UID__VARINT_PACKED] = new ProtocolTypeVarintPacked();
        ProtocolTypes.ALL[ProtocolTypes.TYPE_UID_______HEXAGONS] = ProtocolTypes.createPbfTypeHexagons();
        ProtocolTypes.ALL[ProtocolTypes.TYPE_UID________HEXAGON] = ProtocolTypes.createPbfTypeHexagon();
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
            // console.log(message);
            throw new Error(message);
        }
    }

    static createPbfTypeHexagons(): IProtocolTypeDefined<PbfHexagons, PbfHexagonsBuilder> {
        const protocolType: IProtocolTypeDefined<PbfHexagons, PbfHexagonsBuilder> = ProtocolTypes.define('hexagons', () => new PbfHexagonsBuilder());
        protocolType.defineKey('key__________hexagons', 0x1, ProtocolTypes.TYPE_UID________HEXAGON, (builder: PbfHexagonsBuilder, hexagon: PbfHexagon) => builder.addHexagon(hexagon));
        return protocolType;
    }

    static createPbfTypeHexagon(): IProtocolTypeDefined<PbfHexagon, PbfHexagonBuilder> {
        const protocolType: IProtocolTypeDefined<PbfHexagon, PbfHexagonBuilder> = ProtocolTypes.define('hexagon', () => new PbfHexagonBuilder());
        protocolType.defineKey('key_____________codes', 0x1, ProtocolTypes.TYPE_UID__VARINT_PACKED, (builder: PbfHexagonBuilder, codes: number[]) => builder.setCodes(codes));
        protocolType.defineKey('key_______coordinates', 0x2, ProtocolTypes.TYPE_UID__VARINT_PACKED, (builder: PbfHexagonBuilder, coordinates: number[]) => builder.setCoordinates(coordinates));
        return protocolType;
    }

}
ProtocolTypes.init();
