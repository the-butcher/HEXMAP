import { MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { IBreadcrumbProps } from "./IBreadcrumbProps";

export default (props: IBreadcrumbProps) => {

    const { name, onPathChange, source } = props;

    const handleValueChange = (event: SelectChangeEvent<string> | Event) => {
        onPathChange(source, name, (event.target as any).value);
    }

    const items: JSX.Element[] = [];
    const keys = Object.keys(props.keys).sort();
    const hasCategories = false || keys.find(k => k.indexOf('#') >= 0);
    // keys.sort();
    // console.log('keys', keys);
    let key: string;
    let val: string;
    let pad: string;
    for (let keyIndex = 0; keyIndex < keys.length; keyIndex++) {
        key = keys[keyIndex];
        val = props.keys[key];
        pad = (hasCategories && key.indexOf('#') === -1) ? '30px' : '6px';
        items.push(<MenuItem key={`${key}_${keyIndex}`} value={key} style={{ paddingLeft: pad }}>{val}</MenuItem>);
    }

    return (
        <Select style={{ fontSize: '14px' }} key={name} variant='standard' value={props.path} onChange={handleValueChange}>
            {items}
        </Select>
    );

}