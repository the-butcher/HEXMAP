import { IRange } from "./IRange";

/**
 * utility type to centralize logic used in multiple places
 *
 * @author h.fleischer
 * @since 09.01.2022
 */
export class ObjectUtil {

    /**
     * create a unique 6-digit id
     * @returns
     */
    static createId(): string {
        return Math.round(Math.random() * 100000000).toString(16).substring(0, 5);
    }

    static mapValues(valI: number, srcRange: IRange, dstRange: IRange): number {
        return dstRange.min + (valI - srcRange.min) * (dstRange.max - dstRange.min) / (srcRange.max - srcRange.min);
    }


}