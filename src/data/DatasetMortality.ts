// import { FormattingDefinition } from "../util/FormattingDefinition";
// import { TimeUtil } from "../util/TimeUtil";
// import { DataEntry } from "./DataEntry";
// import { IDataEntry } from "./IDataEntry";
// import { IDataIndex } from "./IDataIndex";
// import { IDataRoot } from "./IDataRoot";
// import { IDataset } from "./IDataset";
// import { IDataValue } from "./IDataValue";
// import { IKeyset } from "./IKeyset";
// import { IKeysetIndex } from "./IKeysetIndex";
// import { KeysetGeneric } from "./KeysetGeneric";
// import { KeysetIndex } from "./KeysetIndex";

// /**
//  * implementation of IDataSet
//  * goal is to speed up things, espectially where calls for each hexagon have an impact even on a small scale
//  *
//  * @author h.fleischer
//  * @since 16.01.2021
//  */
export class DatasetMortality /* implements IDataset */ {

}

//     // private readonly dataRoot: IDataRoot;
//     private readonly populations: { [K in string]: number[] };
//     private readonly keysetKeys: string[];
//     private readonly keysets: { [K in string]: IKeyset };
//     private readonly entryKeys: string[]; // the actual formatted dates
//     private readonly entries: { [K in string]: IDataEntry };
//     private readonly indexKeyset: IKeysetIndex;

//     private readonly instantMin: number;
//     private readonly instantMax: number;
//     private readonly minY: number;
//     private readonly maxY: number;

//     constructor(dataRoot: IDataRoot) {

//         this.populations = dataRoot.pops;

//         this.keysetKeys = Object.keys(dataRoot.keys);
//         this.keysets = {};
//         this.keysetKeys.forEach(keysetKey => {
//             const defaultKey = Object.keys(dataRoot.keys[keysetKey]).sort()[0];
//             console.log('defaultKey', defaultKey);
//             this.keysets[keysetKey] = new KeysetGeneric(keysetKey, defaultKey, dataRoot.keys[keysetKey]);
//         });
//         const indexes: IDataIndex[] = ['Non-COVID / 100.000', 'COVID / 100.000',].map(k => {
//             return {
//                 name: k,
//                 isHiddenOption: false,
//                 minY: this.minY,
//                 maxY: this.maxY
//             }
//         });

//         this.indexKeyset = new KeysetIndex(1, indexes);

//         const dateKeys = Object.keys(dataRoot.data);
//         this.instantMin = TimeUtil.parseCategoryDateFull(dateKeys[1]);
//         this.instantMax = TimeUtil.parseCategoryDateFull(dateKeys[dateKeys.length - 1]);
//         this.entryKeys = [];
//         this.entries = {};
//         const popsKeys = Object.keys(this.populations);

//         for (let i = 1; i < dateKeys.length - 1; i++) { // each date

//             const instant = TimeUtil.parseCategoryDateFull(dateKeys[i]);
//             // const weekday = new Date(instant).getDay();

//             const incidenceData: { [x: string]: IDataValue[] } = {};
//             popsKeys.forEach(popsKey => {

//                 const mortCM1 = dataRoot.data[dateKeys[i - 1]][popsKey][0];
//                 const mortC00 = dataRoot.data[dateKeys[i]][popsKey][0];
//                 const mortCP1 = dataRoot.data[dateKeys[i + 1]][popsKey][0];

//                 const mortAM1 = dataRoot.data[dateKeys[i - 1]][popsKey][1] - mortCM1;
//                 const mortA00 = dataRoot.data[dateKeys[i]][popsKey][1] - mortC00;
//                 const mortAP1 = dataRoot.data[dateKeys[i + 1]][popsKey][1] - mortCP1;

//                 const incdncC = (mortCM1 * 0.25 + mortC00 * 0.50 + mortCP1 * 0.25) * 100000 / this.getPopulation(popsKey);
//                 const incdncA = (mortAM1 * 0.25 + mortA00 * 0.50 + mortAP1 * 0.25) * 100000 / this.getPopulation(popsKey);

//                 incidenceData[popsKey] = [];
//                 // incidenceData[popsKey].push({
//                 //     value: incdnc7,
//                 //     label: () => FormattingDefinition.FORMATTER__FLOAT_2.format(incdnc7)
//                 // });
//                 incidenceData[popsKey].push({
//                     noscl: incdncA,
//                     value: incdncA,
//                     label: () => FormattingDefinition.FORMATTER__FLOAT_2.format(incdncA)
//                 });
//                 incidenceData[popsKey].push({
//                     noscl: incdncC,
//                     value: incdncC,
//                     label: () => FormattingDefinition.FORMATTER__FLOAT_2.format(incdncC)
//                 });

//             });
//             this.entryKeys.push(dateKeys[i]);
//             this.entries[dateKeys[i]] = new DataEntry(instant, incidenceData);
//         }

//         this.minY = 0;
//         this.maxY = 50;

//     }

//     acceptsZero(): boolean {
//         return true;
//     }

//     // toRegressionY(cases: number): number {
//     //     return cases / 1000;
//     // }

//     // toRegressionX(instant: number, instantMin: number, instantMax: number): number {
//     //     return (instant - instantMin) / (instantMax - instantMin);
//     // }

//     getPopulation(key: string): number {
//         return this.populations[key][0];
//     }

//     getMinY(): number {
//         return this.minY;
//     }
//     getMaxY(): number {
//         return this.maxY;
//     }

//     getEntryByDate(date: string): IDataEntry {
//         return this.entries[date];
//     }

//     getEntryByInstant(instant: number): IDataEntry {
//         return this.entries[TimeUtil.formatCategoryDateFull(instant)];
//     }

//     getEntryKeys(): string[] {
//         return this.entryKeys;
//     }

//     getIndexKeyset(): IKeysetIndex {
//         return this.indexKeyset;
//     }

//     getKeysetKeys(): string[] {
//         return this.keysetKeys;
//     }

//     getValidInstant(instant: number): number {

//         instant = Math.max(instant, this.instantMin);
//         instant = Math.min(instant, this.instantMax);

//         // that very date not contained
//         const categoryFullDate = TimeUtil.formatCategoryDateFull(instant);
//         if (this.entryKeys.indexOf(categoryFullDate) < 0) {

//             let curInstantDif: number;
//             let minInstantDif = Number.MAX_SAFE_INTEGER;
//             let entryInstant: number;
//             let minInstant: number;
//             for (let i = 0; i < this.entryKeys.length; i++) {
//                 entryInstant = this.entries[this.entryKeys[i]].getInstant(); // parseInt(entryKey); // TimeUtil.parseCategoryDateFull(date);
//                 curInstantDif = Math.abs(entryInstant - instant);
//                 if (curInstantDif < minInstantDif) {
//                     minInstantDif = curInstantDif;
//                     minInstant = entryInstant;
//                 } else {
//                     break;
//                 }
//             }
//             instant = minInstant;

//         }

//         return instant;

//     }

//     getInstantMin(): number {
//         return this.instantMin;
//     }

//     getInstantMax(): number {
//         return this.instantMax;
//     }

//     getKeyset(key: string): IKeyset {
//         return this.keysets[key];
//     }

// }