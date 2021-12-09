export interface IBreadcrumbProps {

    source: string;
    
    name: string;

    keys: { [K in string]: string };
    
    path: string;

    onPathChange: (source: string, key: string, path: string) => void;

}