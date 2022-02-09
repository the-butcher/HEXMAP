import { ISeriesStyle } from "./ISeriesStyle";


export type SeriesKey = 'Inzidenz' | 'Fälle' | 'Sterblichkeit' | 'Todesfälle' | 'xlo_cases' | 'xhi_cases' | 'avg_cases' | 'reg_cases' | 'dlt_incdc' | 'icu_100pc' | 'icu_033pc' | 'icu_010pc';

export class SeriesStyle {

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

    static readonly SERIES_STYLE________100: ISeriesStyle = {
        type: 'line',
        color: 0xffffff,
        fill: 0xff0000,
        strokeWidth: 0,
        fillOpacity: 0.5,
        strokeOpacity: 0.0,
        stacked: true
    };

    static readonly SERIES_STYLE________033: ISeriesStyle = {
        type: 'line',
        color: 0xffffff,
        fill: 0xffff00,
        strokeWidth: 0,
        fillOpacity: 0.2,
        strokeOpacity: 0.0,
        stacked: true
    };

    static readonly SERIES_STYLE________010: ISeriesStyle = {
        type: 'line',
        color: 0xffffff,
        fill: 0x00ff00,
        strokeWidth: 0,
        fillOpacity: 0.2,
        strokeOpacity: 0.0,
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
        'xlo_cases': this.SERIES_STYLE__CASERANGE,
        'xhi_cases': { ... this.SERIES_STYLE__CASERANGE, stacked: true, fillOpacity: 0.3 },
        'avg_cases': this.SERIES_STYLE____AVERAGE,
        'reg_cases': this.SERIES_STYLE_REGRESSION,
        'dlt_incdc': this.SERIES_STYLE____AVERAGE,
        'icu_100pc': this.SERIES_STYLE________100,
        'icu_033pc': this.SERIES_STYLE________033,
        'icu_010pc': this.SERIES_STYLE________010,
    }

}