import { MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { ObjectUtil } from "../util/ObjectUtil";
import { IBreadcrumbProps } from "./IBreadcrumbProps";

export default (props: IBreadcrumbProps) => {

    const { name, onPathChange, source } = props;

    const handleValueChange = (event: SelectChangeEvent<string> | Event) => {
        onPathChange(source, name, (event.target as any).value);
    }

    const items: JSX.Element[] = [];
    Object.keys(props.keys).forEach(key => {
      items.push(<MenuItem key={ObjectUtil.createId()} value={key}>{props.keys[key]}</MenuItem>);
    });    

    return (
        <Select key={name} variant='standard' value={props.path} onChange={handleValueChange}>
            {items}
        </Select>
    );

}