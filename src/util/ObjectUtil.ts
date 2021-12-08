export class ObjectUtil {

    static createId(): string {
        return Math.round(Math.random() * 1000000).toString(16);
    }

}