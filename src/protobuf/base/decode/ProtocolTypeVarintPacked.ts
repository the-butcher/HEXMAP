
import { SubSourceMessage } from "../source/SubSourceMessage";
import { ISubSource } from "../source/ISubSource";
import { IProtocolType } from "./IProtocolType";
import { WireTypeLengthDelimited, WireType } from "../../WireType";

/**
 * protocol type specific to a packed set of 32-bit values<br>
 *
 * @author h.fleischer
 * @since 26.07.2019
 */
export class ProtocolTypeVarintPacked implements IProtocolType<number[], WireTypeLengthDelimited> {

    async decode(source: ISubSource): Promise<number[]> {
        var results: number[] = [];
        let subSource = new SubSourceMessage(source);
        try {
            while (!subSource.hasReachedLimit()) {
                results.push(subSource.readRawVarint32());
            }
        } finally {
            subSource?.popLimit();
        }
        return results;
    }

    getWireType(): WireTypeLengthDelimited {
        return WireType.get(WireType.INDEX_LENGTH_DELIMITED);
    }

}