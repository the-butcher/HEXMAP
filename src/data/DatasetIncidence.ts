import { TimeUtil } from "../util/TimeUtil";
import { DataEntry } from "./DataEntry";
import { DataRepository } from "./DataRepository";
import { IDataEntry } from "./IDataEntry";
import { IDataRoot } from "./IDataRoot";
import { IDataset } from "./IDataset";
import { IKeyset } from "./IKeyset";
import { IKeysetIndex } from "./IKeysetIndex";
import { KeysetGeneric } from "./KeysetGeneric";
import { KeysetIndex } from "./KeysetIndex";
import { Statistics } from "./Statistics";
import regression from 'regression';
import { IDataValue } from "./IDataValue";
import { FormattingDefinition } from "../util/FormattingDefinition";

/**
 * implementation of IDataSet
 * goal is to speed up things, espectially where calls for each hexagon have an impact even on a small scale
 * 
 * @author h.fleischer
 * @since 16.01.2021
 */
export class DatasetIncidence implements IDataset {

    // private readonly dataRoot: IDataRoot;
    private readonly populations: { [K in string]: number };
    private readonly keysetKeys: string[];
    private readonly keysets: { [K in string]: IKeyset };
    private readonly entryKeys: string[]; // the actual formatted dates
    private readonly entries: { [K in string]: IDataEntry };
    private readonly indexKeyset: IKeysetIndex;

    private readonly instantMin: number;
    private readonly instantMax: number;
    private readonly minY: number;
    private readonly maxY: number;

    constructor(dataRoot: IDataRoot) {

        this.populations = dataRoot.pops;

        this.keysetKeys = Object.keys(dataRoot.keys);
        this.keysets = {};
        this.keysetKeys.forEach(keysetKey => {
            const defaultKey = Object.keys(dataRoot.keys[keysetKey]).sort()[0];
            this.keysets[keysetKey] = new KeysetGeneric(keysetKey, defaultKey, dataRoot.keys[keysetKey]);
        });

        this.indexKeyset = new KeysetIndex(0, [
            'Inzidenz',
            'Fälle',
            'avg',
            'reg',
            'xlo',
            'xhi'
        ]);

        const dateKeys = Object.keys(dataRoot.data);
        this.instantMin = TimeUtil.parseCategoryDateFull(dateKeys[7]);
        this.instantMax = TimeUtil.parseCategoryDateFull(dateKeys[dateKeys.length - 1]);
        this.entryKeys = [];
        this.entries = {};
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

        const statsInstantMin = this.instantMax - TimeUtil.MILLISECONDS_PER___WEEK * 13 - TimeUtil.MILLISECONDS_PER____DAY * 4;
        const statsInstantReg = this.instantMax - TimeUtil.MILLISECONDS_PER___WEEK * 2 - TimeUtil.MILLISECONDS_PER____DAY * 4;
        const statsInstantMax = this.instantMax - TimeUtil.MILLISECONDS_PER___WEEK * 0 - TimeUtil.MILLISECONDS_PER____DAY * 5;

        for (let i = 7; i < dateKeys.length; i++) { // each date

            const instant = TimeUtil.parseCategoryDateFull(dateKeys[i]);
            const weekday = new Date(instant).getDay();

            const incidenceData: { [x: string]: IDataValue[] } = {};
            popsKeys.forEach(popsKey => {

                const incdnc1 = (dataRoot.data[dateKeys[i]][popsKey][0] - dataRoot.data[dateKeys[i - 1]][popsKey][0]) * 700000 / this.populations[popsKey];
                const incdnc7 = (dataRoot.data[dateKeys[i]][popsKey][0] - dataRoot.data[dateKeys[i - 7]][popsKey][0]) * 100000 / this.populations[popsKey];

                incidenceData[popsKey] = [];
                incidenceData[popsKey].push({
                    value: incdnc7,
                    label: () => FormattingDefinition.FORMATTER__FLOAT_2.format(incdnc7)
                });
                incidenceData[popsKey].push({
                    value: incdnc1,
                    label: () => FormattingDefinition.FORMATTER____FIXED.format(incdnc1 * this.populations[popsKey] / 700000)
                });

                if (instant > statsInstantMin && instant <= statsInstantMax) {

                    const cases25 = dataRoot.data[dateKeys[i + 2]][popsKey][0] - dataRoot.data[dateKeys[i - 5]][popsKey][0];
                    const cases34 = dataRoot.data[dateKeys[i + 3]][popsKey][0] - dataRoot.data[dateKeys[i - 4]][popsKey][0];
                    const cases43 = dataRoot.data[dateKeys[i + 4]][popsKey][0] - dataRoot.data[dateKeys[i - 3]][popsKey][0];
                    const incdncA = (cases25 * 25000 + cases34 * 50000 + cases43 * 25000) / this.populations[popsKey];

                    incidenceData[popsKey].push({
                        value: incdncA,
                        label: () => FormattingDefinition.FORMATTER____FIXED.format(incdncA * this.populations[popsKey] / 700000)
                    }); // average

                    stats[popsKey][weekday].addValue((incdnc1 / incdncA)); // store how far off the actual value is from the average

                    if (instant > statsInstantReg) {

                        stats[popsKey][weekday].addValue((incdnc1 / incdncA)); // store again to give more weight to more recent values store how far off the actual value is from the average

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
            this.entryKeys.push(dateKeys[i]);
            this.entries[dateKeys[i]] = new DataEntry(instant, incidenceData);
        }

        for (let i = 7; i < dateKeys.length; i++) { // each date

            const instant = TimeUtil.parseCategoryDateFull(dateKeys[i]);
            const weekday = new Date(instant).getDay();
            popsKeys.forEach(popsKey => {

                if (instant > statsInstantReg) {

                    if (!rgres[popsKey]) {
                        rgres[popsKey] = regression.polynomial(rdata[popsKey], { order: 2 });
                        console.log(popsKey, rdata[popsKey], rgres[popsKey]);
                    }

                    const rgresX = this.toRegressionX(instant, statsInstantMin, statsInstantMax);
                    // const rgresY = (rgres[popsKey].equation[0] * Math.pow(rgresX, 3) + rgres[popsKey].equation[1] * Math.pow(rgresX, 2) + rgres[popsKey].equation[2] * rgresX + rgres[popsKey].equation[3]) * 1000;
                    const rgresY = (rgres[popsKey].equation[0] * Math.pow(rgresX, 2) + rgres[popsKey].equation[1] * rgresX + rgres[popsKey].equation[2]) * 1000;
                    // const rgresY = (rgres[popsKey].equation[0] * Math.pow(Math.E, rgres[popsKey].equation[1] * rgresX)) * 1000;

                    // const casesAv = this.entries[dateKeys[i]].getValue(popsKey, 2);
                    const ratioAL = stats[popsKey][weekday].getAverage() - stats[popsKey][weekday].getStandardDeviation();
                    const ratioAU = stats[popsKey][weekday].getStandardDeviation() * 2;
                    // if (popsKey === '#') {
                    //     console.log(popsKey, weekday, stats[popsKey][weekday].getStandardDeviation());
                    // }

                    this.entries[dateKeys[i]].addValue(popsKey, {
                        value: rgresY,
                        label: () => FormattingDefinition.FORMATTER____FIXED.format(rgresY * this.populations[popsKey] / 700000)
                    }); // regression
                    this.entries[dateKeys[i]].addValue(popsKey, {
                        value: rgresY * ratioAL,
                        label: () => FormattingDefinition.FORMATTER____FIXED.format(rgresY * ratioAL * this.populations[popsKey] / 700000)
                    }); // lower expectation
                    this.entries[dateKeys[i]].addValue(popsKey, {
                        value: rgresY * ratioAU,
                        label: () => FormattingDefinition.FORMATTER____FIXED.format((rgresY * ratioAL + rgresY * ratioAU) * this.populations[popsKey] / 700000)
                    }); // upper expectation

                } else {

                    this.entries[dateKeys[i]].addValue(popsKey, {
                        value: 0,
                        label: () => ''
                    }); // regression
                    this.entries[dateKeys[i]].addValue(popsKey, {
                        value: 0,
                        label: () => ''
                    }); // lower expectation                    
                    this.entries[dateKeys[i]].addValue(popsKey, {
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
                if (popsKey === '#') {
                    console.log(TimeUtil.formatCategoryDateFull(instant), popsKey, weekday, ratioAv, Math.round(rgresY * ratioAv * this.populations[popsKey] / 700000));
                }

                // console.log(TimeUtil.formatCategoryDateFull(instant), popsKey, Math.round(rgresY * ratioAv)); // expectation 

            });

        }

        this.minY = dataRoot.minY;
        this.maxY = dataRoot.maxY;

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
        return this.populations[key];
    }

    getMinY(): number {
        return this.minY;
    }
    getMaxY(): number {
        return this.maxY;
    }

    getEntryByDate(date: string): IDataEntry {
        return this.entries[date];
    }

    getEntryByInstant(instant: number): IDataEntry {
        return this.entries[TimeUtil.formatCategoryDateFull(instant)];
    }

    getEntryKeys(): string[] {
        return this.entryKeys;
    }

    getIndexKeyset(): IKeysetIndex {
        return this.indexKeyset;
    }

    getKeysetKeys(): string[] {
        return this.keysetKeys;
    }

    getValidInstant(instant: number): number {

        instant = Math.max(instant, this.instantMin);
        instant = Math.min(instant, this.instantMax);

        // that very date not contained
        const categoryFullDate = TimeUtil.formatCategoryDateFull(instant);
        if (this.entryKeys.indexOf(categoryFullDate) < 0) {

            let curInstantDif: number;
            let minInstantDif = Number.MAX_SAFE_INTEGER;
            let entryInstant: number;
            let minInstant: number;
            for (let i = 0; i < this.entryKeys.length; i++) {
                entryInstant = this.entries[this.entryKeys[i]].getInstant(); // parseInt(entryKey); // TimeUtil.parseCategoryDateFull(date);
                curInstantDif = Math.abs(entryInstant - instant);
                if (curInstantDif < minInstantDif) {
                    minInstantDif = curInstantDif;
                    minInstant = entryInstant;
                } else {
                    break;
                }
            }
            instant = minInstant;

        }

        return instant;

    }

    getInstantMin(): number {
        return this.instantMin;
    }

    getInstantMax(): number {
        return this.instantMax;
    }

    getKeyset(key: string): IKeyset {
        return this.keysets[key];
    }

}