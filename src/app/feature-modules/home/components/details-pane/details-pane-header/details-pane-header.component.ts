import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

import { Store, select } from '@ngrx/store';
import { AuthHttpService } from '../../../../../core/services/auth-http.service';
import { DialogService } from '../../../../../core/services/dialog.service';
import { RoleService } from '../../../../../core/services/role.service';
import { UserInfo } from '../../../../../shared/models/user';
import * as fromHome from '../../../state/home.reducer';
import { GeometryService } from '../../../map/services/geometry.service';
import { MapService } from '../../../map/services/map.service';
import { environment } from '../../../../../../environments/environment';
import { HomeMode, DetailMode } from '../../../types/home.mode.types';
import { ProjectStatusType } from '../../../types/home.lookup.types';
import { SubmitResult } from 'src/app/shared/models/submit-result';

const PROJECT_STATUS_DRAFT = 'Draft';

@Component({
  selector: 'app-details-pane-header',
  templateUrl: './details-pane-header.component.html',
  styleUrls: ['./details-pane-header.component.scss']
})
export class DetailsPaneHeaderComponent implements OnInit, OnDestroy {

  constructor(
    private authHttpService: AuthHttpService,
    private dialogService: DialogService,
    private geometryService: GeometryService,
    private mapService: MapService,
    private store: Store<fromHome.State>,
    private roleService: RoleService,
    private translateService: TranslateService
  ) {}

  @Output() saveEvent: EventEmitter<boolean> = new EventEmitter<boolean>(false); // TODO: update to DTO interface
  @Output() deleteEvent: EventEmitter<boolean> = new EventEmitter<boolean>(false); // TODO: update to DTO interface
  @Output() submitEvent: EventEmitter<boolean> = new EventEmitter<boolean>(false); // TODO: update to DTO interface
  private subs: Subscription[] = [];

  project: any;
  projectId: any;
  projectNumber: string;
  projectStatus = PROJECT_STATUS_DRAFT;
  projectCreatedBy = new BehaviorSubject<string>('');
  hasGeometry = new BehaviorSubject<boolean>(false);
  loaded = new BehaviorSubject<boolean>(false);
  lookupValues: any;
  canSave = new BehaviorSubject<boolean>(false);
  canDelete = new BehaviorSubject<boolean>(false);
  ableToSubmit = new BehaviorSubject<boolean>(false);
  systemOpen = new BehaviorSubject<boolean>(false); // result of api call to check system status
  isAdmin = new BehaviorSubject<boolean>(false); // admins can still save / edit any project
  userInfo: UserInfo;
  detailMode: string;
  areNewProjRequiredFieldsEntered: boolean;
  tabIndex = 0;
  ngOnInit() {
    this.userInfo = this.roleService.getUserInfo();
    this.isAdmin.next(this.roleService.isUserAdmin());
    this.subs.push(
      // check if system is open
      this.store
      .pipe(select(fromHome.systemIsOpen))
      .subscribe((systemOpen: any) => {
        if (typeof systemOpen === 'boolean') {
          this.systemOpen.next(systemOpen);
        }
      }),
      // tab change
      this.store
      .pipe(select(fromHome.getDetailTabIndex))
      .subscribe(async (index) => {
        this.tabIndex = index;
        // if tab not set to details
        if (this.tabIndex > 0 ) {
          // disable edit
          this.saveDeleteButtons(false);
          this.ableToSubmit.next(false);
        }
        // for tab 0, check edit / submit status
        if (this.tabIndex === 0) {
          // this would be for a 'add' project - ie new project
          if (this.detailMode === DetailMode.addMode) {
            this.loaded.next(false);
            if (this.areNewProjRequiredFieldsEntered) {
              this.canSave.next(true);
              this.canDelete.next(false); // disable delete for a new project
              if (!this.hasGeometry.value) {
                this.ableToSubmit.next(false);
              }
            }
            this.loaded.next(true);
          } else {
            // check existing
            if (this.project) {
              this.loaded.next(false);
              this.saveDeleteButtons(this.roleService.canUserEditProject(this.project));
              this.checkAbleToSubmit(this.project.project);
              this.loaded.next(true);
            }
          }
        }
      }),
      // disable save if required fields are not entered
      this.store
      .pipe(select(fromHome.getAreNewProjRequiredFieldsEntered))
      .subscribe((areNewProjRequiredFieldsEntered) => {
        this.areNewProjRequiredFieldsEntered = areNewProjRequiredFieldsEntered ? true : false;
      }),
      // get home mode
      this.store
      .pipe(select(fromHome.getHomeMode))
      .subscribe(async (mode: any) => {
        // handle detail mode
        if (mode && mode.homeMode === HomeMode.detailsMode) {
          // new project
          if (mode && mode.detailMode === DetailMode.addMode) {
            this.detailMode = DetailMode.addMode;
            this.configNewProject();
          } else {
            this.detailMode = DetailMode.infoMode;
          }
        }
      }),
      // check for project
      this.store
      .pipe(select(fromHome.getSelectedProject))
      .subscribe(async (project) => {
        // existing project
        if (project) {
          // set attributes for an existing project
          await this.configExistingProject(project);
        } else {
          this.projectNumber = 'N/A';
        }
      }),
      // GIS Edit Success
      this.store
      .pipe(select(fromHome.gisApplyEditsSuccess))
      .subscribe(async (params) => {
        if (params) {
          if (environment.isLocalHost) {
            console.log('GIS Apply Edits -> ', params);
          }
          // controls display of 'zoom to' button for addFeatures and updateFeatures and able to Submit
          if (params && (params.addFeatures || params.updateFeatures)) {
            this.hasGeometry.next(true);
            if (this.tabIndex === 0) {
              this.ableToSubmit.next(true);
              this.saveDeleteButtons(true);
            }
          }
          /*
          if (params && params.updateFeatures) {
            this.hasGeometry.next(true);
            if (this.tabIndex === 0) {
              this.ableToSubmit.next(true);
              this.saveDeleteButtons(true);
            }
          }*/
          if (params && params.deleteFeatures) {
            this.hasGeometry.next(false);
            this.ableToSubmit.next(false);
            this.saveDeleteButtons(false);
          }
        }
      }),
      // project save success
      this.store
      .pipe(select(fromHome.projectSaveSuccess))
      .subscribe(async (result: any) => {
        if (result && result.projectId) {
          this.loaded.next(false);
          if (environment.isLocalHost) {
            console.log('Project Save -> ', result);
          }
          // update status
          if (result.projectId === this.projectId) {
            this.projectStatus = result.project.status;
          }
          // save project object
          // set attributes for an existing project
          this.configExistingProject(result);
          }
        }),
        // project submit success
        this.store
        .pipe(select(fromHome.projectSubmitSuccess))
        .subscribe(async (result: any) => {
          if (result && result.project.ProjectId) {
            if (environment.isLocalHost) {
              console.log('Project Submit Success -> ', result);
            }
            // handle result
            if (result.project.ProjectId === this.projectId) {
              this.handleSubmitResult(result);
            }
          }
        })
    );
  }

  ngOnDestroy() {
    this.subs.forEach((sub) => sub.unsubscribe());
  }

  private saveDeleteButtons(enabled: boolean) {
    if (enabled) {
      this.canSave.next(true);
      this.canDelete.next(true);
    } else {
      this.canSave.next(false);
      this.canDelete.next(false);
    }
  }

  private configNewProject() {
    this.loaded.next(false);
    this.project = null; // clear project
    this.projectStatus = PROJECT_STATUS_DRAFT;
    this.projectCreatedBy.next('');
    // disable save if required fields are not entered
    this.store
      .pipe(select(fromHome.getAreNewProjRequiredFieldsEntered))
      .subscribe((val) => {
        if (val) {
          this.canSave.next(true); // only allow save, delete gets enabled after save
        } else {
          this.saveDeleteButtons(false);
        }
      });
    this.ableToSubmit.next(false);
    this.hasGeometry.next(false);
    this.loaded.next(true);
  }

  private async configExistingProject(project: any) {
    this.loaded.next(false);
    // set detail mode
    this.detailMode = DetailMode.infoMode;
    // set attributes for an existing project
    this.project = project;
    this.projectStatus = project.project.status;
    this.projectId = Number(project.projectId);
    this.projectNumber = project.project.projectNumber;
    this.projectCreatedBy.next(this.project.project.createdByName);
    const statusId = project.project.statusId;
    await this.checkForGeometry();
    // if submitted
    if (statusId === ProjectStatusType.submittedId) {
      this.saveDeleteButtons(false);
      this.ableToSubmit.next(false);
      const admin = this.roleService.isUserAdmin();
      // admins can edit after submit
      if (admin) {
        this.saveDeleteButtons(true);
      }
    } else {
      this.saveDeleteButtons(this.roleService.canUserEditProject(project));
      this.checkAbleToSubmit(this.project.project);
    }
    this.loaded.next(true);
  }

  private async handleSubmitResult(result: any) {
    this.loaded.next(false);
    const statusId = result.project.Project.StatusId;
    if (statusId === ProjectStatusType.submittedId) {
      this.saveDeleteButtons(false);
      this.ableToSubmit.next(false);
      const admin = this.roleService.isUserAdmin();
      if (admin) {
        this.ableToSubmit.next(true);
        this.saveDeleteButtons(true);
      }
      this.projectStatus = ProjectStatusType.submitted;
    } else {
      this.projectStatus = ProjectStatusType.inProgress;
    }
    this.loaded.next(true);
  }

  private checkAbleToSubmit(project: any) {
    let ableToSubmit =
      project.createdBy === this.userInfo.userId && project.statusId === 0
        ? true
        : false;
    if (this.roleService.isUserAdmin()) {
      ableToSubmit = project.statusId === 0;
    }
    if (!this.hasGeometry.value) {
      ableToSubmit = false;
    }
    this.ableToSubmit.next(ableToSubmit);
  }

  async delete() {
    if (this.projectNumber) {
      this.dialogService
      .confirm({
        title: 'CONFIRM DELETE',
        message: 'Are you sure you want to delete this project?'
      })
      .afterClosed()
      .subscribe(async (answer) => {
        if (answer) {
          this.deleteEvent.emit(true);
          setTimeout(() => {
            // TODO: pass a behavior sub instead, setTimeout triggers onChanges in project-details-tab
            this.deleteEvent.emit(false);
          }, 500);
        }
      });
    }
  }

  async submit() {
    this.submitEvent.emit(true);
    setTimeout(() => {
      // TODO: pass a behavior sub instead, setTimeout triggers onChanges in project-details-tab
      this.submitEvent.emit(false);
    }, 500);
  }

  async save() {
    this.saveEvent.emit(true);
    setTimeout(() => {
      // TODO: pass a behavior sub instead, setTimeout triggers onChanges in project-details-tab
      this.saveEvent.emit(false);
    }, 500);
  }

  async zoomTo() {
    await this.mapService.zoomToRecord(this.projectNumber);
  }

  private async checkForGeometry() {
    const hasGeom = await this.geometryService.projectHasGeometry(this.projectNumber);
    this.hasGeometry.next(hasGeom);
  }

}
