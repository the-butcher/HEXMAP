import regression from 'regression';
import { FormattingDefinition } from "../util/FormattingDefinition";
import { TimeUtil } from "../util/TimeUtil";
import { ADataset } from "./ADataset";
import { DataEntry } from "./DataEntry";
import { IDataIndex } from './IDataIndex';
import { IDataRoot } from "./IDataRoot";
import { IDataValue } from "./IDataValue";
import { IKeysetIndex } from "./IKeysetIndex";
import { KeysetIndex } from "./KeysetIndex";
import { SeriesKey } from "./SeriesStyle";
import { Statistics } from "./Statistics";

/**
 * implementation of IDataSet
 * goal is to speed up things, espectially where calls for each hexagon have an impact even on a small scale
 * 
 * @author h.fleischer
 * @since 16.01.2021
 */
export class DatasetIncidence extends ADataset {

    private readonly indexKeyset: IKeysetIndex;

    private readonly minY: number;
    private readonly maxY: number;

    private readonly indexZeroIsAcceptable: number;

    constructor(dataRoot: IDataRoot) {

        super(dataRoot);

        this.minY = dataRoot.idxs[0].minY;
        this.maxY = dataRoot.idxs[0].maxY;

        const hasFatal = (dataRoot.idxs.length === 2 && dataRoot.idxs[1].name === 'fatal');
        this.indexZeroIsAcceptable = hasFatal ? 4 : 2;
        const indexKeys: SeriesKey[] = hasFatal ? [
            'Inzidenz',
            'Fälle',
            // 'dlt_incdc',
            // 'Gesamt',
            'Sterblichkeit',
            'Todesfälle',
            'Prognose',
            'reg_cases',
            'xlo_stpln',
            'xhi_stpln'

        ] : [
            'Inzidenz',
            'Fälle',
            // 'dlt_incdc',
            // 'Gesamt',
            'Prognose',
            'reg_cases',
            'xlo_stpln',
            'xhi_stpln'
        ];
        const indexes: IDataIndex[] = indexKeys.map(k => {
            return {
                name: k,
                isHiddenOption: false, // k.indexOf('_') >= 0,
                minY: this.minY,
                maxY: this.maxY
            }
        });

        this.indexKeyset = new KeysetIndex(0, indexes);

        const dateKeys = Object.keys(dataRoot.data);
        const popsKeys = Object.keys(this.populations);

        const stats: { [K in string]: Statistics[] } = {};
        const rdata: { [K in string]: number[][] } = {};
        const rgres: { [K in string]: any } = {};

        popsKeys.forEach(popsKey => {
            stats[popsKey] = [];
            for (let i = 0; i < 7; i++) {
                stats[popsKey][i] = new Statistics();
            }
            rdata[popsKey] = [];
        });

        const statsInstantMin = this.instantMax - TimeUtil.MILLISECONDS_PER___WEEK * 5 - TimeUtil.MILLISECONDS_PER____DAY * 4;
        const statsInstantReg = this.instantMax - TimeUtil.MILLISECONDS_PER___WEEK * 3 - TimeUtil.MILLISECONDS_PER____DAY * 4;
        const statsInstantMax = this.instantMax - TimeUtil.MILLISECONDS_PER___WEEK * 0 - TimeUtil.MILLISECONDS_PER____DAY * 4;

        const emptyDataValue: IDataValue = {
            noscl: 0,
            value: 0,
            label: () => ''
        }

        let lastValidEntry = {};
        for (let instant = this.instantMin + TimeUtil.MILLISECONDS_PER___WEEK; instant <= this.instantMax; instant += TimeUtil.MILLISECONDS_PER____DAY) {
            const dateKey = TimeUtil.formatCategoryDateFull(instant);
            if (dataRoot.data[dateKey]) {
                lastValidEntry = dataRoot.data[dateKey];
            } else {
                // if a full date may be missing, reuse the last entry to fill the gap
                console.log('missingKey', dateKey);
                dateKeys.push(dateKey);
                dataRoot.data[dateKey] = { ...lastValidEntry };
            }
        }

        dateKeys.sort((a, b) => TimeUtil.parseCategoryDateFull(a) - TimeUtil.parseCategoryDateFull(b));

        for (let i = 7; i < dateKeys.length; i++) { // each date

            const instant = TimeUtil.parseCategoryDateFull(dateKeys[i]);
            const weekday = new Date(instant).getDay();

            const incidenceData: { [x: string]: IDataValue[] } = {};
            popsKeys.forEach(popsKey => {

                const cases_01 = (dataRoot.data[dateKeys[i]][popsKey][0] - dataRoot.data[dateKeys[i - 1]][popsKey][0]);
                const incdnc01 = cases_01 * 700000 / this.getPopulation(popsKey);
                const incdnc07 = (dataRoot.data[dateKeys[i]][popsKey][0] - dataRoot.data[dateKeys[i - 7]][popsKey][0]) * 100000 / this.getPopulation(popsKey);

                incidenceData[popsKey] = [];
                incidenceData[popsKey].push({ // incidence
                    noscl: incdnc07,
                    value: incdnc07,
                    label: () => FormattingDefinition.FORMATTER____FIXED.format(incdnc07)
                });
                incidenceData[popsKey].push({ // cases
                    noscl: cases_01,
                    value: incdnc01,
                    label: () => FormattingDefinition.FORMATTER____FIXED.format(cases_01)
                });

                // if (i >= 14) {

                //     const incdnc14 = (dataRoot.data[dateKeys[i - 7]][popsKey][0] - dataRoot.data[dateKeys[i - 14]][popsKey][0]) * 100000 / this.getPopulation(popsKey);
                //     const deltaIncidence = 1 - (incdnc14 / incdnc07);

                //     // console.log('deltaIncidence', deltaIncidence);

                //     incidenceData[popsKey].push({
                //         noscl: deltaIncidence,
                //         value: deltaIncidence,
                //         label: () => FormattingDefinition.FORMATTER_PERCENT.format(deltaIncidence)
                //     }); // deltaIncidence

                // } else {

                //     incidenceData[popsKey].push({
                //         noscl: 0,
                //         value: 0,
                //         label: () => ''
                //     }); // deltaIncidence

                // }

                if (hasFatal) {

                    // attention multiplied -> so for label it needs to be demultiplied
                    const death1 = (dataRoot.data[dateKeys[i]][popsKey][1] - dataRoot.data[dateKeys[i - 1]][popsKey][1]);
                    const fatal1 = death1 * 700000 / this.getPopulation(popsKey);
                    const fatal7 = (dataRoot.data[dateKeys[i]][popsKey][1] - dataRoot.data[dateKeys[i - 7]][popsKey][1]) * 100000 / this.getPopulation(popsKey);

                    incidenceData[popsKey].push({ // mortality
                        noscl: fatal7,
                        value: fatal7,
                        label: () => FormattingDefinition.FORMATTER__FLOAT_2.format(fatal7)
                    });
                    incidenceData[popsKey].push({ // fatal
                        noscl: death1,
                        value: fatal1,
                        label: () => FormattingDefinition.FORMATTER____FIXED.format(death1)
                    });

                }

                if (instant > statsInstantMin && instant <= statsInstantMax) {

                    const cases25 = dataRoot.data[dateKeys[i + 2]][popsKey][0] - dataRoot.data[dateKeys[i - 5]][popsKey][0];
                    const cases34 = dataRoot.data[dateKeys[i + 3]][popsKey][0] - dataRoot.data[dateKeys[i - 4]][popsKey][0];
                    const cases43 = dataRoot.data[dateKeys[i + 4]][popsKey][0] - dataRoot.data[dateKeys[i - 3]][popsKey][0];
                    const incdncA = (cases25 * 25000 + cases34 * 50000 + cases43 * 25000) / this.getPopulation(popsKey);

                    incidenceData[popsKey].push({
                        noscl: incdncA,
                        value: incdncA,
                        label: () => FormattingDefinition.FORMATTER____FIXED.format(incdncA * this.getPopulation(popsKey) / 700000)
                    }); // average

                    stats[popsKey][weekday].addValue((incdnc01 / incdncA)); // store how far off the actual value is from the average

                    if (instant > statsInstantReg) {

                        stats[popsKey][weekday].addValue((incdnc01 / incdncA)); // store again to give more weight to more recent values store how far off the actual value is from the average

                        const rgresX = this.toRegressionX(instant, statsInstantMin, statsInstantMax);
                        const rgresY = this.toRegressionY(incdncA);
                        rdata[popsKey].push([
                            rgresX,
                            rgresY
                        ]);
                    }

                } else {
                    incidenceData[popsKey].push({ ...emptyDataValue });
                }

            });

            this.addEntry(dateKeys[i], new DataEntry(instant, incidenceData));

        }

        for (let i = 7; i < dateKeys.length; i++) { // each date

            const entry = this.getEntryByDate(dateKeys[i]);
            const instant = TimeUtil.parseCategoryDateFull(dateKeys[i]);
            const weekday = new Date(instant).getDay();
            popsKeys.forEach(popsKey => {

                if (instant > statsInstantReg) {

                    if (!rgres[popsKey]) {
                        rgres[popsKey] = regression.polynomial(rdata[popsKey], { order: 2 });
                        // console.log(popsKey, rdata[popsKey], rgres[popsKey]);
                    }

                    const rgresX = this.toRegressionX(instant, statsInstantMin, statsInstantMax);
                    const rgresY = (rgres[popsKey].equation[0] * Math.pow(rgresX, 2) + rgres[popsKey].equation[1] * rgresX + rgres[popsKey].equation[2]) * 1000;

                    const ratioAL = stats[popsKey][weekday].getAverage() - stats[popsKey][weekday].getStandardDeviation();
                    const ratioAU = stats[popsKey][weekday].getStandardDeviation() * 2;

                    const noscl = rgresY * this.getPopulation(popsKey) / 700000;
                    entry.addValue(popsKey, {
                        noscl,
                        value: rgresY,
                        label: () => FormattingDefinition.FORMATTER____FIXED.format(noscl)
                    }); // regression
                    entry.addValue(popsKey, {
                        noscl: noscl * ratioAL,
                        value: rgresY * ratioAL,
                        label: () => FormattingDefinition.FORMATTER____FIXED.format(noscl * ratioAL)
                    }); // lower expectation
                    entry.addValue(popsKey, {
                        noscl: noscl * ratioAU,
                        value: rgresY * ratioAU,
                        label: () => FormattingDefinition.FORMATTER____FIXED.format((noscl * (ratioAL + ratioAU)))
                    }); // upper expectation

                } else {

                    entry.addValue(popsKey, { ...emptyDataValue }); // regression
                    entry.addValue(popsKey, { ...emptyDataValue }); // lower expectation                    
                    entry.addValue(popsKey, { ...emptyDataValue }); // upper expectation

                }

            });
        }

        this.instantMax += TimeUtil.MILLISECONDS_PER____DAY * 0;
        for (let instant = statsInstantMax + TimeUtil.MILLISECONDS_PER____DAY * 5; instant <= this.instantMax; instant += TimeUtil.MILLISECONDS_PER____DAY) { // each date

            const date = TimeUtil.formatCategoryDateFull(instant);

            const incidenceData: { [x: string]: IDataValue[] } = {};
            popsKeys.forEach(popsKey => {

                incidenceData[popsKey] = [];
                incidenceData[popsKey].push({ ...emptyDataValue }); // incidence 
                incidenceData[popsKey].push({ ...emptyDataValue }); // cases
                if (hasFatal) {
                    incidenceData[popsKey].push({ ...emptyDataValue }); // mortality 
                    incidenceData[popsKey].push({ ...emptyDataValue }); // fatal
                }
                incidenceData[popsKey].push({ ...emptyDataValue }); // average


                const weekday = new Date(instant).getDay();

                const rgresX = this.toRegressionX(instant, statsInstantMin, statsInstantMax);
                const rgresY = (rgres[popsKey].equation[0] * Math.pow(rgresX, 2) + rgres[popsKey].equation[1] * rgresX + rgres[popsKey].equation[2]) * 1000;

                const ratioAL = stats[popsKey][weekday].getAverage() - stats[popsKey][weekday].getStandardDeviation();
                const ratioAU = stats[popsKey][weekday].getStandardDeviation() * 2;

                const noscl = rgresY * this.getPopulation(popsKey) / 700000;
                incidenceData[popsKey].push({
                    noscl,
                    value: rgresY,
                    label: () => FormattingDefinition.FORMATTER____FIXED.format(noscl)
                }); // regression
                incidenceData[popsKey].push({
                    noscl: noscl * ratioAL,
                    value: rgresY * ratioAL,
                    label: () => FormattingDefinition.FORMATTER____FIXED.format(noscl * ratioAL)
                }); // lower expectation
                incidenceData[popsKey].push({
                    noscl: noscl * ratioAU,
                    value: rgresY * ratioAU,
                    label: () => FormattingDefinition.FORMATTER____FIXED.format((noscl * (ratioAL + ratioAU)))
                }); // upper expectation                

            });

            this.addEntry(date, new DataEntry(instant, incidenceData));

        }


    }

    acceptsZero(rawIndex: number): boolean {
        return false; // rawIndex < this.indexZeroIsAcceptable;
    }

    toRegressionY(cases: number): number {
        return cases / 1000;
    }

    toRegressionX(instant: number, instantMin: number, instantMax: number): number {
        return (instant - instantMin) / (instantMax - instantMin);
    }

    getPopulation(key: string): number {
        return this.populations[key][0];
    }

    getMinY(): number {
        return this.minY;
    }

    getMaxY(): number {
        return this.maxY;
    }

    getIndexKeyset(): IKeysetIndex {
        return this.indexKeyset;
    }

}