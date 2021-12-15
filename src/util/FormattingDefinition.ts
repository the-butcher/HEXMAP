import { IFormattingDefinition } from "./IFormattingDefinition";

export class FormattingDefinition {

    static readonly OPTIONS_FLOAT_1 = {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1
    };
    static readonly OPTIONS_FLOAT_2 = {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    };
    static readonly OPTIONS_FIXED = {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    };

    static readonly FORMATTER____FIXED: IFormattingDefinition = {
        format: values => `${values[0].toLocaleString(undefined, FormattingDefinition.OPTIONS_FIXED)}`
    }

    static readonly FORMATTER__FLOAT_2: IFormattingDefinition = {
        format: values => `${values[0].toLocaleString(undefined, FormattingDefinition.OPTIONS_FLOAT_2)}`
    }

}