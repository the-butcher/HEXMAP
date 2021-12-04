import { IProtocolTypeDefined } from '../protobuf/base/decode/IProtocolTypeDefined';
import { ProtocolTypes } from '../protobuf/base/decode/ProtocolTypes';
import { CodedInputStream } from '../protobuf/base/source/CodedInputStream';
import { ISubSource } from '../protobuf/base/source/ISubSource';
import { SubSource } from '../protobuf/base/source/SubSource';
import { ByteLoader } from '../util/ByteLoader';
import { PbfBoundaries } from './types/PbfBoundaries';
import { PbfBoundariesBuilder } from './types/PbfBoundariesBuilder';

/**
 * helper for loading PBFRoot, decoding it from the bytes provided by a ByteLoader
 *
 * @author h.fleischer
 * @since 12.10.2019
 *
 */
export class PbfBoundariesLoader {

    // milliseconds per byte
    size: number = -1;
    time: number = -1;

    async load(pbfUrl: string): Promise<PbfBoundaries> {

        const byteArray = await new ByteLoader().load(pbfUrl);

        const input = new CodedInputStream(byteArray);
        const subSource: ISubSource = SubSource.wrapped(input);
        const protocolType: IProtocolTypeDefined<PbfBoundaries, PbfBoundariesBuilder> = ProtocolTypes.fromTypeUid(ProtocolTypes.TYPE_UID_____BOUNDARIES);
        const tsA = Date.now();
        const pbfRoot = await protocolType.decode(subSource);
        this.size = byteArray.length;
        this.time = (Date.now() - tsA);

        return pbfRoot;

    }

}