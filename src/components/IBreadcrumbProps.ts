import { IKeyset } from "../data/IKeyset";

export interface IBreadcrumbProps {

    source: string;
    
    name: string;

    keys: IKeyset;
    
    path: string;

    onPathChange: (source: string, key: string, path: string) => void;

}