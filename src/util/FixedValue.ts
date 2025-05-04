import { IInterpolatedValue } from "./IInterpolatedValue";

export class FixedValue implements IInterpolatedValue {

    private readonly out: number;

    constructor(out: number) {
        this.out = out;
    }

    getOut(val: number): number {
        return this.out;
    }

}