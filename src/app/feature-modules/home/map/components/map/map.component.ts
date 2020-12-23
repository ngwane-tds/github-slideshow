import { Component, OnInit, ElementRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { loadModules } from 'esri-loader';

import { ResizeHandlerService } from 'src/app/core/services/resize-handler.service';
import * as fromHome from '../../../state/home.reducer';
import * as homeActions from '../../../state/home.actions';
import { MapService } from '../../services/map.service';
import { TableService } from '../../../services/table.service';
import { HomeTableFilteringService } from '../../../services/home-table-filtering-service.service';
import { LayerService } from '../../services/layer.service';
import { ConfigLayer } from '../../models/layers';
import { ArcGISTokenService } from '../../services/arcgis-token.service';
import { ArcGISTokenResponse } from '../../models/arcgis-token-response';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  contracts$: any;
  isMapLoading: BehaviorSubject<boolean> = new BehaviorSubject(true);
  constructor(
    private el: ElementRef,
    private arcGISTokenService: ArcGISTokenService,
    private mapService: MapService,
    private resizeHandler: ResizeHandlerService,
    private store: Store<fromHome.State>,
    private tableService: TableService,
    private layerService: LayerService,
    private homeTableFilteringService: HomeTableFilteringService
  ) {
    this.resizeHandler.registerMapElement(this.el.nativeElement);
  }
  private zoom: __esri.Zoom;
  showBasemapGallery = false;
  showLegend = false;
  layers: ConfigLayer[];
  secureLayers: any[];
  featureLayers: __esri.FeatureLayer[];
  arcGISToken: ArcGISTokenResponse;

  // project filters
  private projectsFilterApplied = false;
  private currentProjectAttributes: any [] = [];

  async ngOnInit() {
    const [
      Map,
      Zoom,
      Basemap,
      BasemapGallery,
      LocalBasemapsSource,
      Legend,
      LegendViewModel
    ] = await loadModules([
      'esri/Map',
      'esri/widgets/Zoom',
      'esri/Basemap',
      'esri/widgets/BasemapGallery',
      'esri/widgets/BasemapGallery/support/LocalBasemapsSource',
      'esri/widgets/Legend',
      'esri/widgets/Legend/LegendViewModel'
    ]);

    // Create a Map instance
    const layers = await this.layerService.layers;
    this.layers = layers;

    // config tokens for secure layers
    this.secureLayers = layers.filter((x) => {
      if (typeof x.isSecure === 'boolean') {
        return x.isSecure;
      }
    });
    const secureUrls = this.secureLayers.map((x) => {
      return x.layer.url;
    });

    await this.configEsriSecurity(secureUrls);

    this.featureLayers = this.layers
      .filter((l) => {
        return l.layer.visible;
      })
      .map((l) => {
        if (!l.layer.popupTemplate) {
          // initialize popupTemplates so it isn't null.
          l.layer.popupTemplate = {};
        }
        return l.layer as __esri.FeatureLayer;
      });

    const map: __esri.Map = new Map({
      basemap: 'gray-vector',
      layers: this.featureLayers
    });
    await this.mapService.init(map, this.el.nativeElement);
    const view = this.mapService.view;
    const componentRef = this;
    view.watch('updating', (mapLoading: boolean) => {
      if (mapLoading) {
        componentRef.isMapLoading.next(true);
      } else {
        componentRef.isMapLoading.next(false);
        componentRef.store
          .pipe(select(fromHome.getIsMapViewReady))
          .subscribe((isMapViewReady: boolean) => {
            if (!isMapViewReady) {
              componentRef.store.dispatch(
                new homeActions.GetIsMapViewReady(true)
              );
            }
          });
      }
    });

    // order layers by title, this only will affect the layer toggle control, do this after adding to map
    const layersSorted = this.layers.sort((a, b) =>
      a.layer.title > b.layer.title ? 1 : b.layer.title > a.layer.title ? -1 : 0
    );
    this.layers = layersSorted;

    const legend: __esri.Legend = new Legend({
      view,
      container: 'legendContainer',
      viewModel: new LegendViewModel({
        view
      }),
      // layerInfo: this.layers
      layerInfo: [
        {
          layer: this.layers,
          title: ''
        }
      ]
    });

    this.zoom = new Zoom({ view });

    const basemapGallery: __esri.BasemapGallery = new BasemapGallery({
      view,
      container: 'basemapGallery',
      source: new LocalBasemapsSource({
        basemaps: [
          Basemap.fromId('satellite'),
          Basemap.fromId('hybrid'),
          Basemap.fromId('gray-vector'),
          Basemap.fromId('dark-gray-vector'),
          Basemap.fromId('streets-vector'),
          Basemap.fromId('topo-vector')
        ]
      })
    });

    // get filtered projects
    this.store
      .pipe(select(fromHome.getProjects))
      .subscribe((projects: any) => {
        const hasFilter = projects.hasNoFilterResults;
        if (projects && projects.attributes && projects.attributes.length > 0) {
          this.currentProjectAttributes = projects.attributes;
          if (this.projectsFilterApplied && hasFilter) {
            this.mapService.projectsFilterApply(this.currentProjectAttributes);
          } else {
            this.mapService.projectsFilterClear();
          }
        }
      });

    // check if filter applied
    this.store
      .pipe(select(fromHome.getHasFilterResults))
      .subscribe((hasFilter: boolean) => {
        this.projectsFilterApplied = hasFilter;
      });

  }

  zoomIn() {
    this.zoom.zoomIn();
  }

  zoomOut() {
    this.zoom.zoomOut();
  }

  goHome() {
    this.mapService.goHome();
  }

  toggleBasemapGallery() {
    this.showBasemapGallery = !this.showBasemapGallery;
  }

  toggleLegend() {
    this.showLegend = !this.showLegend;
  }

  toggleLayer(evt: Event, layerInfo: ConfigLayer) {
    evt.stopPropagation();
    const layer = layerInfo.layer;
    const visible = layer.visible;
    const title = layer.title;
    layer.visible = !visible;
    const oldLayerState = this.featureLayers.find(
      (prevLayer: any) => prevLayer.title === title
    );
    oldLayerState.visible = layer.visible;
    // this.homeTableFilteringService.filter();
  }

  private async configEsriSecurity(secureLayerUrls: string[]) {
    // get a token
    this.arcGISToken = await this.arcGISTokenService.getTokenAuthorized();
    if (this.arcGISToken.token) {
      const esriConfig = await this.addEsriInterceptors(secureLayerUrls);
      return esriConfig;
    } else {
      const msg = 'Access to secure services failed, unable to get token';
      console.error(msg);
      alert(msg);
      // remove secure layers from layers array
      const nonSecureLayers = this.layers.filter((x) => {
        if (typeof x.isSecure === 'boolean') {
          return !x.isSecure;
        }
      });
      this.layers = nonSecureLayers;
    }
  }

  private async addEsriInterceptors(secureUrls: string[]) {
    const [esriConfig] = await loadModules(['esri/config']);
    // const featureLayerUrl = 'https://gis.sandag.org/sdgis/rest/services/BMP/BMP_Project/FeatureServer/0';
    // esriConfig.request.trustedServers.push('https://gis.sandag.org');
    const self = this;
    esriConfig.request.interceptors.push({
      // set the `urls` property to the URL of the FeatureLayer so that this
      // interceptor only applies to requests made to the FeatureLayer URL
      urls: secureUrls,
      // use the BeforeInterceptorCallback to check if the query of the
      // FeatureLayer has a maxAllowableOffset property set.
      // if so, then set the maxAllowableOffset to 0
      async before(params: any) {
        // add the token to the query
        if (params.requestOptions.query) {
          const expired = self.arcGISTokenService.isTokenExpired();
          if (!expired) {
            params.requestOptions.query.token = self.arcGISToken.token;
          } else {
            console.log(
              `Refreshing, ArcGIS Token Expired: ${expired}, expired at: ${self.arcGISToken.expires}`
            );
            self.arcGISToken = await self.arcGISTokenService.getTokenAuthorized();
            params.requestOptions.query.token = self.arcGISToken.token;
          }
        }
      }
    });
  }
}
