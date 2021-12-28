export interface IDataRoot {

    keys: { [K in string]: { [K in string]: string }};

    data: { [K in string]: { [K in string]: number[] }};

    idxs: string[];

    indx: number;

    path: { [K in string]: string }; 

    date: string;

    minY: number;

    maxY: number;
    
}