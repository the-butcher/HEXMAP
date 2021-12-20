import { ColorUtil } from "./ColorUtil";
import { IColor } from "./IColor";
import { ObjectUtil } from './ObjectUtil';

export class Color implements IColor {

    static DARK_GREY = new Color(0, 0, 0.2);

    static readonly INDEX_H: number = 0;
    static readonly INDEX_S: number = 1;
    static readonly INDEX_V: number = 2;

    static readonly INDEX_R: number = 0;
    static readonly INDEX_G: number = 1;
    static readonly INDEX_B: number = 2;

    readonly hsv: number[];
    readonly rgb: number[];
    private hex: string | undefined;

    constructor(h: number, s: number, v: number) {
        this.hsv = [h, s, v];
        this.rgb = [0, 0, 0];
        ColorUtil.hsvToRgb(this.hsv, this.rgb);
    }

    getHsv(): number[] {
        return this.hsv;
    }

    outline(): IColor {
        return new Color(this.hsv[0], 1.00, 0.60); // Math.min(1, this.hsv[1] * 1.5), Math.min(1, this.hsv[2] * 1.5));
    }

    hilight(): IColor {
        return new Color(this.hsv[0], 1.00, 1.00); // Math.min(1, this.hsv[1] * 1.5), Math.min(1, this.hsv[2] * 1.5));
    }

    darker(steps: number): IColor {
        const color: IColor = new Color(this.hsv[0], this.hsv[1], Math.min(1, this.hsv[2] / Math.pow(1.25, steps)));
        return color;
    }

    getHex(): string {
        if (!this.hex) {
            this.hex = this.getHexRgb(this.rgb);
        }
        return this.hex!;
    }

    getRgb(): number[] {
        return this.rgb;
    }

    getHexRgb(rgb: number[]): string {
        return '#' + this.getHexChannel(rgb[Color.INDEX_R]) + this.getHexChannel(rgb[Color.INDEX_G]) + this.getHexChannel(rgb[Color.INDEX_B]);
        /*
        let hex = ((rgb[Color.INDEX_R] * 255) << 16 | (rgb[Color.INDEX_G] * 255) << 8 | (rgb[Color.INDEX_B] * 255)).toString(16);
        return '#000000'.substr(7-hex.length) + hex;
        */
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