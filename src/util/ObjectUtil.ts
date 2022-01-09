import { IBreadcrumbProps } from "../components/IBreadcrumbProps";
import { IChartProps } from "../components/IChartProps";
import { IIndicatorProps } from "../components/IIndicatorProps";

/**
 * utility type to centralize logic used in multiple places
 * 
 * @author h.fleischer
 * @since 09.01.2022
 */
export class ObjectUtil {

    /**
     * create a unique 6-digit id
     * @returns 
     */
    static createId(): string {
        return Math.round(Math.random() * 100000000).toString(16).substring(0, 5);
    }

    static buildIndicatorTitle(props: IChartProps): string {
        return `${props.name} nach ${props.desc}`;
    }

    static buildBreadcrumbTitle(breadcrumbProps: IBreadcrumbProps[]): string {
        let breadcrumbPropsTitle = '';
        if (breadcrumbProps && breadcrumbProps.length > 0) {
            breadcrumbPropsTitle += ObjectUtil.getBreadcrumbValue(breadcrumbProps[0]);
            for (let i = 1; i<breadcrumbProps.length; i++) {
                breadcrumbPropsTitle += ` / ${ObjectUtil.getBreadcrumbValue(breadcrumbProps[i])}`;
            }
        }
        return breadcrumbPropsTitle;
    }

    static getBreadcrumbValue(breadcrumbProps: IBreadcrumbProps): string {
        return breadcrumbProps.keys.getValue(breadcrumbProps.path);
    }

}