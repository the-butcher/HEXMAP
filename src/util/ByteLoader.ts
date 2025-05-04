/**
 * utility type for loading an array of bytes from a given url
 *
 * @author h.fleischer
 * @since 21.07.2019
 */
export class ByteLoader {

    /**
     * load from the given url and return a promise resolving to an instance of Uint8Array
     * @param url
     */
    async load(url: string): Promise<Uint8Array> {
        return new Promise(function (resolve, reject) {
            const xhr = new XMLHttpRequest();
            xhr.responseType = 'arraybuffer';
            xhr.open('GET', url);
            xhr.onload = function () {
                if (this.status >= 200 && this.status < 300) {
                    resolve(new Uint8Array(xhr.response));
                } else {
                    reject({
                        status: this.status,
                        statusText: xhr.statusText
                    });
                }
            };
            xhr.onerror = function () {
                reject({
                    status: this.status,
                    statusText: xhr.statusText
                });
            };
            xhr.send();
        });
    }

}