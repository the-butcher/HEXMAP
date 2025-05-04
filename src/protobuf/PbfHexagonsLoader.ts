import { IProtocolTypeDefined } from '../protobuf/base/decode/IProtocolTypeDefined';
import { ProtocolTypes } from '../protobuf/base/decode/ProtocolTypes';
import { CodedInputStream } from '../protobuf/base/source/CodedInputStream';
import { ISubSource } from '../protobuf/base/source/ISubSource';
import { SubSource } from '../protobuf/base/source/SubSource';
import { ByteLoader } from '../util/ByteLoader';
import { PbfHexagons } from './types/PbfHexagons';
import { PbfHexagonsBuilder } from './types/PbfHexagonsBuilder';

/**
 * helper for loading PBFRoot, decoding it from the bytes provided by a ByteLoader
 *
 * @author h.fleischer
 * @since 12.10.2019
 *
 */
export class PbfHexagonsLoader {

    // milliseconds per byte
    size: number = -1;
    time: number = -1;

    async fromUrl(pbfUrl: string): Promise<PbfHexagons> {

        const byteArray = await new ByteLoader().load(pbfUrl);
        return await this.fromData(byteArray);

    }

    async fromData(byteArray: Uint8Array): Promise<PbfHexagons> {

        const input = new CodedInputStream(byteArray);
        const subSource: ISubSource = SubSource.wrapped(input);
        const protocolType: IProtocolTypeDefined<PbfHexagons, PbfHexagonsBuilder> = ProtocolTypes.fromTypeUid(ProtocolTypes.TYPE_UID_______HEXAGONS);
        const tsA = Date.now();
        const pbfRoot = await protocolType.decode(subSource);
        this.size = byteArray.length;
        this.time = (Date.now() - tsA);

        return pbfRoot;

    }

}