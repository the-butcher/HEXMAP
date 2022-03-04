import { ISeriesStyle } from "./ISeriesStyle";


export type SeriesKey = 'Inzidenz' | 'Fälle' | 'Sterblichkeit' | 'Todesfälle' | 'Normalstation' | 'Intensivstation' |
    'xlo_stpln' | 'xhi_stpln' | 'xlo____ln' | 'xhi____ln' | 'xmd_intrv' | 'reg_cases' |
    'dlt_incdc' |
    'hsp__high' | 'hsp__med2' | 'hsp__med1' | 'hsp___low';

export type Subset<T extends U, U> = U;

export class SeriesStyle {

    // static readonly SERIES_GROUPING: { [K in SeriesKey]: SeriesKey[] } = {

    // }

    static readonly SERIES_STYLE______RANGE: ISeriesStyle = {
        type: 'line',
        color: 0xc1c1aa,
        fill: 0xc1c1aa,
        strokeWidth: 1,
        fillOpacity: 0.0,
        strokeOpacity: 0.7,
        stacked: false
    };

    static readonly SERIES_STYLE__CASERANGE: ISeriesStyle = {
        type: 'step',
        color: 0xd6781f,
        fill: 0xd6781f,
        strokeWidth: 1,
        fillOpacity: 0.0,
        strokeOpacity: 1.0,
        // strokeDasharray: [1, 2],
        stacked: false
    };

    static readonly SERIES_STYLE______CASES: ISeriesStyle = {
        type: 'step',
        color: 0xc1c1aa,
        fill: 0xc1c1aa,
        strokeWidth: 1,
        fillOpacity: 0.0,
        strokeOpacity: 1.0,
        stacked: false
    };

    static readonly SERIES_STYLE____AVERAGE: ISeriesStyle = {
        type: 'line',
        color: 0xc1c1aa,
        fill: 0xc1c1aa,
        strokeWidth: 1,
        fillOpacity: 0.0,
        strokeOpacity: 1.0,
        strokeDasharray: [1, 2],
        stacked: false
    };

    static readonly SERIES_STYLE_REGRESSION: ISeriesStyle = {
        type: 'line',
        color: 0xd6781f,
        fill: 0xc1c1aa,
        strokeWidth: 1,
        fillOpacity: 0.0,
        strokeOpacity: 1.0,
        strokeDasharray: [1, 2],
        stacked: false
    };

    static readonly SERIES_STYLE________RED: ISeriesStyle = {
        type: 'line',
        color: 0xffffff,
        fill: 0xaa3333,
        strokeWidth: 0,
        fillOpacity: 0.5,
        strokeOpacity: 0.0,
        stacked: true
    };

    static readonly SERIES_STYLE_____ORANGE: ISeriesStyle = {
        type: 'line',
        color: 0xffffff,
        fill: 0xff8000,
        strokeWidth: 0.5,
        fillOpacity: 0.2,
        strokeOpacity: 0.5,
        strokeDasharray: [4, 3],
        stacked: true
    };

    static readonly SERIES_STYLE_____YELLOW: ISeriesStyle = {
        type: 'line',
        color: 0xffffff,
        fill: 0xffff00,
        strokeWidth: 0.5,
        fillOpacity: 0.2,
        strokeOpacity: 0.5,
        strokeDasharray: [4, 3],
        stacked: true
    };

    static readonly SERIES_STYLE______GREEN: ISeriesStyle = {
        type: 'line',
        color: 0xffffff,
        fill: 0x00ff00,
        strokeWidth: 0.5,
        fillOpacity: 0.2,
        strokeOpacity: 0.5,
        strokeDasharray: [4, 3],
        stacked: true
    };

    static readonly SERIES_STYLE____DEFAULT: ISeriesStyle = {
        type: 'line',
        color: 0xc1c1aa,
        fill: 0xc1c1aa,
        strokeWidth: 2,
        fillOpacity: 0.1,
        strokeOpacity: 1.0,
        stacked: false
    }

    static readonly PREDFINED_STYLE: { [K in SeriesKey]: ISeriesStyle } = {
        'Inzidenz': this.SERIES_STYLE____DEFAULT,
        'Fälle': this.SERIES_STYLE______CASES,
        // 'Gesamt': this.SERIES_STYLE______CASES,
        'Sterblichkeit': this.SERIES_STYLE____DEFAULT,
        'Todesfälle': this.SERIES_STYLE______CASES,
        'Normalstation': { ... this.SERIES_STYLE____DEFAULT, fillOpacity: 0 },
        'Intensivstation': { ... this.SERIES_STYLE____DEFAULT, fillOpacity: 0 },
        'xlo_stpln': this.SERIES_STYLE__CASERANGE,
        'xhi_stpln': { ... this.SERIES_STYLE__CASERANGE, stacked: true, fillOpacity: 0.3 },
        'xlo____ln': this.SERIES_STYLE______RANGE,
        'xhi____ln': { ... this.SERIES_STYLE______RANGE, stacked: true, fillOpacity: 0.2 },
        'xmd_intrv': this.SERIES_STYLE____AVERAGE,
        'reg_cases': this.SERIES_STYLE_REGRESSION,
        'dlt_incdc': this.SERIES_STYLE____AVERAGE,
        'hsp__high': this.SERIES_STYLE________RED,
        'hsp__med2': this.SERIES_STYLE_____ORANGE,
        'hsp__med1': this.SERIES_STYLE_____YELLOW,
        'hsp___low': this.SERIES_STYLE______GREEN,

    }

}