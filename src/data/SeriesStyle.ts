import { ISeriesStyle } from "./ISeriesStyle";


export type SeriesKey = 'Inzidenz' | 'Fälle' | 'Sterblichkeit' | 'Todesfälle' | 'xlo_cases' | 'xhi_cases' | 'avg_cases' | 'reg_cases';

export class SeriesStyle {

    static readonly SERIES_STYLE__CASERANGE: ISeriesStyle = {
        type: 'step',
        color: 0xd6781f,
        fill: 0xd6781f,
        strokeWidth: 1,
        fillOpacity: 0.0,
        // strokeDasharray: [1, 2],
        stacked: false
    };

    static readonly SERIES_STYLE______CASES: ISeriesStyle = {
        type: 'step',
        color: 0xc1c1aa,
        fill: 0xc1c1aa,
        strokeWidth: 1,
        fillOpacity: 0.0,
        stacked: false
    };

    static readonly SERIES_STYLE____AVERAGE: ISeriesStyle = {
        type: 'line',
        color: 0xc1c1aa,
        fill: 0xc1c1aa,
        strokeWidth: 1,
        fillOpacity: 0.0,
        stacked: false
    };

    static readonly SERIES_STYLE_REGRESSION: ISeriesStyle = {
        type: 'line',
        color: 0xd6781f,
        fill: 0xc1c1aa,
        strokeWidth: 1,
        fillOpacity: 0.0,
        strokeDasharray: [1, 2],
        stacked: false
    };

    static readonly SERIES_STYLE____DEFAULT: ISeriesStyle = {
        type: 'line',
        color: 0xc1c1aa,
        fill: 0xc1c1aa,
        strokeWidth: 2,
        fillOpacity: 0.2,
        stacked: false
    }

    static readonly PREDFINED_STYLE: { [K in SeriesKey]: ISeriesStyle } = {
        'Inzidenz': this.SERIES_STYLE____DEFAULT,
        'Fälle': this.SERIES_STYLE______CASES,
        // 'Gesamt': this.SERIES_STYLE______CASES,
        'Sterblichkeit': this.SERIES_STYLE____DEFAULT,
        'Todesfälle': this.SERIES_STYLE______CASES,
        'xlo_cases': this.SERIES_STYLE__CASERANGE,
        'xhi_cases': { ... this.SERIES_STYLE__CASERANGE, stacked: true, fillOpacity: 0.3 },
        'avg_cases': this.SERIES_STYLE____AVERAGE,
        'reg_cases': this.SERIES_STYLE_REGRESSION,
    }

}