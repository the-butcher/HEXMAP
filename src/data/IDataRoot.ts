export interface IDataRoot {

    name: string;

    keys: { [K in string]: { [K in string]: string }};

    data: { [K in string]: { [K in string]: number[] }};

    path: { [K in string]: string }; 

    date: string;
    
}