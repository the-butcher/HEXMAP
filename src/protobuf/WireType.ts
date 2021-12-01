import { ProtocolTypes } from './base/decode/ProtocolTypes';
import { ISubSource } from './base/source/ISubSource';
import { IWireType } from "./IWireType";
import { TagUtil } from "./TagUtil";

export class WireTypeVarint32 implements IWireType {
    getRaw(): number {
        return 0;
    }
    async popUndefinedMessage(source: ISubSource): Promise<void> {
        await ProtocolTypes.fromTypeUid(ProtocolTypes.TYPE_UID_______VARINT32).decode(source);
    }
}

export class WireTypeFixed64 implements IWireType {
    getRaw(): number {
        return 1;
    }
    async popUndefinedMessage(source: ISubSource): Promise<void> {
        await ProtocolTypes.fromTypeUid(ProtocolTypes.TYPE_UID_________SINT64).decode(source);
    }
}

export class WireTypeLengthDelimited implements IWireType {
    getRaw(): number {
        return 2;
    }
    async popUndefinedMessage(source: ISubSource): Promise<void> {
        await ProtocolTypes.fromTypeUid(ProtocolTypes.TYPE_UID_________STRING).decode(source);
    }
}

export class WireTypeStartGroup implements IWireType {
    getRaw(): number {
        return 3;
    }
    async popUndefinedMessage(source: ISubSource): Promise<void> {
        // do nothing
    }
}

export class WireTypeEndGroup implements IWireType {
    getRaw(): number {
        return 4;
    }
    async popUndefinedMessage(source: ISubSource): Promise<void> {
        // do nothing
    }
}

export class WireTypeFixed32 implements IWireType {
    getRaw(): number {
        return 5;
    }
    async popUndefinedMessage(source: ISubSource): Promise<void> {
        throw new Error("ni");
    }
}

/**
 * accessor to the various wire-types as defined in the protocol-buffer standard
 *
 * @author h.fleischer
 * @since 26.07.2019
 */
export class WireType {

    static INDEX_________VARINT32: number = 0;
    static INDEX__________FIXED64: number = 1;
    static INDEX_LENGTH_DELIMITED: number = 2;
    static INDEX______START_GROUP: number = 3;
    static INDEX________END_GROUP: number = 4;
    static INDEX__________FIXED32: number = 5;

    static ALL: any[] = [
        new WireTypeVarint32(), //0
        new WireTypeFixed64(), //1
        new WireTypeLengthDelimited(), //2
        new WireTypeStartGroup(), //3
        new WireTypeEndGroup(), //4
        new WireTypeFixed32() //5
    ]

    static get(index: number): IWireType {
        if (index >= 0 && index < WireType.ALL.length) {
            return this.ALL[index];
        } else {
            throw new Error("failed to resolve geomtype (index: " + index + ")");
        }
    }

    /**
     * resolves an instance of IWireType from the given tag-value
     *
     * @param tag
     */
    static toWireType(tag: number): IWireType {
        return this.get(TagUtil.toCode(tag));
    }

}

