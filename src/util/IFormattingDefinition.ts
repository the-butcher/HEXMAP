
/**
 * definition for formatters that can accept an array of numeric values and format them in a user-friendly way
 * 
 * @author h.fleischer
 * @since 14.12.2021
  */
export interface IFormattingDefinition {
    format(values: number[]): string;
}
