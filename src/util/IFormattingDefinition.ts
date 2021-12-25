
/**
 * definition for formatters that can accept an array of numeric values and format them in a user-friendly way
 * 
 * @author h.fleischer
 * @since 14.12.2021
  */
export interface IFormattingDefinition {

    format(value: number): string;

    /**
     * an amcharts 5
     * https://www.amcharts.com/docs/v5/concepts/formatters/formatting-numbers/
     * compatible format string
     */
    chartFormat: string;


}
