import { Component, Input, OnChanges, OnInit } from '@angular/core';
import {
  FormBuilder,
  Validators,
  FormGroup,
  FormControl,
  NgForm,
  FormGroupDirective,
  ValidatorFn
} from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { Store, select } from '@ngrx/store';

import { DialogService } from '../../../../../core/services/dialog.service';
import { RoleService } from '../../../../../core/services/role.service';
import * as fromHome from '../../../state/home.reducer';
import * as homeActions from '../../../state/home.actions';
import { militaryTimeOptions } from './military-time-options';
import { returnYearValues } from './year-values';
import { SaveNewProjectService } from '../../../services/save-new-project.service';
import { SaveExistingProjectService } from '../../../services/save-existing-project.service';
import { ProjectTypeCodes } from '../../../../../shared/models/dtos';
import { environment } from '../../../../../../environments/environment';
import { HomeMode, DetailMode } from '../../../types/home.mode.types';
import { ValueListItem } from '../../../types/home.lookup.types';
import { DeleteProjectService } from '../../../services/delete-project-service';
import { SubmitProjectService } from '../../../services/submit-project-service';
import { GeometryService } from 'src/app/feature-modules/home/map/services/geometry.service';

/**
 * Custom validator functions for reactive form validation
 */
export class CustomValidators {
  /**
   * Validates that child controls in the form group are equal
   */
  static childrenEqual: ValidatorFn = (formGroup: FormGroup) => {
    const [firstControlName, ...otherControlNames] = Object.keys(
      formGroup.controls || {}
    );
    const isValid = otherControlNames.every(
      (controlName) =>
        formGroup.get(controlName).value ===
        formGroup.get(firstControlName).value
    );
    return isValid ? null : { childrenNotEqual: true };
  }
}

/**
 * Collection of reusable error messages
 */
export const errorMessages: { [key: string]: any } = {
  // TODO: get spanish translations for error messages and move to translation JSON
  sharedFormFields: {
    personName: 'Person name is required.',
    projectName: 'Project name is required.',
    projectDescription: 'Project description is required.'
  },
  roadwayFields: {
    limitProjectBeginPost: 'Begin Post (mile or km) is required',
    limitProjectEndPost: 'End Post (mile or km) is required',
    limitProjectTo: '(To Post) is required',
    limitProjectFrom: '(From Post) is required',
    vehicleTypeServedId: 'Vehicle Type Primarily Served is required',
    existingCondition: 'Existing Condition is required',
    conditionAfterCompletion: 'Condition after Project Completion is required',
    projectPhaseId: 'Project Phase is required',
    yearProjectOperational: 'You must select a year or \'Unknown\'',
    totalProjectCost: 'You must enter a project cost',
    projectFullyFundedId: 'Is Project Fully funded? is required',
    fundsStillNeeded: 'Funds Needed to Complete Project is required',
    portOfEntryLocationId: 'POE Primarily Served by the Project is required',
    terminusFacilityId: 'Terminus or Connects to Rail Line that has a Terminus at International Border is required',
    impactPortOfEntry: 'How Project Serves a POE is required',
  }
};

@Component({
  selector: 'app-project-details-tab',
  templateUrl: './project-details-tab.component.html',
  styleUrls: ['./project-details-tab.component.scss']
})
export class ProjectDetailsTabComponent implements OnInit, OnChanges {
  constructor(
    private dialogService: DialogService,
    private fb: FormBuilder,
    private store: Store<fromHome.State>,
    private saveNewProjectService: SaveNewProjectService,
    private saveExistingProjectService: SaveExistingProjectService,
    private roleService: RoleService,
    private deleteProjectService: DeleteProjectService,
    private submitProjectService: SubmitProjectService,
    private geometryService: GeometryService
  ) {}
  errors = errorMessages;
  @Input() isSaveClicked = false;
  @Input() isDeleteClicked = false;
  @Input() isSubmitClicked = false;
  isProcessing = new BehaviorSubject<boolean>(true);
  canEdit = new BehaviorSubject<boolean>(false); // controls disable of forms
  systemOpen = new BehaviorSubject<boolean>(false); // result of api call to check system status
  isAdmin = new BehaviorSubject<boolean>(false); // admins can edit after system is locked
  selectedLanguage: string;
  projectPhaseOptions: any = [];
  projectTypes: ValueListItem[];
  // projectTypeCodes: ProjectTypeCodes = new ProjectTypeCodes();
  projectTypeFields: FormGroup = this.fb.group({
    projectTypeId: [null, Validators.required], // lock after creation
    projectTypeString: ['']
  });
  militaryTimeOptions: [
    { displayVal: string; apiVal: string }
  ] = militaryTimeOptions;

  yearOptionsLong: [
    { displayVal: string; apiVal: string }
  ] = returnYearValues();

  yearOptionsShort: [{ displayVal: string; apiVal: string }] = returnYearValues(
    true
  );

  years2020To2040: number[] = [2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033, 2034, 2035, 2036, 2037, 2038, 2039, 2040]; // prettier-ignore
  years2020To2024: number[] = [2020, 2021, 2022, 2023, 2024]; // prettier-ignore
  sharedFormFields: FormGroup = this.fb.group(
    {
      // fields shared among every project type
      jurisdictionId: [null, Validators.required], // lock after creation
      status: [''],
      projectName: ['', Validators.required],
      projectDescription: ['', Validators.required],
      personName: ['', Validators.required],
      projectPhaseId: [0]
    },
    { validator: CustomValidators.childrenEqual }
  );

  portOfEntryFields: FormGroup = this.fb.group({
    projectTypeId: [0],
    portOfEntryProjectTypeId: [0, Validators.required],
    portOfEntryLocationId: [0, Validators.min(1)],
    locationOther: [''],
    existingCondition: [''],
    conditionProjectCompletion: ['', Validators.required],
    passengerHoursWeekStart: [null],
    passengerHoursWeekEnd: [null],
    passengerHoursSatStart: [null],
    passengerHoursSatEnd: [null],
    passengerHoursSunStart: [null],
    passengerHoursSunEnd: [null],
    commercialHoursWeekStart: [null],
    commercialHoursWeekEnd: [null],
    commercialHoursSatStart: [null],
    commercialHoursSatEnd: [null],
    commercialHoursSunStart: [null],
    commercialHoursSunEnd: [null],
    yearProjectOperational: [-1, Validators.min(1)],
    fundsStillNeeded: [null, Validators.required],
    environmentalBenefitId: [0, Validators.min(1)],
    economicBenefitId: [0, Validators.min(1)],
    positiveImpactCargoId: [0, Validators.min(1)],
    positiveImpactPassengerId: [0, Validators.min(1)],
    projectFullyFundedId: [0, Validators.min(1)],
    totalProjectCost: [null, Validators.required],
    constructionPhaseId: [0, Validators.min(1)],
    projectPhaseId: [0, Validators.min(1)],
    // these do not exist in the forms, they come back from the API and need to be used in PUT
    createdBy: [null],
    createdDateTime: [null],
    modifiedBy: [null],
    modifiedDateTime: [null],
    id: [null],
    projectId: [null],
    isDeleted: [null]
  });

  railroadFields: FormGroup = this.fb.group({
    conditionProjectCompletion: ['', Validators.required],
    economicBenefitId: [0, Validators.min(1)],
    environmentalBenefitId: [0, Validators.min(1)],
    existingCondition: ['', Validators.required],
    freightProjAnnualTotalRailCars: [null],
    freightProjProjectedRailCars: [null],
    fundsStillNeeded: [null, Validators.required],
    gradeSeparationId: [0],
    limitProjectFrom: ['', Validators.required],
    limitProjectTo: ['', Validators.required],
    limitProjectBeginPost: [null],
    limitProjectEndPost: [null],
    passProjectProjectedTotal: [null],
    passProjectsCurrentTotal: [null],
    portOfEntryLocationId: [0, Validators.min(1)],
    locationOther: [''],
    terminusTypeId: [0, Validators.min(1)],
    totalProjectCost: [null, Validators.required],
    yearProjectOperational: [-1, Validators.min(1)],
    impactPortOfEntry: ['', Validators.required],
    projectFullyFundedId: [0, Validators.min(1)],
    projectPhaseId: [0, Validators.min(1)],
    // these do not exist in the forms, they come back from the API and need to be used in PUT
    createdBy: [null],
    createdDateTime: [null],
    modifiedBy: [null],
    modifiedDateTime: [null],
    id: [null],
    projectId: [null],
    isDeleted: [null]
  });

  interchangeFields: FormGroup = this.fb.group({
    conditionProjectCompletion: ['', Validators.required],
    accidentRateTypeId: [0],
    dailyTrafficStartRate: [null],
    dailyTrafficEndRate: [null],
    economicBenefitId: [0],
    environmentalBenefitId: [0],
    existingCondition: [''],
    fundsStillNeeded: [null, Validators.required],
    impactPortOfEntry: ['', Validators.required],
    multiModeBicycleId: [0],
    multiModePedestrianId: [0],
    multiModeHOVId: [0],
    nameNearestInterchange: [''],
    portOfEntryLocationId: [0, Validators.min(1)],
    locationOther: [''],
    projectFullyFundedId: [0, Validators.min(1)],
    projectPhaseId: [0, Validators.min(1)],
    terminusFacilityId: [0, Validators.min(1)],
    totalProjectCost: [null, Validators.required],
    truckPercentShareAADT: [null],
    vehicleTypeServedId: [0, Validators.min(1)],
    rampDirection: ['', Validators.required],
    yearProjectOperational: [-1, Validators.min(1)],
    // these do not exist in the forms, they come back from the API and need to be used in PUT
    createdBy: [null],
    createdDateTime: [null],
    modifiedBy: [null],
    modifiedDateTime: [null],
    id: [null],
    projectId: [null],
    isDeleted: [null]
  });

  roadwayFields: FormGroup = this.fb.group({
    limitProjectFrom: ['', Validators.required],
    limitProjectTo: ['', Validators.required],
    limitProjectBeginPost: [null],
    limitProjectEndPost: [null],
    vehicleTypeServedId: [0, Validators.min(1)],
    existingCondition: ['', Validators.required],
    existingConditionLanes: [null],
    existingConditionFacilityTypeId: [0],
    conditionAfterCompletion: ['', Validators.required],
    conditionAfterCompletionLanes: [null],
    conditionAfterCompletionFacilityTypeId: [0],
    nameParallelFacility: [''],
    dailyTrafficStartRate: [null],
    dailyTrafficEndRate: [null],
    truckPercentShareAADT: [null],
    accidentRateTypeId: [0],
    projectPhaseId: [0, Validators.min(1)],
    totalProjectCost: [null, Validators.required],
    projectFullyFundedId: [0, Validators.min(1)],
    fundsStillNeeded: [null, Validators.required],
    yearProjectOperational: [0, Validators.min(1)],
    multiModeBicycleId: [0],
    multiModePedestrianId: [0],
    multiModeHOVId: [0],
    environmentalBenefitId: [0],
    economicBenefitId: [0],
    portOfEntryLocationId: [0, Validators.min(1)],
    locationOther: [''],
    terminusFacilityId: [0, Validators.min(1)],
    impactPortOfEntry: ['', Validators.required],
    // these do not exist in the forms, they come back from the API and need to be used in PUT
    createdBy: [null],
    createdDateTime: [null],
    modifiedBy: [null],
    modifiedDateTime: [null],
    id: [null],
    projectId: [null],
    isDeleted: [null]
  });

  crossBorderFields: FormGroup = this.fb.group({
    projectTypeId: [0, Validators.min(1)],
    conditionProjectCompletion: ['', Validators.required],
    existingCondition: ['', Validators.required],
    fundsStillNeeded: [null, Validators.required],
    limitProjectFrom: ['', Validators.required],
    limitProjectTo: ['', Validators.required],
    limitProjectBeginPost: [null],
    limitProjectEndPost: [null],
    projectFullyFundedId: [0, Validators.min(1)],
    totalProjectCost: [null, Validators.required],
    portOfEntryLocationId: [0, Validators.min(1)],
    locationOther: [''],
    terminusFacilityId: [0, Validators.min(1)],
    projectImpact: ['', Validators.required],
    yearProjectOperational: [-1, Validators.min(1)],
    projectPhaseId: [0, Validators.min(1)],
    // these do not exist in the forms, they come back from the API and need to be used in PUT
    createdBy: [null],
    createdDateTime: [null],
    modifiedBy: [null],
    modifiedDateTime: [null],
    id: [null],
    projectId: [null],
    isDeleted: [null]
  });

  shortTermFields: FormGroup = this.fb.group({
    conditionProjectCompletion: ['', Validators.required],
    existingCondition: ['', Validators.required],
    fundsStillNeeded: [null, Validators.required],
    howReduceBorderWait: ['', Validators.required],
    portOfEntryLocationId: [0, Validators.min(1)],
    locationOther: [''],
    projectFullyFundedId: [0, Validators.min(1)],
    projectLocation: ['', Validators.required],
    totalProjectCost: [null, Validators.required],
    yearProjectOperational: [-1, Validators.min(1)],
    projectPhaseId: [0, Validators.min(1)],
    // these do not exist in the forms, they come back from the API and need to be used in PUT
    createdBy: [null],
    createdDateTime: [null],
    modifiedBy: [null],
    modifiedDateTime: [null],
    id: [null],
    projectId: [null],
    isDeleted: [null]
  });

  sharedFormFieldNames: any = null;
  lookupValues: any = null;
  initialSharedFormFieldValue: FormGroup;

  ngOnInit(): void {
    this.isAdmin.subscribe((isAdmin: boolean) => {
      if (isAdmin) {
        this.canEdit.next(true);
      }
    });
    this.isAdmin.next(this.roleService.isUserAdmin());
    // check if system is open
    this.store
    .pipe(select(fromHome.systemIsOpen))
    .subscribe((systemOpen: any) => {
      if (typeof systemOpen === 'boolean') {
        this.systemOpen.next(systemOpen);
        if (!systemOpen) {
          this.disableAllForms();
        }
      }
    });
    // disable header buttons based on required field values being selected
    this.conditionallyDisableHeaderBtns();
    // get can user edit
    this.canEdit.subscribe((canEdit) => {
      if (canEdit) {
        this.enableAllForms();
      } else {
        this.disableAllForms();
      }
    });
    // get home mode
    this.store
      .pipe(select(fromHome.getHomeMode))
      .subscribe(async (mode: any) => {
        if (mode && mode.homeMode === HomeMode.detailsMode) {
          if (environment.isLocalHost) {
            console.log('Home Mode -> ', mode);
          }
          // adding a new project / make sure to enable edit
          if (mode && mode.detailMode === DetailMode.addMode) {
            this.resetAllForms();
            this.store.dispatch(
              new homeActions.SetAreNewProjRequiredFieldsEntered(false)
            );
            this.canEdit.next(true);
          }
        }
      });
    // get selected project
    this.store
      .pipe(select(fromHome.getSelectedProject))
      .subscribe((project) => {
        if (project) {
          this.isProcessing.next(true);
          // need to manually patch to mimic the behavior of the user selecting a project type
          this.projectTypeFields.patchValue({
            projectTypeId: project.project.projectTypeId
          });
          this.onProjTypeSelectionChange(project.project.projectTypeId);
          const formGroupToPopulate: FormGroup = this.getFormGroupByProjectType(
            project.project.projectTypeId
          );
          this.sharedFormFields.patchValue(project.project);
          formGroupToPopulate.patchValue(project);
          // check if user can edit / do this almost last
          this.canEdit.next(this.roleService.canUserEditProject(project));
          // if system is closed and not admin
          if (!this.systemOpen.value && !this.isAdmin.value) {
            this.canEdit.next(false);
          }
          this.lockSharedInput();
          this.isProcessing.next(false);
        } else {
          this.resetAllForms();
        }
      });
    this.store
      .pipe(select(fromHome.getLanguage))
      .subscribe((language: string) => {
        this.selectedLanguage = language;
      });
    this.store
      .pipe(select(fromHome.getLookupValues))
      .subscribe((lookupValues: any) => {
        if (lookupValues) {
          this.lookupValues = lookupValues;
          this.projectTypes = lookupValues.PROJECT_TYPE;
        }
      });
    this.initialSharedFormFieldValue = this.sharedFormFields.value; // store for reset in onProjTypeSelectionChange()
  }

  // lock fields after project creation
  lockSharedInput() {
    this.sharedFormFields.disable();
    this.projectTypeFields.disable();
    // enable fields if the user can edit the project
    if (this.canEdit.value) {
      this.sharedFormFields.controls.projectName.enable();
      this.sharedFormFields.controls.projectDescription.enable();
      this.sharedFormFields.controls.personName.enable();
    }
  }

  // unlock fields, for a new project
  unlockSharedInput() {
    this.sharedFormFields.enable();
    this.projectTypeFields.enable();
  }

  resetAllForms() {
    this.isProcessing.next(true);
    new homeActions.SetAreNewProjRequiredFieldsEntered(false);
    // loop the enum and get numeric codes - reset forms specific to type
    for (const value in ProjectTypeCodes) {
      if (!isNaN(Number(ProjectTypeCodes[value]))) {
        const code = Number(ProjectTypeCodes[value]);
        const fg = this.getFormGroupByProjectType(code);
        fg.reset();
      }
    }
    // reset shared form fields
    this.sharedFormFields.reset();
    this.projectTypeFields.reset();
    this.projectPhaseOptions = [];
    this.unlockSharedInput();
    this.isProcessing.next(false);
  }

  disableAllForms() {
    this.isProcessing.next(true);
    // loop the enum and get numeric codes - reset forms specific to type
    for (const value in ProjectTypeCodes) {
      if (!isNaN(Number(ProjectTypeCodes[value]))) {
        const code = Number(ProjectTypeCodes[value]);
        const fg = this.getFormGroupByProjectType(code);
        fg.disable();
      }
    }
    this.lockSharedInput();
    this.isProcessing.next(false);
  }

  enableAllForms() {
    this.isProcessing.next(true);
    // loop the enum and get numeric codes - reset forms specific to type
    for (const value in ProjectTypeCodes) {
      if (!isNaN(Number(ProjectTypeCodes[value]))) {
        const code = Number(ProjectTypeCodes[value]);
        const fg = this.getFormGroupByProjectType(code);
        fg.enable();
      }
    }
    this.unlockSharedInput();
    this.isProcessing.next(false);
  }

  getFormGroupByProjectType(projectTypeId: number): FormGroup {
    switch (projectTypeId) {
      case ProjectTypeCodes.roadway:
        return this.roadwayFields;
      case ProjectTypeCodes.interchange:
        return this.interchangeFields;
      case ProjectTypeCodes.railroad:
        return this.railroadFields;
      case ProjectTypeCodes.portOfEntry:
        return this.portOfEntryFields;
      case ProjectTypeCodes.crossBorder:
        return this.crossBorderFields;
      case ProjectTypeCodes.shortTerm:
        return this.shortTermFields;
      default:
        const err = new Error(
          `Unhandled project type in getFormGroupByProjectType: ${projectTypeId}`
        );
        throw err;
    }
  }

  ngOnChanges(): void {
    // PUT/POST project save based on selected project state
    // TODO: consider a behavior subject instead so we dont have to use ngOnChanges
    this.store
      .pipe(select(fromHome.getSelectedProject))
      .subscribe(async (project) => {
        if (this.isSaveClicked) {
          let saveResult = null;
          this.isProcessing.next(true);
          const projectTypeId = this.projectTypeFields.controls.projectTypeId
            .value;
          if (project) {
            saveResult = await this.saveExistingProjectService.saveExistingProject(
              // handles PUT for all project types,
              projectTypeId,
              this.sharedFormFields,
              this.projectTypeFields,
              this.selectedLanguage,
              // will only use one of these groups below based on switch statement
              this.crossBorderFields,
              this.portOfEntryFields,
              this.roadwayFields,
              this.interchangeFields,
              this.shortTermFields,
              this.railroadFields
            );
          } else {
            // TODO: After POST save id's back into object so same items are not posted again. (Bobby)
            saveResult = await this.saveNewProjectService.saveNewProject(
              // handles POST for all project types,
              projectTypeId,
              this.sharedFormFields,
              this.projectTypeFields,
              this.selectedLanguage,
              // will only use one of these groups below based on switch statement
              this.crossBorderFields,
              this.portOfEntryFields,
              this.roadwayFields,
              this.interchangeFields,
              this.shortTermFields,
              this.railroadFields
            );
            this.lockSharedInput();
          }
          this.verifySaveResult(saveResult);
          this.isProcessing.next(false);
        }
        if (this.isDeleteClicked) {
          let deleteResult = null;
          if (project) {
            this.isProcessing.next(true);
            const projectTypeId = this.projectTypeFields.controls.projectTypeId
              .value;
            deleteResult = await this.deleteProjectService.deleteProject(
              projectTypeId,
              project.id,
              project.project.projectNumber,
              this.selectedLanguage
            );
            this.verifyDeleteResult(deleteResult);
            this.isProcessing.next(false);
            this.isDeleteClicked = false;
          }
        }
        if (this.isSubmitClicked) {
          let submitResult = null;
          this.isProcessing.next(true);
          if (project) {
            // check if geometry is valid, do this first
            const hasGeom = await this.geometryService.projectHasGeometry(project.project.projectNumber);
            if (hasGeom) {
                const projectTypeId = this.projectTypeFields.controls.projectTypeId
                .value;
                submitResult = await this.submitProjectService.submitProject(
                // handles PUT for all project types,
                projectTypeId,
                this.sharedFormFields,
                this.projectTypeFields,
                this.selectedLanguage,
                // will only use one of these groups below based on switch statement
                this.crossBorderFields,
                this.portOfEntryFields,
                this.roadwayFields,
                this.interchangeFields,
                this.shortTermFields,
                this.railroadFields
              );
            } else {
              this.dialogService.error({
                title: 'SUBMIT ERROR - GEOMETRY',
                message: '',
                height: 500,
                htmlMessage: `<b>Project Geometry is missing.  Was it previously deleted?</b>`,
              });
            }
          }
          this.verifySubmitResult(submitResult);
          this.isProcessing.next(false);
        }
      });
  }

  conditionallyDisableHeaderBtns() {
    // disable save, delete and submit if required projectTypeId and jurisdictionId are not populated
    const isProjectTypeId = new BehaviorSubject(false);
    const isJurisdictionId = new BehaviorSubject(false);
    // subscribe to the two truly required fields for a new project in db
    this.projectTypeFields.controls.projectTypeId.valueChanges.subscribe(
      (projectTypeId: number) => {
        if (projectTypeId) {
          isProjectTypeId.next(true);
        } else {
          isProjectTypeId.next(false);
        }
      }
    );
    this.sharedFormFields.controls.jurisdictionId.valueChanges.subscribe(
      (jurisdictionId: number) => {
        if (jurisdictionId) {
          isJurisdictionId.next(true);
        } else {
          isJurisdictionId.next(false);
        }
      }
    );
    // dispatch to store if both are true so save can be conditionally enabled/disabled
    const subs = [isProjectTypeId, isJurisdictionId];
    subs.forEach((sub: BehaviorSubject<any>) => {
      sub.subscribe(() => {
        if (isProjectTypeId.value && isJurisdictionId.value) {
          this.store.dispatch(
            // details-pane-header is subscribed to this action to set its respective behavior subs
            new homeActions.SetAreNewProjRequiredFieldsEntered(true)
          );
        } else {
          this.store.dispatch(
            // details-pane-header is subscribed to this action to set its respective behavior subs
            new homeActions.SetAreNewProjRequiredFieldsEntered(false)
          );
        }
      });
    });
  }
  onProjTypeSelectionChange(projectTypeId: number): void {
    this.sharedFormFields.patchValue({
      projectPhase: null // conditionally show project phase field in html - need to wait for get request to update value to show it
    });
    const projectType: string = this.lookupValues.PROJECT_TYPE.find(
      (p: any) => p.id === projectTypeId
    ).value;
    this.projectTypeFields.patchValue({
      projectTypeString: projectType // string for ngSwitch statement to reference
    });
    this.store.dispatch(
      new homeActions.SetSelectedProjectTypeId(projectTypeId)
    );
    this.store
      .pipe(select(fromHome.getLanguage))
      .subscribe((language: string) => {
        this.store.dispatch(
          new homeActions.GetSelectedProjectPhaseOptions({
            language,
            projectTypeId
          })
        );
      });
    this.store
      .pipe(select(fromHome.getSelectedProjectPhaseOptions))
      .subscribe((res) => {
        if (res) {
          this.projectPhaseOptions = res;
          this.sharedFormFields.patchValue({
            projectPhase: res
          });
        }
      });

    this.sharedFormFields.reset(this.initialSharedFormFieldValue); // clear form
  }

  private verifySaveResult(result: any) {
    if (!result) {
      this.dialogService.error({
        title: 'SAVE ERROR',
        message: 'Failed to save project, check console for errors.'
      });
    }
  }

  private verifyDeleteResult(result: any) {
    if (!result) {
      this.dialogService.error({
        title: 'DELETE ERROR',
        message: 'Failed to delete project, check console for errors.'
      });
    }
  }

  private verifySubmitResult(result: any) {
    if (!result.isSubmitted) {
      const currentForm = this.getFormGroupByProjectType(this.projectTypeFields.controls.projectTypeId.value);
      console.log('ProjectDetailsTabComponent -> verifySubmitResult ->  currentForm ',  currentForm );
      currentForm.markAllAsTouched();
      this.sharedFormFields.markAllAsTouched();
      this.dialogService.error({
        title: 'SUBMIT ERROR',
        message: 'Failed to submit project. Look below and at your submission form for errors.',
        height: 500,
        htmlMessage: `<br>${result.errorRecords.map((err: {fieldName: string, message: string}) => `<div"><strong>${err.fieldName}:</strong> ${err.message}</div><br>`)}`,
      });
    } else {
      console.log(result);
      this.dialogService.alert({
        title: 'SUBMIT ALERT',
        message: 'Project submitted successfully.'
      });
    }
  }
}
