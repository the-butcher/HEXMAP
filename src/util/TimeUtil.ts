/**
 * utility class for managing time related units
 *
 * @author h.fleischer
 * @since 25.05.2021
 */
export class TimeUtil {

    static readonly MILLISECONDS_PER_MINUTE = 60 * 1000;
    static readonly MILLISECONDS_PER___HOUR = 60 * TimeUtil.MILLISECONDS_PER_MINUTE;
    static readonly MILLISECONDS_PER____DAY: number = 24 * TimeUtil.MILLISECONDS_PER___HOUR;
    static readonly MILLISECONDS_PER___WEEK: number = TimeUtil.MILLISECONDS_PER____DAY * 7;
    static readonly MILLISECONDS_PER___YEAR: number = TimeUtil.MILLISECONDS_PER____DAY * 365;

    static readonly DATE_LOOKUP: { [K in string]: string } = {};

    static formatCategoryDateFull(instant: number): string {
        let categoryDateFull = this.DATE_LOOKUP[instant];
        if (!categoryDateFull) {
            const date = new Date(instant);
            categoryDateFull = `${String(date.getDate()).padStart(2, '0')}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getFullYear()).padStart(2, '0')}`;
            this.DATE_LOOKUP[instant] = categoryDateFull
        }
        return categoryDateFull;
    }

    static formatCategoryDateDay(instant: number): string {
        // @ts-ignore
        return String(new Date(instant).getDate()).padStart(2, '0');
    }

    static formatConfigDate(instant: number): string {
        const date = new Date(instant);
        let ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(date);
        let mo = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(date);
        let da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(date);
        return `${ye}-${mo}-${da}`;
    }

    static parseCategoryDateFull(category: string): number {
        const parts = category.split('.');
        const ye = parts[2];
        const mo = parts[1];
        const da = parts[0];
        const dateString = `${ye}-${mo}-${da}`;
        return new Date(dateString).getTime();
    }

    static trimInstant(instant: number): number {
        return TimeUtil.parseCategoryDateFull(TimeUtil.formatCategoryDateFull(instant))
    }

}