import { IProtocolType } from './base/decode/IProtocolType';
import { ISubSource } from './base/source/ISubSource';

/**
 * definition for "wire-types", as specified in the protobuf standard
 * TODO could be converted to enum
 *
 * @author h.fleischer
 * @since 22.07.2019
 */
export interface IWireType {

    /**
     * get the raw code, as encoded in the respective key
     */
    getRaw(): number;

    /**
     * pop a message from the given source, and subsequently drop and ignore it
     * this is done to re-establish a proper position in the protocol buffer source even when an unknown key is encountered
     * @param source
     */
    popUndefinedMessage(source: ISubSource): Promise<void>;

}