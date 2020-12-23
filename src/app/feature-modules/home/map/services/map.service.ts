import { Injectable, ElementRef } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { loadModules } from 'esri-loader';

import { CacheService } from '../../../../core/services/cache.service';
import { config } from '../map.config';
import { ConfigLayer } from '../models/layers';
import { LayerService } from './layer.service';
import { SKETCH_LAYER_TITLE, DEFAULT_BMP_DEF_QUERY } from '../layer.config';
import * as fromHome from '../../state/home.reducer';
import * as homeActions from '../../state/home.actions';
import { BmpUpdateGISAttributes } from '../models/bmp-project-attributes';
import { environment } from 'src/environments/environment';
import { MapMode } from '../../types/home.mode.types';

@Injectable({
  providedIn: 'root'
})
export class MapService {
  constructor(
    private layerService: LayerService,
    private store: Store<fromHome.State>,
    private cacheService: CacheService
    ) {
    this.initLayerConfig();
  }

  public view: __esri.MapView;
  public projectLayers: __esri.FeatureLayer[] = [];
  private highlightedFeatures: __esri.Handle[] = [];
  private home: __esri.Home;
  private layerConfig: ConfigLayer[];
  private isMapViewReady = false;
  private mapMode: MapMode = null;

  async init(map: __esri.Map, container: ElementRef) {
    const [MapView, Home] = await loadModules([
      'esri/views/MapView',
      'esri/widgets/Home'
    ]);

    // get map ready
    this.store
    .pipe(select(fromHome.getIsMapViewReady))
    .subscribe(async (isMapViewReady: boolean) => {
      if (isMapViewReady) {
        this.isMapViewReady = isMapViewReady;
        await this.initProjectLayers();
      }
    });

    // get map mode, nav vs. editing - controls click handler
    this.store
    .pipe(select(fromHome.getMapMode))
    .subscribe(async (mapMode: MapMode) => {
      if (mapMode) {
        this.mapMode = mapMode;
      }
    });

    const view = new MapView({
      map,
      container, // instance of component instead of DOM element
      ...config.map
    });

    this.home = new Home({ view });
    await this.clearMapFilter(); // make sure layers are reset incase there were filters on them
    this.view = view;
    // bind view events - WARNING -> This collides with geometry editing...TO DO - Disable View Clicks whenGeometry Editing
    this.addViewEventHandlers();
    return this.view;
  }

  async clearMapFilter() {
    // const layers = await this.layerService.layers;
    // layers.forEach((l) => (l.layer.visible = true));
    this.highlightClear();
    this.goHome();
  }

  async getGeoFenceLayer(): Promise<__esri.FeatureLayer> {
    const layerConfig = this.layerConfig.filter(l => l.isGeofenceLayer)[0];
    const layer = this.view.allLayerViews.find((lv: __esri.LayerView) => {
        return lv.layer.title === layerConfig.layer.title;
      }).layer as __esri.FeatureLayer;
    return new Promise(resolve => {
      resolve(layer);
    });
  }

  private clearSketchGraphicsLayer() {
    const layer = this.view.allLayerViews
    .find((lv: __esri.LayerView) => {
      return lv.layer.title.toLowerCase() === SKETCH_LAYER_TITLE.toLowerCase();
    }).layer as __esri.GraphicsLayer;
    if (layer) {
      layer.removeAll();
    }
  }

  // doesn't actually delete it, just changes attribute
  async deleteProject(projectNumber: string) {
    console.log('Map Service Delete Project ->', projectNumber);
    const where = `ProjectNumber = '${projectNumber}' AND (IsDeleted IS NULL OR IsDeleted = 0)`;
    const res = await this.projectsLayerQueryFeatures(where);
    const userInfo = this.cacheService.getUserInfo();
    await Promise.all(
      res.map(async (result) => {
        if (result.features.length === 1) {
          try {
            const feature = result.features[0] as __esri.Graphic;
            const featureLayer = this.projectLayers.filter(l => l.id === feature.layer.id)[0];
            if (featureLayer) {
              const bmpUpdate: BmpUpdateGISAttributes = {
                OBJECTID: feature.attributes.OBJECTID, // required for update
                ModifiedDate: Date.now(),
                ModifiedByID: userInfo.userId,
                IsDeleted: 1
              };
              feature.attributes = bmpUpdate;
              const params: any = {updateFeatures: [feature]};
              const updateResult = await featureLayer.applyEdits(params);
              featureLayer.refresh();
              this.clearSketchGraphicsLayer();
              if (environment.isLocalHost) {
                console.log('Delete Project Result ->', updateResult);
              }
            }
          } catch (err) {
            console.error('Delete Project Update Error ->', err);
          }
        }
      })
    );
  }

  async projectsFilterApply(attributes: any[]) {
    // only apply once ready
    if (this.projectLayers.length > 0) {
      // build def query
      const projectNumbers = attributes.map(a => '\'' + String(a.projectNumber) + '\'').join(',');
      const defQuery = `ProjectNumber in (${projectNumbers}) AND (${DEFAULT_BMP_DEF_QUERY})`;
      this.projectLayers.forEach(l => l.definitionExpression = defQuery);
      if (environment.isLocalHost) {
        console.log('Project Filter Applied');
      }
    }
  }

  async projectsFilterClear() {
    // only apply once ready
    if (this.projectLayers.length > 0) {
      this.projectLayers.forEach(l => l.definitionExpression = DEFAULT_BMP_DEF_QUERY);
      if (environment.isLocalHost) {
        console.log('Project Filter Cleared');
      }
    }
  }

  async projectsLayerQueryFeatures(where: string): Promise<__esri.FeatureSet[]> {
    if (environment.isLocalHost) {
      console.log('Projects Layer Query');
    }
    // check if layer needs init
    if (this.projectLayers.length < 1) {
       await this.initProjectLayers();
    }
    const data = await Promise.all(
      this.projectLayers.map(async (layer) => {
        const query = layer.createQuery();
        query.where = where;
        query.outSpatialReference = this.view.spatialReference;
        return await layer.queryFeatures(query);
      })
    );
    return data;
  }

  async zoomToRecordById(projectId: number) {
    const where = `ProjectID = ${projectId}`;
    const results = await this.projectsLayerQueryFeatures(where);
    results.forEach(async (r) => {
      if (r.features.length > 0) {
        await this.view.goTo(r.features[0].geometry);
      }
    });
  }

  async zoomToRecord(projectNumber: string) {
    const where = `ProjectNumber = '${projectNumber}'`;
    const results = await this.projectsLayerQueryFeatures(where);
    results.forEach(async (r) => {
      if (r.features.length > 0) {
        await this.view.goTo(r.features[0].geometry);
      }
    });
  }

  async highlightProject(projectNumber: string) {
    const where = `ProjectNumber = '${projectNumber}'`;
    const results = await this.projectsLayerQueryFeatures(where);
    this.highlightClear();
    results.forEach(async (r) => {
      if (r.features.length === 1) {
        const feature = r.features[0] as __esri.Graphic;
        const projectLayerView = this.view.allLayerViews.find(l => {
          return l.layer.id === feature.layer.id;
        }) as __esri.FeatureLayerView;
        const higlight = projectLayerView.highlight(feature);
        this.highlightedFeatures.push(higlight);
      }
    });
  }

  highlightClear() {
    if (this.highlightedFeatures.length) {
      this.highlightedFeatures.forEach((feat) => feat.remove());
      this.highlightedFeatures = [];
    }
  }

  goHome() {
    if (this.home && this.home.viewModel.state !== 'disabled') {
      this.home.go();
    }
  }

  private async initLayerConfig() {
    this.layerConfig = await this.layerService.layers;
  }

  private addViewEventHandlers() {
    this.view.when((_: any) => {
      this.view.on('click', event => {
        if (this.mapMode === MapMode.navMode) {
          this.view.hitTest(event).then(response => {
            if (response.results.length) {
              const graphic = response.results.filter(result => {
                const projectLayer = this.projectLayers.find(p => p.id === result.graphic.layer.id);
                if (projectLayer) {
                  // check if the graphic belongs to the layer of interest
                  return result.graphic.layer.id === projectLayer.id;
                }
              });
              if (graphic.length > 0) {
                const projectGraphic = graphic[0].graphic;
                this.store.dispatch(new homeActions.MapProjectLayerClick(projectGraphic.attributes));
              }
            }
          });
        }
      });
    });
  }

  private async initProjectLayers(): Promise<__esri.FeatureLayer[]> {
    return new Promise((resolve, reject) => {
      if (this.isMapViewReady) {
        const layerTitles = this.layerConfig.filter(l => l.isProjectLayer).map(l => l.layer.title);
        if (this.projectLayers.length < 1) {
          this.view.allLayerViews.forEach((lv: __esri.LayerView) => {
            const layerTitle = lv.layer.title;
            if (layerTitles.indexOf(layerTitle) > -1) {
              this.projectLayers.push(lv.layer as __esri.FeatureLayer);
            }
          });
          this.store.dispatch(new homeActions.GetGisProjectsLayerReady(true));
        }
        if (!this.projectLayers) {
          const msg = `Unable to fetch Project Layers`;
          console.error(msg);
          reject(msg);
        }
        resolve(this.projectLayers);
      }
    });
  }

}
