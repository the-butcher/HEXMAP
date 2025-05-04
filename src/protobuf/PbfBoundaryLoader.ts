import { IProtocolTypeDefined } from './base/decode/IProtocolTypeDefined';
import { ProtocolTypes } from './base/decode/ProtocolTypes';
import { CodedInputStream } from './base/source/CodedInputStream';
import { ISubSource } from './base/source/ISubSource';
import { SubSource } from './base/source/SubSource';
import { ByteLoader } from '../util/ByteLoader';
import { PbfBoundaries } from './types/PbfBoundaries';
import { PbfBoundariesBuilder } from './types/PbfBoundariesBuilder';

export class PbfBoundaryLoader {

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