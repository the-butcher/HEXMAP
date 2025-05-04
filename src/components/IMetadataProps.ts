import { IColorScale } from "../util/IColorScale"

export interface IMetadataProps {
    title: string,
    source: string
    colorScale?: IColorScale;
}