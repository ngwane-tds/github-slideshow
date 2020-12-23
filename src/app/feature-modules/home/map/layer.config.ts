import { ConfigLayer } from './models/layers';
import {
  RendererBmpZone,
  RendererBmpProjectsLine,
  RendererBmpProjectsMarker,
  RendererBmpHistoricProjectsLine,
  RendererBmpHistoricProjectsMarker,
  RendererAdminBoundaries, RendererBoundary } from './renderers/simple';
import { PopupTemplateBmpProject,
  PopupTemplateBmpHistoricLine,
  PopupTemplateBmpHistoricPoint, PopupTemplateBmpZone } from './popup-templates/pop-templates-bmp';

import { environment } from 'src/environments/environment';


// used by SketchViewModel and for selecting in MapService
export const SKETCH_LAYER_TITLE = 'Sketch Graphics';
export const DEFAULT_BMP_DEF_QUERY = 'IsDeleted = 0 OR isDeleted IS NULL';

// map layering affected by this array order
export const layerConfig: ConfigLayer[] = [
  // DISABLED BECAUSE OF HTTP vs HTTPS issue
  {
    alias: 'CA Border Cities',
    isSecure: false,
    layer: {
      title: 'CA Border Cities',
      visible: true,
      popupEnabled: false,
      url:
        'https://services.arcgis.com/rD2ylXRs80UroD90/ArcGIS/rest/services/San_Diego_County_City_Boundaries/FeatureServer/0',
      outFields: ['*'],
      renderer: RendererAdminBoundaries
    }
  },
  {
    alias: 'CA Border Counties',
    isSecure: false,
    layer: {
      visible: true,
      popupEnabled: false,
      title: 'CA Border Counties',
      definitionExpression: 'FIPS IN (\'06073\', \'06025\')',
      url:
        'https://services.arcgis.com/P3ePLMYs2RVChkJx/ArcGIS/rest/services/USA_Counties/FeatureServer',
      outFields: ['*'],
      renderer: RendererBoundary
    }
  },
  {
    alias: 'BC Border Municipalities',
    isSecure: false,
    layer: {
      visible: true,
      popupEnabled: false,
      title: 'BC Border Municipalities',
      url:
        'https://services.arcgis.com/rD2ylXRs80UroD90/arcgis/rest/services/Mexico_Municipalities_2012_View/FeatureServer/0',
      outFields: ['*'],
      renderer: RendererBoundary
    }
  },
  {
    alias: 'BMP Ten Mile Zone',
    isSecure: true,
    isGeofenceLayer: true, // used to check geometry on create
    layer: {
      visible: true,
      title: 'BMP Ten Mile Zone',
      url:
        'https://gis.sandag.org/sdgis/rest/services/BMP/TenMileZone/FeatureServer/0',
      outFields: ['*'],
      renderer: RendererBmpZone,
      popupTemplate: PopupTemplateBmpZone
    }
  },
  {
    alias: 'Historic BMP Project Line',
    isSecure: true,
    layer: {
      visible: true,
      title: 'Historic BMP Project Line',
      url:
        'https://gis.sandag.org/sdgis/rest/services/BMP/BMP_Project_2013/MapServer/1',
      outFields: ['*'],
      renderer: RendererBmpHistoricProjectsLine,
      popupTemplate: PopupTemplateBmpHistoricLine
    }
  },
  {
    alias: 'Historic BMP Project Point',
    isSecure: true,
    layer: {
      visible: true,
      title: 'Historic BMP Project Point',
      url:
        'https://gis.sandag.org/sdgis/rest/services/BMP/BMP_Project_2013/MapServer/0',
      outFields: ['*'],
      renderer: RendererBmpHistoricProjectsMarker,
      popupTemplate: PopupTemplateBmpHistoricPoint
    }
  },
  {
    alias: 'BMP Project Line',
    isSecure: true,
    isProjectLayer: true, // project layers should be editable
    layer: {
      visible: true,
      title: 'BMP_Project_Line',
      definitionExpression: DEFAULT_BMP_DEF_QUERY,
      url: environment.name.toLowerCase() === 'prod' ? 'https://gis.sandag.org/sdgis/rest/services/BMP/BMP_Project/FeatureServer/1' :
      'https://gis.sandag.org/sdgis/rest/services/BMP/BMP_Project_DEV_QA/FeatureServer/1',
      outFields: ['*'],
      renderer: RendererBmpProjectsLine,
      popupTemplate: PopupTemplateBmpProject
    }
  },
  {
    alias: 'BMP Project Point',
    isSecure: true,
    isProjectLayer: true, // project layers should be editable
    layer: {
      visible: true,
      title: 'BMP_Project_Point',
      definitionExpression: DEFAULT_BMP_DEF_QUERY,
      url: environment.name.toLowerCase() === 'prod' ? 'https://gis.sandag.org/sdgis/rest/services/BMP/BMP_Project/FeatureServer/0' :
      'https://gis.sandag.org/sdgis/rest/services/BMP/BMP_Project_DEV_QA/FeatureServer/0',
      outFields: ['*'],
      renderer: RendererBmpProjectsMarker,
      popupTemplate: PopupTemplateBmpProject
    }
  },
];
