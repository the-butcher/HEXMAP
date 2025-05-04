export class CodedOutputStream {

    private readonly output: number[];

    constructor() {
        this.output = [];
    }

    getOutput(): Uint8Array {
        return new Uint8Array(this.output);
    }

    writeRawByte(value: number): void {
        this.output.push(value);
    }

    writeRawVarint32(value: number, maxShift: number): void {
        let shift: number = 0;
        while (shift < maxShift) {
            if ((value & ~0x7F) == 0) {
                this.writeRawByte(value);
                return;
            } else {
                this.writeRawByte((value & 0x7F) | 0x80);
                value >>>= 7;
                shift += 7;
            }
        }
        throw new Error('malformed varint' + maxShift);
    }

    static encodeZigZag(n: number): number {
        return (n << 1) ^ (n >> 63);
    }

}