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

    constructor(dataRoot: IDataRoot) {

        super(dataRoot);


        this.minY = dataRoot.idxs[0].minY;
        this.maxY = dataRoot.idxs[0].maxY;

        const hasFatal = (dataRoot.idxs.length === 2 && dataRoot.idxs[1].name === 'fatal');
        const indexKeys: SeriesKey[] = hasFatal ? [
            'Inzidenz',
            'Fälle',
            // 'dlt_incdc',
            // 'Gesamt',
            'Sterblichkeit',
            'Todesfälle',
            'avg_cases',
            'reg_cases',
            'xlo_cases',
            'xhi_cases'

        ] : [
            'Inzidenz',
            'Fälle',
            // 'dlt_incdc',
            // 'Gesamt',
            'avg_cases',
            'reg_cases',
            'xlo_cases',
            'xhi_cases'
        ];
        const indexes: IDataIndex[] = indexKeys.map(k => {
            return {
                name: k,
                isHiddenOption: false,
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

        for (let i = 7; i < dateKeys.length; i++) { // each date

            const instant = TimeUtil.parseCategoryDateFull(dateKeys[i]);
            const weekday = new Date(instant).getDay();

            const incidenceData: { [x: string]: IDataValue[] } = {};
            popsKeys.forEach(popsKey => {

                // const caseAll = dataRoot.data[dateKeys[i]][popsKey][0] * 5000 / this.getPopulation(popsKey)
                const incdnc01 = (dataRoot.data[dateKeys[i]][popsKey][0] - dataRoot.data[dateKeys[i - 1]][popsKey][0]) * 700000 / this.getPopulation(popsKey);
                const incdnc07 = (dataRoot.data[dateKeys[i]][popsKey][0] - dataRoot.data[dateKeys[i - 7]][popsKey][0]) * 100000 / this.getPopulation(popsKey);
                // const incdnc14 = (dataRoot.data[dateKeys[i - 7]][popsKey][0] - dataRoot.data[dateKeys[i - 14]][popsKey][0]) * 100000 / this.getPopulation(popsKey);
                // const trend = (incdnc07 - incdnc14) / incdnc14;

                incidenceData[popsKey] = [];
                incidenceData[popsKey].push({ // incidence
                    value: incdnc07,
                    label: () => FormattingDefinition.FORMATTER____FIXED.format(incdnc07)
                });
                incidenceData[popsKey].push({ // cases
                    value: incdnc01,
                    label: () => FormattingDefinition.FORMATTER____FIXED.format(incdnc01 * this.getPopulation(popsKey) / 700000)
                });

                if (hasFatal) {

                    // attention multiplied -> so for label it needs to be demultiplied

                    const fatal1 = (dataRoot.data[dateKeys[i]][popsKey][1] - dataRoot.data[dateKeys[i - 1]][popsKey][1]) * 700000 / this.getPopulation(popsKey);
                    const fatal7 = (dataRoot.data[dateKeys[i]][popsKey][1] - dataRoot.data[dateKeys[i - 7]][popsKey][1]) * 100000 / this.getPopulation(popsKey);
                    incidenceData[popsKey].push({ // mortality
                        value: fatal7,
                        label: () => FormattingDefinition.FORMATTER__FLOAT_2.format(fatal7)
                    });
                    incidenceData[popsKey].push({ // fatal
                        value: fatal1,
                        label: () => FormattingDefinition.FORMATTER____FIXED.format(fatal1 * this.getPopulation(popsKey) / 700000)
                    });

                }

                if (instant > statsInstantMin && instant <= statsInstantMax) {

                    const cases25 = dataRoot.data[dateKeys[i + 2]][popsKey][0] - dataRoot.data[dateKeys[i - 5]][popsKey][0];
                    const cases34 = dataRoot.data[dateKeys[i + 3]][popsKey][0] - dataRoot.data[dateKeys[i - 4]][popsKey][0];
                    const cases43 = dataRoot.data[dateKeys[i + 4]][popsKey][0] - dataRoot.data[dateKeys[i - 3]][popsKey][0];
                    const incdncA = (cases25 * 25000 + cases34 * 50000 + cases43 * 25000) / this.getPopulation(popsKey);

                    incidenceData[popsKey].push({
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
                    incidenceData[popsKey].push({
                        value: 0,
                        label: () => ''
                    }); // average
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
                    // const rgresY = (rgres[popsKey].equation[0] * Math.pow(rgresX, 3) + rgres[popsKey].equation[1] * Math.pow(rgresX, 2) + rgres[popsKey].equation[2] * rgresX + rgres[popsKey].equation[3]) * 1000;
                    const rgresY = (rgres[popsKey].equation[0] * Math.pow(rgresX, 2) + rgres[popsKey].equation[1] * rgresX + rgres[popsKey].equation[2]) * 1000;
                    // const rgresY = (rgres[popsKey].equation[0] * Math.pow(Math.E, rgres[popsKey].equation[1] * rgresX)) * 1000;

                    const ratioAL = stats[popsKey][weekday].getAverage() - stats[popsKey][weekday].getStandardDeviation();
                    const ratioAU = stats[popsKey][weekday].getStandardDeviation() * 2;
                    // if (popsKey === '#') {
                    //     console.log(popsKey, weekday, stats[popsKey][weekday].getStandardDeviation());
                    // }

                    entry.addValue(popsKey, {
                        value: rgresY,
                        label: () => FormattingDefinition.FORMATTER____FIXED.format(rgresY * this.getPopulation(popsKey) / 700000)
                    }); // regression
                    entry.addValue(popsKey, {
                        value: rgresY * ratioAL,
                        label: () => FormattingDefinition.FORMATTER____FIXED.format(rgresY * ratioAL * this.getPopulation(popsKey) / 700000)
                    }); // lower expectation
                    entry.addValue(popsKey, {
                        value: rgresY * ratioAU,
                        label: () => FormattingDefinition.FORMATTER____FIXED.format((rgresY * ratioAL + rgresY * ratioAU) * this.getPopulation(popsKey) / 700000)
                    }); // upper expectation

                } else {

                    entry.addValue(popsKey, {
                        value: 0,
                        label: () => ''
                    }); // regression
                    entry.addValue(popsKey, {
                        value: 0,
                        label: () => ''
                    }); // lower expectation                    
                    entry.addValue(popsKey, {
                        value: 0,
                        label: () => ''
                    }); // upper expectation

                }

            });
        }

        for (let instant = statsInstantMax + TimeUtil.MILLISECONDS_PER____DAY * 3; instant < statsInstantMax + TimeUtil.MILLISECONDS_PER____DAY * 7; instant += TimeUtil.MILLISECONDS_PER____DAY) { // each date

            const weekday = new Date(instant).getDay();
            popsKeys.forEach(popsKey => {

                const rgresX = this.toRegressionX(instant, statsInstantMin, statsInstantMax);
                const rgresY = (rgres[popsKey].equation[0] * Math.pow(rgresX, 3) + rgres[popsKey].equation[1] * Math.pow(rgresX, 2) + rgres[popsKey].equation[2] * rgresX + rgres[popsKey].equation[3]) * 1000;

                const ratioAv = stats[popsKey][weekday].getAverage();

                // console.log(TimeUtil.formatCategoryDateFull(instant), popsKey, Math.round(casesEx)); // regression //  
                // if (popsKey === '#') {
                //     console.log(TimeUtil.formatCategoryDateFull(instant), popsKey, weekday, ratioAv, Math.round(rgresY * ratioAv * this.populations[popsKey] / 700000));
                // }
                // console.log(TimeUtil.formatCategoryDateFull(instant), popsKey, Math.round(rgresY * ratioAv)); // expectation 

            });

        }


    }

    acceptsZero(): boolean {
        return false;
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