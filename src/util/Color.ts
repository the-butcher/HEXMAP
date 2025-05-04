import { ColorUtil } from "./ColorUtil";
import { IColor } from "./IColor";

export class Color implements IColor {

    static readonly INDEX_H: number = 0;
    static readonly INDEX_S: number = 1;
    static readonly INDEX_V: number = 2;

    static readonly INDEX_R: number = 0;
    static readonly INDEX_G: number = 1;
    static readonly INDEX_B: number = 2;

    private hsv: number[];
    private rgb: number[];
    private hex: string | undefined;

    constructor(h: number, s: number, v: number) {
        this.hsv = [h, s, v];
    }

    getHsv(): number[] {
        return this.hsv;
    }

    outline(): IColor {
        return new Color(this.hsv[0], this.hsv[1], Math.min(1, this.hsv[2] * 1.30)); // Math.min(1, this.hsv[1] * 1.5), Math.min(1, this.hsv[2] * 1.5));
    }

    hilight(): IColor {
        return new Color(this.hsv[0], this.hsv[1], Math.min(1, (this.hsv[2] + 0.03) * 3.00)); // Math.min(1, this.hsv[2] * 2.00) // Math.min(1, this.hsv[1] * 1.5), Math.min(1, this.hsv[2] * 1.5));
    }

    darker(steps: number): IColor {
        const color: IColor = new Color(this.hsv[0], this.hsv[1], Math.min(1, this.hsv[2] / Math.pow(1.25, steps)));
        return color;
    }

    getHex(): string {
        if (!this.hex) {
            this.hex = this.getHexRgb(this.getRgb());
        }
        return this.hex!;
    }

    getRgb(): number[] {
        if (!this.rgb) {
            this.rgb = [0, 0, 0];
            ColorUtil.getInstance().hsvToRgb(this.hsv, this.rgb);
        }
        return this.rgb;
    }

    getHexRgb(rgb: number[]): string {
        return '#' + this.getHexChannel(rgb[Color.INDEX_R]) + this.getHexChannel(rgb[Color.INDEX_G]) + this.getHexChannel(rgb[Color.INDEX_B]);
    }

    /**
     * get a hex string from a normalized (0-1) channel value
     * @param channel
     */
    getHexChannel(channel: number): string {
        const hex = Number(Math.floor(channel * 255)).toString(16);
        if (hex.length < 2) {
            return "0" + hex;
        } else {
            return hex.substring(0, 2);
        }
    };

}