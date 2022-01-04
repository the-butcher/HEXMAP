/**
 * definition of the format that data is supposed to be provided in
 * 
 * @author h.fleischer
 * @since 30.12.2021
 */
export interface IDataRoot {

    keys: { [K in string]: { [K in string]: string }};

    pops: { [K in string]: number };

    data: { [K in string]: { [K in string]: number[] }};

    idxs: string[];

    indx: number;

    minY: number;

    maxY: number;
    
}