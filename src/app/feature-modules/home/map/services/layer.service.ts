import { Injectable } from '@angular/core';
import { loadModules } from 'esri-loader';
import { ConfigLayer } from '../models/layers';
import { layerConfig } from '../layer.config';

@Injectable({
  providedIn: 'root'
})
export class LayerService {
  layers: Promise<ConfigLayer[]> = this.initLayers();

  constructor() {}

  async initLayers() {
    const layers: { layer: any; isSecure: boolean}[] = [];
    const [FeatureLayer] = await loadModules(['esri/layers/FeatureLayer']);
    layerConfig.map(layer => {
      layers.push({
        ...layer,
        layer: new FeatureLayer(layer.layer)
      });
    });
    return layers;
  }
}
