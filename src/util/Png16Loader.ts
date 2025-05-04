import { decode } from 'fast-png';
import { IRasterData } from '../data/IRasterData';
import { ByteLoader } from './ByteLoader';

export class Png16Loader {

    async fromUrl(imageUrl: string, rasterConfig: Pick<IRasterData, 'cellsize' | 'xOrigin' | 'yOrigin'>): Promise<IRasterData> {

        const byteArray = await new ByteLoader().load(imageUrl);
        const decodedPng = decode(byteArray);
        const name = imageUrl;
        const width = decodedPng.width;
        const height = decodedPng.height;

        let pixelIndexRGB: number;
        const data = new Float32Array(width * height);
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                pixelIndexRGB = y * width + x;
                data[pixelIndexRGB] = decodedPng.data[pixelIndexRGB];
            }
        }

        return {
            ...rasterConfig,
            name,
            width,
            height,
            data
        };

    }

}