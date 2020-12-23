import { MapModuleConfig } from './models/map';

export const config: MapModuleConfig = {
    map: {
        zoom: 8,
        center: [-116.037519, 32.588705],
        highlightOptions: {
          color: [255, 255, 0, 1],
          haloOpacity: 1,
          fillOpacity: 0
        }
      }
};
