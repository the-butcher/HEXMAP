import { useEffect, useRef, useState } from 'react';
import FrameComponent from './components/FrameComponent';
import { IHexagon } from './components/IHexagon';
import { IMapProps } from './components/IMapProps';
import MapComponent from './components/MapComponent';
import { AVERAGE_AGE_2024 } from './data/average_age_2024';
import { GKZ_LOOKUP } from './data/gkz_lookup';
import { Raster } from './raster/Raster';
import "./styles.css";
import { Color } from './util/Color';
import { ColorUtil } from './util/ColorUtil';
import { IRange } from './util/IRange';
import { ObjectUtil } from './util/ObjectUtil';
import { Png16Loader } from './util/Png16Loader';
import { IColorScale } from './util/IColorScale';
import { AVERAGE_AGE_2004 } from './data/average_age_2004';

/**
 * TODO :: remove appState and replace with appropriate setMapProps (may need to set a ref, then state)
 * TODO :: require a concept that can animate the lights along with color and height (maybe include lights into the hexagons component)
 */

function App() {

  const handleHexagonClicked = (hexagon: IHexagon) => {

    console.log('📞 handling hexagon clicked', hexagon, ColorUtil.LABELS[hexagon.luc]);

  }

  const mapPropsRef = useRef<IMapProps>({
    hexagonsStamp: ObjectUtil.createId(),
    // lightsStamp: ObjectUtil.createId(),
    lightProps: [
      // {
      //   id: ObjectUtil.createId(),
      //   intensity: 2,
      //   position: {
      //     x: 300,
      //     y: 100,
      //     z: -300
      //   }
      // },
      {
        id: ObjectUtil.createId(),
        intensity: 5,
        position: {
          x: -300,
          y: 100,
          z: -150
        }
      },
      {
        id: ObjectUtil.createId(),
        intensity: 5,
        position: {
          x: -303,
          y: 100,
          z: -150
        }
      }
    ],
    controlsProps: {
      id: ObjectUtil.createId(),
    },
    hexagonsProps: {
      getRgba: (hexagon: IHexagon) => [...ColorUtil.getInstance().getCorineColor(hexagon.luc).getRgb(), ColorUtil.getInstance().getCorineOpacity(hexagon.luc)],
      getZVal: (hexagon: IHexagon) => hexagon.y / 10,
      hasTransparency: true,
      onHexagonClicked: handleHexagonClicked
    },
    metadataProps: {
      title: 'Land Cover',
      source: 'Generated using European Union\'s Copernicus Land Monitoring Service information\nhttps://doi.org/10.2909/71c95a07-e296-44fc-b22b-415f42acfdf0'
    }
  });
  const [mapProps, setMapProps] = useState<IMapProps>(mapPropsRef.current);

  const [updateDimensionsTo, setUpdateDimensionsTo] = useState<number>(-1);
  const [dimensions, setDimensions] = useState({
    height: window.innerHeight,
    width: window.innerWidth
  });
  const handleResize = () => {
    window.clearTimeout(updateDimensionsTo);
    setUpdateDimensionsTo(window.setTimeout(() => {
      setDimensions({
        height: window.innerHeight,
        width: window.innerWidth
      });
    }, 250));
  }

  useEffect(() => {

  }, [dimensions]);

  useEffect(() => {

    console.debug('✨ building app component');
    window.addEventListener('resize', handleResize);

    const ageRange: IRange = {
      min: 40,
      max: 48
    };
    const toHAge = (value: number): number => {
      return ObjectUtil.mapValues(Math.min(ageRange.max, Math.max(ageRange.min, value)), ageRange, {
        min: 0.597,
        max: 0.160
      });
    };
    const toSAge = (value: number): number => {
      const centerOff = Math.min((ageRange.max - ageRange.min) / 2, Math.max(0, Math.abs(value - (ageRange.min + ageRange.max) / 2)));
      return ObjectUtil.mapValues(centerOff, {
        min: 0,
        max: (ageRange.max - ageRange.min) / 2
      }, {
        min: 0.00,
        max: 1.00
      });
    };
    const toVAge = (value: number): number => {
      return ObjectUtil.mapValues(Math.min(ageRange.max, Math.max(ageRange.min, value)), ageRange, {
        min: 0.10,
        max: 0.30
      });
    };
    const colorScaleAge: IColorScale = {
      sampleRange: ageRange,
      legendRange: {
        min: `<${ageRange.min}`,
        max: `\u2265${ageRange.max}`,
      },
      toRgbaMap: (sample: number): number[] => {
        return [...new Color(toHAge(sample), toSAge(sample), toVAge(sample)).getRgb(), 1];
      },
      toRgbaLegend: (sample: number): number[] => {
        return [...new Color(toHAge(sample), toSAge(sample), toVAge(sample) * 1.8).getRgb(), 1];
      }
    }
    const toGkz = (hexagon: IHexagon): string => {
      return GKZ_LOOKUP[hexagon.gkz] ?? hexagon.gkz;
    };

    document.addEventListener('keydown', e => {
      if (e.key === 'w') {

        new Png16Loader().fromUrl('popdens.png', {
          cellsize: 300,
          xOrigin: -301703.6374778111,
          yOrigin: 439662.4506920865
        }).then(rasterData => {

          const sampleRange = Raster.getSampleRange(rasterData); // 0 => 30392

          const colRange: IRange = {
            min: 55,
            max: 924
          };
          const rowRange: IRange = {
            min: 492,
            max: 105
          };
          const xRange: IRange = {
            min: -286975.5,
            max: 284858.7
          };
          const yRange: IRange = {
            min: 138326.9,
            max: 432383.3
          };
          const toH = (value: number): number => {
            return ObjectUtil.mapValues(value, sampleRange, {
              min: 0.12,
              max: 0.12
            });
          };
          const toS = (value: number): number => {
            return ObjectUtil.mapValues(value, sampleRange, {
              min: 0.00,
              max: 1.00
            });
          };
          const toV = (value: number): number => {
            return ObjectUtil.mapValues(value, sampleRange, {
              min: 0.80,
              max: 0.05
            });
          };
          const toRasterValue = (hexagon: IHexagon): number => {
            const xWorld = ObjectUtil.mapValues(hexagon.col, colRange, xRange);
            const yWorld = ObjectUtil.mapValues(hexagon.row + (hexagon.col % 2 === 0 ? 0.5 : 0), rowRange, yRange);
            const xRaster = Raster.getRasterX(rasterData, xWorld);
            const yRaster = Raster.getRasterY(rasterData, yWorld);
            return Raster.getRasterValue(rasterData, xRaster, yRaster);
          };

          const colorScale: IColorScale = {
            sampleRange,
            legendRange: {
              min: '0',
              max: '20000'
            },
            toRgbaMap: (sample: number): number[] => {
              return [...new Color(toH(sample), toS(sample), toV(sample)).getRgb(), 1];
            },
            toRgbaLegend: (sample: number): number[] => {
              return [...new Color(toH(sample), toS(sample), toV(sample)).getRgb(), 1];
            }
          }

          mapPropsRef.current = {
            ...mapPropsRef.current,
            hexagonsStamp: ObjectUtil.createId(),
            hexagonsProps: {
              getRgba: (hexagon: IHexagon) => colorScale.toRgbaMap(toRasterValue(hexagon)),
              getZVal: (hexagon: IHexagon) => hexagon.y / 100 + ObjectUtil.mapValues(toRasterValue(hexagon), sampleRange, {
                min: -0.2,
                max: 10
              }),
              hasTransparency: true,
              onHexagonClicked: handleHexagonClicked
            },
            metadataProps: {
              title: 'Population distribution',
              source: 'Generated using GHS-POP R2023A - GHS population grid multitemporal (1975-2030)\nhttps://data.jrc.ec.europa.eu/dataset/2ff68a52-5b5b-4a22-8f40-c41da8332cfe'
            }
          };
          setMapProps(mapPropsRef.current);

        });

      } else if (e.key === 'q') {

        mapPropsRef.current = {
          ...mapPropsRef.current,
          hexagonsStamp: ObjectUtil.createId(),
          hexagonsProps: {
            getRgba: (hexagon: IHexagon) => [...ColorUtil.getInstance().getCorineColor(hexagon.luc).getRgb(), ColorUtil.getInstance().getCorineOpacity(hexagon.luc)],
            getZVal: (hexagon: IHexagon) => hexagon.y / 10,
            hasTransparency: true,
            onHexagonClicked: handleHexagonClicked
          },
          metadataProps: {
            title: 'Land Cover',
            source: 'Generated using European Union\'s Copernicus Land Monitoring Service information\nhttps://doi.org/10.2909/71c95a07-e296-44fc-b22b-415f42acfdf0'
          }
        };
        setMapProps(mapPropsRef.current);

      } else if (e.key === 'r') {

        const toAverageAge2024 = (hexagon: IHexagon): number => {
          return AVERAGE_AGE_2024[toGkz(hexagon)];
        }

        mapPropsRef.current = {
          ...mapPropsRef.current,
          hexagonsStamp: ObjectUtil.createId(),
          hexagonsProps: {
            getRgba: (hexagon: IHexagon) => colorScaleAge.toRgbaMap(toAverageAge2024(hexagon)),
            getZVal: (hexagon: IHexagon) => hexagon.y / 100 + ObjectUtil.mapValues(toAverageAge2024(hexagon), {
              min: 40,
              max: 60
            }, {
              min: -0.5,
              max: 1.5
            }),
            hasTransparency: true,
            onHexagonClicked: handleHexagonClicked
          },
          metadataProps: {
            title: 'Average age, 2024',
            source: 'Generated using STATatlas data\nhttps://www.statistik.at/atlas/?mapid=them_bevoelkerung_alter',
            colorScale: colorScaleAge
          }
        };
        setMapProps(mapPropsRef.current);

      } else if (e.key === 'e') {

        const toAverageAge2004 = (hexagon: IHexagon): number => {
          return AVERAGE_AGE_2004[toGkz(hexagon)];
        }

        mapPropsRef.current = {
          ...mapPropsRef.current,
          hexagonsStamp: ObjectUtil.createId(),
          hexagonsProps: {
            getRgba: (hexagon: IHexagon) => colorScaleAge.toRgbaMap(toAverageAge2004(hexagon)),
            getZVal: (hexagon: IHexagon) => hexagon.y / 100 + ObjectUtil.mapValues(toAverageAge2004(hexagon), {
              min: 40,
              max: 60
            }, {
              min: -0.5,
              max: 1.5
            }),
            hasTransparency: true,
            onHexagonClicked: handleHexagonClicked
          },
          metadataProps: {
            title: 'Average age, 2004',
            source: 'Generated using STATatlas data\nhttps://www.statistik.at/atlas/?mapid=them_bevoelkerung_alter',
            colorScale: colorScaleAge
          }
        };
        setMapProps(mapPropsRef.current);

      }
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  return (
    <div
      style={{
        height: '100%',
        width: '100%',
        backgroundColor: 'red'
      }}
    >
      <MapComponent {...mapProps} />
      <FrameComponent {...mapProps} />
    </div>
  );

};

export default App;