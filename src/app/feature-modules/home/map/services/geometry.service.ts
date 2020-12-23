import { Injectable } from '@angular/core';
import { loadModules } from 'esri-loader';

import { environment } from '../../../../../environments/environment';
import { MapService } from './map.service';

@Injectable({
  providedIn: 'root'
})
export class GeometryService {

  constructor(
    private mapService: MapService
  ) { }

  async projectGraphics(graphics: __esri.Graphic[], outSR: any): Promise<__esri.Graphic[]> {
    const [
      projection
    ] = await loadModules([
      'esri/geometry/projection',
    ]);
    if (environment.isLocalHost) {
      console.log('projectGraphics()');
    }
    // must call load first to use project
    await projection.load();
    const projected: any[] = [];
    graphics.forEach(g => {
      // const transformation = projection.getTransformation(g.geometry.spatialReference, outSR);
      g.geometry = projection.project(g.geometry, outSR);
      projected.push(g);
    });
    return projected;
  }

  async doesIntersect(graphic1: __esri.Graphic, graphic2: __esri.Graphic): Promise<boolean> {
    const [
      geometryEngineAsync
    ] = await loadModules([
      'esri/geometry/geometryEngineAsync',
    ]);
    if (environment.isLocalHost) {
      console.log('doesIntersect()');
    }
    const geometry1 = graphic1.geometry;
    let geometry2 = graphic2.geometry;
    // check projection
    if (geometry1.spatialReference !== geometry2.spatialReference) {
      const projected = await this.projectGraphics([graphic2], geometry1.spatialReference);
      geometry2 = projected[0].geometry;
    }
    const result = await geometryEngineAsync.intersects(geometry1, geometry2);
    return result;
  }

  async projectHasGeometry(projectNumber: string) {
    const where = `ProjectNumber = '${projectNumber}' AND (IsDeleted = 0 OR isDeleted IS NULL)`;
    const results = await this.mapService.projectsLayerQueryFeatures(where);
    if (results) {
      let hasGeom = false;
      results.forEach((fs: any) => {
        if (fs.features.length > 0) {
          hasGeom = true;
        }
      });
      return hasGeom;
    } else {
      return false;
    }
  }

}
