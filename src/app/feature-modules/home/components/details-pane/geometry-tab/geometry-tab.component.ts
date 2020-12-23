import { Component, OnDestroy, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { FormGroup, FormBuilder } from '@angular/forms';
import { BehaviorSubject, Subscription } from 'rxjs';
import { loadModules } from 'esri-loader';

import { AuthHttpService } from '../../../../../core/services/auth-http.service';
import { DialogService  } from '../../../../../core/services/dialog.service';
import { RoleService } from '../../../../../core/services/role.service';
import { UserInfo } from 'src/app/shared/models/user';
import * as fromHome from '../../../state/home.reducer';
import * as homeActions from '../../../state/home.actions';
import { MapService } from '../../../map/services/map.service';
import { GeometryService } from '../../../map/services/geometry.service';
import { BmpUpdateGISAttributes, BmpCreateGISAttributes } from '../../../map/models/bmp-project-attributes';
import { environment } from '../../../../../../environments/environment';
import { HomeMode, DetailMode, MapMode } from '../../../types/home.mode.types';
import { SKETCH_LAYER_TITLE } from '../../../map/layer.config';
import { SubmitResult } from 'src/app/shared/models/submit-result';
import { ProjectStatusType} from 'src/app/feature-modules/home/types/home.lookup.types';

const GEOM_TYPE_POINT = 'point';
const GEOM_TYPE_POLYLINE = 'polyline';

@Component({
  selector: 'app-geometry-tab',
  templateUrl: './geometry-tab.component.html',
  styleUrls: ['./geometry-tab.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GeometryTabComponent implements OnDestroy, OnInit {
  private subs: Subscription[] = [];

  constructor(
    private authHttpService: AuthHttpService,
    private cdr: ChangeDetectorRef,
    private dialogService: DialogService,
    private geometryService: GeometryService,
    private fb: FormBuilder,
    private mapService: MapService,
    private store: Store<fromHome.State>,
    private roleService: RoleService
  ) { }

  // editing
  sketchVM: __esri.SketchViewModel = null;
  sketchGraphicsLayer: __esri.GraphicsLayer = null;
  featureLayerPoint: __esri.FeatureLayer = null;
  featureLayerLine: __esri.FeatureLayer = null;
  geoFenceLayer: __esri.FeatureLayer = null;
  geoFenceGraphic: __esri.Graphic = null;
  // not implemented
  geometryForm: FormGroup = this.fb.group({
    geometryNotes: '',
  });

  // graphics
  pointSymbol: any = {
    type: 'simple-marker',
    style: 'circle',
    size: 10,
    color: [255, 0, 0], // red
    outline: {
     color: [255, 255, 255], // white
      width: 1
    }
  };

  polyLineSymbol: any = {
    type: 'simple-line',  // autocasts as new SimpleLineSymbol()
    color: 'lightblue',
    width: '2px',
    style: 'solid'
  };

  // state
  canEdit = new BehaviorSubject(false); // controls access to edit tools
  isUpdating = new BehaviorSubject(false); // track geometry updating
  isCreateNew = new BehaviorSubject(false); // track geometry creation vs. updating
  hasGeometry = new BehaviorSubject(false); // track if we have geometry
  loaded = new BehaviorSubject(false); // set at end of sketchVM init
  hasPermission = new BehaviorSubject(false); // checks if user has permission to edit project
  systemOpen = new BehaviorSubject(false); // checks if system is open for entry
  isAdmin = new BehaviorSubject(false); // checks if user is admin
  isMapViewReady = false; // only allow editing when map view is ready
  isExistingProject = false;  // controls the firing of a query to get current project geom

  // props
  projectGeometryType: string = null; // display geom type
  activeSketchGraphic: __esri.Graphic = null; // active graphic so we can reset if intersect fails
  userInfo: UserInfo = null; // user info to attribute / query by
  projectId: number = null; // used for storing id with Geom
  projectNumber: string = null; // used for storing id with Geom

  async ngOnInit() {
    this.userInfo = this.roleService.getUserInfo();
    this.isAdmin.next(this.roleService.isUserAdmin());
    this.subs.push(
      this.canEdit.subscribe(_ => this.cdr.markForCheck()),
      this.isUpdating.subscribe(_ => this.cdr.markForCheck()),
      this.isCreateNew.subscribe(_ => this.cdr.markForCheck()),
      this.hasGeometry.subscribe(_ => this.cdr.markForCheck()),
      this.loaded.subscribe(_ => this.cdr.markForCheck()),
      this.hasPermission.subscribe(_ => this.cdr.markForCheck()),
      // system open
      this.store
      .pipe(select(fromHome.systemIsOpen))
      .subscribe((systemOpen: any) => {
        if (typeof systemOpen === 'boolean') {
          this.systemOpen.next(systemOpen);
        }
      }),
      // get map ready
      this.store
      .pipe(select(fromHome.getIsMapViewReady))
      .subscribe((isMapViewReady: boolean) => {
        if (isMapViewReady) {
          this.isMapViewReady = isMapViewReady;
        }
      }),
      // get home mode
      this.store
      .pipe(select(fromHome.getHomeMode))
      .subscribe(async (mode: any) => {
        if (mode && mode.homeMode === HomeMode.detailsMode) {
          if (environment.isLocalHost) {
            console.log('Home Mode -> ', mode);
          }
          // new project
          if (mode && mode.detailMode === DetailMode.addMode) {
            this.isExistingProject = false;
            this.projectId = null;
            this.projectNumber = null;
          } else {
            this.isExistingProject = mode.detailMode === DetailMode.infoMode ? true : false;
          }
          await this.initSketchVM();
        }
        // switch back to 'table' mode ie close the detail pane
        if (mode && mode === HomeMode.tableMode) {
          // clear the graphics layer
          this.updateSketchGraphicsLayer([]);
        }
      }),
      // get existing project
      this.store
        .pipe(select(fromHome.getSelectedProject))
        .subscribe(async (project) => {
          if (!project) {
            this.projectId = null;
            this.projectNumber = null;
            // clear graphics
            this.updateSketchGraphicsLayer([]);
            this.canEdit.next(false);
            // this.cdr.markForCheck();
          }
          if (project && project.projectId) {
            this.isExistingProject = true;
            this.projectId = Number(project.projectId);
            this.projectNumber = project.project.projectNumber;
            await this.initSketchVM(project);
          }
        }),
      // get project save
      this.store
        .pipe(select(fromHome.projectSaveSuccess))
        .subscribe(async (result: any) => {
          if (result && result.projectId) {
            if (environment.isLocalHost) {
              console.log('Project Save -> ', result);
            }
            this.canEdit.next(true);
            this.hasPermission.next(true);
            this.projectId = Number(result.projectId);
            this.projectNumber = result.project.projectNumber;
            await this.initSketchVM(result);
          }
        }),
        // get project submit success
        this.store
          .pipe(select(fromHome.projectSubmitSuccess))
          .subscribe(async (result: SubmitResult) => {
            if (result && result.project.projectId) {
              if (environment.isLocalHost) {
                console.log('Project Submit Success -> ', result);
              }
              this.canEdit.next(false);
              this.hasPermission.next(false);
              if (this.isAdmin.value) {
                this.hasPermission.next(true);
                this.canEdit.next(true);
              }
            }
          }),
    );
  }

  ngOnDestroy() {
    // this.subs.forEach(sub => sub.unsubscribe());
  }

  addPolylineFeature() {
    this.isCreateNew.next(true);
    this.sketchVM.create('polyline');
    this.store.dispatch(new homeActions.MapModeChange(MapMode.editMode));
  }

  addPointFeature() {
    this.isCreateNew.next(true);
    this.sketchVM.create('point');
    this.store.dispatch(new homeActions.MapModeChange(MapMode.editMode));
  }

  async updateFeature() {
    // query features
    // const results = await this.getByProjectId();
    const results = await this.getByProjectNumber();
    results.forEach(async (r) => {
      if (r.features.length > 0) {
        const feature = r.features[0];
        await this.mapService.view.goTo(feature.geometry);
        this.activeSketchGraphic = feature.clone(); // active graphic before update
        this.updateSketchGraphicsLayer([feature]);
        const geomType = feature.geometry.type;
        if (geomType === GEOM_TYPE_POINT) {
          this.sketchVM.update([feature], {
            tool: 'move'
          });
        }
        if (geomType === GEOM_TYPE_POLYLINE) {
          this.sketchVM.update([feature], {
            tool: 'reshape'
          });
        }
        this.isUpdating.next(true);
        this.store.dispatch(new homeActions.MapModeChange(MapMode.editMode));
      }
    });
  }

  cancelEdit() {
    this.sketchVM.cancel();
    this.updateSketchGraphicsLayer([]);
    this.reset();
  }

  completeEdit() {
    this.sketchVM.complete();
    this.reset();
  }

  async deleteFeature() {
    this.dialogService.confirm({
        title: 'CONFIRM DELETE',
        message: 'Are you sure you want to delete feature?'
      }).afterClosed().subscribe(async (answer) => {
        if (answer) {

          // const results = await this.getByProjectId();
          const results = await this.getByProjectNumber();
          await Promise.all(
            results.map(async (result) => {
              if (result.features.length > 0) {
                const oids = result.features.map(r => {
                  return {
                    objectId: r.attributes.OBJECTID
                  };
                });
                const params: any = {deleteFeatures: oids};
                const geomType = result.features[0].geometry.type;
                const res = await this.applyEdits(params, geomType);
                if (res) {
                  // clear the graphics layer
                  this.updateSketchGraphicsLayer([]);
                  this.hasGeometry.next(false);
                  this.reset();
                }
              }
            })
          );

        }
    });
  }

  private reset() {
    this.isUpdating.next(false);
    this.isCreateNew.next(false);
    this.store.dispatch(new homeActions.MapModeChange(MapMode.navMode));
  }

  private async initSketchVM(project?: any) {
    this.loaded.next(false);
    if (this.isMapViewReady) {
      const [
        SketchViewModel
      ] = await loadModules([
        'esri/widgets/Sketch/SketchViewModel'
      ]);

      // result the geometry flag
      this.hasGeometry.next(false);

      // handle existing project
      if (project && project.projectId) {
        this.isExistingProject = true;
        // check if user can edit project
        this.hasPermission.next(this.roleService.canUserEditProject(project));
        if (this.hasPermission.value) {
          this.canEdit.next(true);
        }
        // check status - if submitted then disable
        if (project.project.statusId === ProjectStatusType.submittedId) {
          this.canEdit.next(false);
          this.hasPermission.next(false);
        }
      }

      // config graphic layers
      await this.configGeofenceLayer();
      await this.configEditLayers();
      this.sketchGraphicsLayer = await this.configGraphicsLayer();

      // for an existing project get current geom
      if (this.isExistingProject) {
        // const res = await this.getByProjectId();
        const res = await this.getByProjectNumber();
        if (res) {
          res.forEach(fs => {
            if (fs.features.length === 1) {
              this.updateSketchGraphicsLayer(fs.features);
              this.hasGeometry.next(true);
            }
          });
        }
      }

      if (this.sketchVM === null) {
        this.sketchVM = new SketchViewModel({
          view: this.mapService.view,
          pointSymbol: this.pointSymbol,
          polylineSymbol: this.polyLineSymbol,
          layer: this.sketchGraphicsLayer,
          updateOnGraphicClick: false,
          defaultCreateOptions: {
            mode: 'click'
          },
          defaultUpdateOptions: {
            multipleSelectionEnabled: false,
            toggleToolOnClick: false
          }
        });
        this.configSketchGraphics();
        this.addSketchVMWatchers();
      }
    }
    // reset editing states
    this.isUpdating.next(false);
    this.isCreateNew.next(false);
    this.loaded.next(true);
  }

  private configSketchGraphics() {
    const polylineSymbol: any = this.sketchVM.pointSymbol.clone();
    this.sketchVM.polylineSymbol = polylineSymbol;
    // this.sketchVM.pointSymbol = this.pointSymbol;
  }

  private async configGraphicsLayer() {
    const [
      GraphicsLayer,
    ] = await loadModules([
      'esri/layers/GraphicsLayer',
    ]);
    const sketchLayerView = this.mapService.view.allLayerViews.find(lv => {
      return lv.layer.title === SKETCH_LAYER_TITLE;
    }) as __esri.LayerView;
    // create layer if it doesn't exist
    if (!sketchLayerView) {
      const sketchLayer = new GraphicsLayer();
      sketchLayer.title = SKETCH_LAYER_TITLE;
      this.mapService.view.map.add(sketchLayer);
      return sketchLayer;
    }
    if (sketchLayerView) {
      const gl = sketchLayerView.layer as __esri.GraphicsLayer;
      gl.visible = true;
      return gl;
    }
  }

  private async configEditLayers() {
    if (this.mapService.projectLayers.length > 0) {
      // get editable layers
      this.mapService.projectLayers.forEach(l => {
        const geomType = l.geometryType.toLowerCase();
        if (geomType === GEOM_TYPE_POINT) {
          this.featureLayerPoint = l;
        }
        if (geomType === GEOM_TYPE_POLYLINE) {
          this.featureLayerLine = l;
        }
      });
    } else {
      this.dialogService.error({
        title: 'EDIT LAYER ERROR',
        message: 'Unable to access project editing layer/s.'
      });
    }
  }

  private async configGeofenceLayer() {
    // get geofence layer
    this.geoFenceLayer = await this.mapService.getGeoFenceLayer();
    const query = this.geoFenceLayer.createQuery();
    query.where = '1=1';
    const result = await this.geoFenceLayer.queryFeatures(query);
    if (result && result.features.length > 0) {
      this.geoFenceGraphic = result.features[0];
    } else {
      this.dialogService.error({
        title: 'ZONE LAYER ERROR',
        message: 'Unable to access layer for \'Geofence\'.'
      });
    }
  }

  private updateSketchGraphicsLayer(graphics: __esri.Graphic[]) {
    if (this.sketchGraphicsLayer) {
      this.sketchGraphicsLayer.removeAll();
      graphics.forEach(g => {
        this.projectGeometryType = g.geometry.type;
        if (g.geometry.type === GEOM_TYPE_POINT) {
          g.symbol = this.pointSymbol;
        }
        if (g.geometry.type === GEOM_TYPE_POLYLINE) {
          g.symbol = this.polyLineSymbol;
        }
        this.sketchGraphicsLayer.add(g);
      });
    }
  }

  private addSketchVMWatchers() {
    this.sketchVM.on('create', async (event: any) => {
      this.onFeatureCreate(event);
    });
    this.sketchVM.on('update', async (event: any) => {
      this.onFeatureUpdate(event);
    });
  }

  private async onFeatureCreate(event: any) {
    if (event.state === 'complete' && !event.aborted) {
      this.loaded.next(false);
      // check if the geometry intersects the 'geofence'
      const intersects = await this.intersectsGeofence(event.graphic);
      if (intersects) {
        // set attributes
        const graphic = this.setCreationAttributes(event.graphic);
        const params = {addFeatures: [graphic]};
        const geomType = graphic.geometry.type;
        const res = await this.applyEdits(params, geomType);
        if (res) {
          this.updateSketchGraphicsLayer([]); // clear the graphics layer
          this.activeSketchGraphic = graphic.clone(); // active graphic after create
          this.hasGeometry.next(true);
          this.isCreateNew.next(false); // switch off editing after create
        }
      } else {
        this.cancelEdit();
      }
      this.loaded.next(true);
    }
  }

  private async onFeatureUpdate(event: any) {
    // Disabled, in favor of the complete update button
    /*
    if (event.toolEventInfo &&
      (event.toolEventInfo.type === 'move-stop')) {
        this.sketchVM.complete();
    }*/
    if (event.state === 'complete' && !event.aborted) {
      this.loaded.next(false);
      const graphic = this.setUpdateAttributes(event.graphics[0]);
      // check if the geometry intersects the 'geofence'
      const intersects = await this.intersectsGeofence(graphic);
      if (intersects) {
        let sr = this.featureLayerLine.spatialReference;
        const geomType = graphic.geometry.type;
        if (geomType === GEOM_TYPE_POINT) {
          sr = this.featureLayerPoint.spatialReference;
        }
        const projected = await this.geometryService.projectGraphics([graphic], sr);
        const params = {updateFeatures: projected};
        const res = await this.applyEdits(params, geomType);
        if (res) {
          this.updateSketchGraphicsLayer([graphic]);
        }
      } else {
        // reset the graphics layer using active graphic before update
        this.updateSketchGraphicsLayer([this.activeSketchGraphic]);
      }
      this.loaded.next(true);
    }
  }

  private async intersectsGeofence(graphic: __esri.Graphic): Promise<boolean> {
    const res = await this.geometryService.doesIntersect(graphic, this.geoFenceGraphic);
    if (!res) {
      this.dialogService.error({
        title: 'ZONE ERROR',
        message: `Your project feature falls outside of layer: ${this.geoFenceLayer.title}`,
      });
    }
    return res;
  }

  private setCreationAttributes(graphic: __esri.Graphic) {
    const bmpAttributes: BmpCreateGISAttributes = {
      ProjectID: this.projectId,
      ProjectNumber: this.projectNumber,
      CreatedByID: this.userInfo.userId,
      CreatedDate: Date.now()
    };
    graphic.attributes = bmpAttributes;
    return graphic;
  }

  private setUpdateAttributes(graphic: __esri.Graphic) {
    const bmpAttributes: BmpUpdateGISAttributes = {
      OBJECTID: graphic.attributes.OBJECTID, // required for update
      ModifiedDate: Date.now(),
      ModifiedByID: this.userInfo.userId,
    };
    graphic.attributes = bmpAttributes;
    return graphic;
  }

  private async getByProjectId() {
    if (this.projectId) {
      const where = `ProjectID = ${this.projectId}`;
      return await this.mapService.projectsLayerQueryFeatures(where);
    } else {
      return;
    }
  }

  private async getByProjectNumber() {
    if (this.projectNumber) {
      const where = `ProjectNumber = '${this.projectNumber}'`;
      return await this.mapService.projectsLayerQueryFeatures(where);
    } else {
      return;
    }
  }

  private async applyEdits(params: any, geomType: string) {
    let res;
    if (geomType === GEOM_TYPE_POINT) {
      res = await this.featureLayerPoint.applyEdits(params).catch((err: any) => {
        const data = {
          title: 'APPLY EDITS ERROR',
          message: '',
          htmlMessage: `<p><b>${err.message}</b><br><br>${JSON.stringify(err.details.messages)}</p>`
        };
        this.dialogService.error(data);
        console.error(err);
      });
      this.featureLayerPoint.refresh();
      this.store.dispatch(new homeActions.GisApplyEditsSuccess(params));
    }
    if (geomType === GEOM_TYPE_POLYLINE) {
      res = await this.featureLayerLine.applyEdits(params).catch((err: any) => {
        const data = {
          title: 'APPLY EDITS ERROR',
          message: '',
          htmlMessage: `<p><b>${err.message}</b><br><br>${JSON.stringify(err.details.messages)}</p>`
        };
        this.dialogService.error(data);
        console.error(err);
      });
      this.featureLayerLine.refresh();
      this.store.dispatch(new homeActions.GisApplyEditsSuccess(params));
    }
    return res;
  }

}
