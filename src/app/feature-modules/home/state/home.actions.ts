import { Action } from '@ngrx/store';
import { ProjectDTO } from 'src/app/shared/models/dtos';
import { ValueListItem } from '../types/home.lookup.types';
import { SubmitResult } from '../../../shared/models/submit-result';

export enum HomeActionTypes {
  SET_LANGUAGE = '[HOME] SET_LANGUAGE',
  SET_SELECTED_PROJECT_TYPE_ID = '[HOME] SET_SELECTED_PROJECT_TYPE_ID',
  GET_SELECTED_PROJECT_PHASE_OPTIONS = '[HOME] GET_SELECTED_PROJECT_PHASE_OPTIONS',
  DETAILS_TAB_CHANGE = '[HOME] DETAILS_TAB_CHANGE',
  HOME_MODE_CHANGE = '[HOME] HOME_MODE_CHANGE',
  SET_HOME_MODE = '[HOME] SET_HOME_MODE',
  MAP_MODE_CHANGE = '[HOME] MAP_MODE_CHANGE',
  GET_PROJECTS = '[HOME] GET_PROJECTS',
  GET_ALL_LOOKUPS = '[HOME] GET_ALL_LOOKUPS',
  GET_ALL_LOOKUPS_LOAD_SUCCESS = '[HOME] Get All Lookups Load Success',
  GET_IS_MAP_VIEW_READY = '[HOME] GET_IS_MAP_VIEW_READY',
  GET_CAN_USER_EDIT_PROJECT = '[HOME] GET_CAN_USER_EDIT_PROJECT',
  CLEAR_PROJECT_FILTERS = '[HOME] CLEAR_PROJECT_FILTERS',
  FILTER_PROJECTS = '[HOME] FILTER_PROJECTS',
  SET_HAS_FILTER_RESULTS = '[HOME] SET_HAS_FILTER_RESULTS',
  CLEAR_PROJECTS = '[HOME] CLEAR_PROJECTS',
  GET_FILTER_OPTIONS = '[HOME] GET_FILTER_OPTIONS',
  SET_SELECTED_PROJECT = '[HOME] SET_SELECTED_PROJECT',
  CLEAR_SELECTED_PROJECT = '[HOME] CLEAR_SELECTED_PROJECT',
  INITIAL_LOAD_SUCCESS = '[HOME] Initial Load Success',
  GET_PROJECTS_LOAD_SUCCESS = '[HOME] Projects Load Success',
  GET_GIS_PROJECTS_LAYER_READY = '[HOME] GET_GIS_PROJECTS_LAYER_READY',
  GIS_APPLY_EDITS_SUCCESS = '[HOME] GIS_APPLY_EDITS_SUCCESS',
  PROJECT_SAVE_SUCCESS = '[HOME] PROJECT_SAVE_SUCCESS',
  PROJECT_SAVE_ERROR = '[HOME] PROJECT_SAVE_ERROR',
  MAP_PROJECT_LAYER_CLICK = '[HOME] MAP_PROJECT_LAYER_CLICK',
  SELECTED_PROJECT_PHASE_OPTIONS_LOAD_SUCCESS = '[HOME] Selected Project Phase Options Load Success',
  SELECTED_PROJECT_LOAD_SUCCESS = '[HOME] Selected Project Load Success',
  MAP_SELECTED_CONTRACT_LOAD_SUCCESS = '[HOME] MAP_SELECTED_CONTRACT_LOAD_SUCCESS',
  FILTER_OPTIONS_LOAD_SUCCESS = '[HOME] Filter Options Load Success',
  LOAD_FAIL = '[HOME] Load Fail',
  USER_LOGIN_SUCCESS = '[HOME] USER_LOGIN_SUCCESS',
  PROJECT_DELETE_SUCCESS = '[HOME] PROJECT_DELETE_SUCCESS',
  PROJECT_DELETE_ERROR = '[HOME] PROJECT_DELETE_ERROR',
  PROJECT_SUBMIT_SUCCESS = '[HOME] PPROJECT_SUBMIT_SUCCESS',
  PROJECT_SUBMIT_ERROR = '[HOME] PPROJECT_SUBMIT_ERROR',
  SET_ARE_NEW_PROJ_REQUIRED_FIELDS_ENTERED = '[HOME] SET_ARE_REQUIRED_NEW_PROJ_FIELDS_ENTERED',
  SET_SYSTEM_IS_OPEN = '[HOME] SET_SYSTEM_IS_OPEN',
  GET_SYSTEM_IS_OPEN = '[HOME] GET_SYSTEM_IS_OPEN'
}

export class SetAreNewProjRequiredFieldsEntered implements Action {
  readonly type = HomeActionTypes.SET_ARE_NEW_PROJ_REQUIRED_FIELDS_ENTERED;
  constructor(public payload: boolean) {}
}

export class SetLanguage implements Action {
  readonly type = HomeActionTypes.SET_LANGUAGE;
  constructor(public payload: string) {}
}

export class SetSelectedProjectTypeId implements Action {
  readonly type = HomeActionTypes.SET_SELECTED_PROJECT_TYPE_ID;
  constructor(public payload: number) {}
}

export class DetailsTabChange implements Action {
  readonly type = HomeActionTypes.DETAILS_TAB_CHANGE;
  constructor(public payload: number) {}
}

export class HomeModeChange implements Action {
  readonly type = HomeActionTypes.HOME_MODE_CHANGE;
  constructor(public payload: any) {}
}

export class MapModeChange implements Action {
  readonly type = HomeActionTypes.MAP_MODE_CHANGE;
  constructor(public payload: any) {}
}

export class GetIsMapViewReady implements Action {
  readonly type = HomeActionTypes.GET_IS_MAP_VIEW_READY;
  constructor(public payload: boolean) {}
}

export class GetCanUserEditProject implements Action {
  readonly type = HomeActionTypes.GET_CAN_USER_EDIT_PROJECT;
  constructor(public payload: boolean) {}
}

export class GetGisProjectsLayerReady implements Action {
  readonly type = HomeActionTypes.GET_GIS_PROJECTS_LAYER_READY;
  constructor(public payload: boolean) {}
}

export class GisApplyEditsSuccess implements Action {
  readonly type = HomeActionTypes.GIS_APPLY_EDITS_SUCCESS;
  constructor(public payload: any) {}
}

export class ProjectSaveSuccess implements Action {
  readonly type = HomeActionTypes.PROJECT_SAVE_SUCCESS;
  constructor(public payload: any) {}
}

export class MapProjectLayerClick implements Action {
  readonly type = HomeActionTypes.MAP_PROJECT_LAYER_CLICK;
  constructor(public payload: any) {}
}

export class ProjectSaveError implements Action {
  readonly type = HomeActionTypes.PROJECT_SAVE_ERROR;
  constructor(public payload: any) {}
}

export class GetAllLookups implements Action {
  readonly type = HomeActionTypes.GET_ALL_LOOKUPS;
  constructor(public payload: string) {}
}

export class GetAllLookupsLoadSuccess implements Action {
  readonly type = HomeActionTypes.GET_ALL_LOOKUPS_LOAD_SUCCESS;
  constructor(public payload: any) {}
}

export class GetSelectedProjectPhaseOptions implements Action {
  readonly type = HomeActionTypes.GET_SELECTED_PROJECT_PHASE_OPTIONS;
  constructor(
    public payload: {
      language: string;
      projectTypeId: number;
    }
  ) {}
}

export class SelectedProjectPhaseOptionsLoadSuccess implements Action {
  readonly type = HomeActionTypes.SELECTED_PROJECT_PHASE_OPTIONS_LOAD_SUCCESS;
  constructor(public payload: ValueListItem[]) {}
}

/*
export class GetContracts implements Action {
  readonly type = HomeActionTypes.GET_CONTRACTS;
}*/

export class GetProjects implements Action {
  readonly type = HomeActionTypes.GET_PROJECTS;
  constructor(public payload: string) {}
}

export class ClearProjects implements Action {
  readonly type = HomeActionTypes.CLEAR_PROJECTS;
}
export class GetProjectsLoadSuccess implements Action {
  readonly type = HomeActionTypes.GET_PROJECTS_LOAD_SUCCESS;
  constructor(public payload: ProjectDTO[]) {}
}

export class ClearProjectFilters implements Action {
  readonly type = HomeActionTypes.CLEAR_PROJECT_FILTERS;
}

export class GetFilterOptions implements Action {
  readonly type = HomeActionTypes.GET_FILTER_OPTIONS;
  constructor(public payload: string) {}
}

export class FilterProjects implements Action {
  readonly type = HomeActionTypes.FILTER_PROJECTS;
  constructor(public payload: any) {}
}

export class SetHasFilterResults implements Action {
  readonly type = HomeActionTypes.SET_HAS_FILTER_RESULTS;
  constructor(public payload: boolean) {}
}
export class SetSelectedProject implements Action {
  readonly type = HomeActionTypes.SET_SELECTED_PROJECT;
  constructor(
    public payload: {
      projectTypeId: number;
      projectId: number;
      id: number;
    }
  ) {}
}

/*
export class SetMapSelectedContract implements Action {
  readonly type = HomeActionTypes.SET_MAP_SELECTED_CONTRACT;
  constructor(public payload: string) {}
}*/

export class ClearSelectedProject implements Action {
  readonly type = HomeActionTypes.CLEAR_SELECTED_PROJECT;
  // constructor is implicity empty as this does not have a payload
}


export class UserLoginSuccess implements Action {
  readonly type = HomeActionTypes.USER_LOGIN_SUCCESS;
  constructor(public payload: boolean) {}
}

export class SelectedProjectLoadSuccess implements Action {
  readonly type = HomeActionTypes.SELECTED_PROJECT_LOAD_SUCCESS;
  constructor(public payload: any) {}
}


export class FilterOptionsLoadSuccess implements Action {
  readonly type = HomeActionTypes.FILTER_OPTIONS_LOAD_SUCCESS;
  constructor(public payload: any) {}
}

export class LoadFail implements Action {
  readonly type = HomeActionTypes.LOAD_FAIL;
  constructor(public payload: string) {} // TODO error msg
}

export class ProjectDeleteSuccess implements Action {
  readonly type = HomeActionTypes.PROJECT_DELETE_SUCCESS;
  constructor(public payload: any) {}
}

export class ProjectDeleteError implements Action {
  readonly type = HomeActionTypes.PROJECT_DELETE_ERROR;
  constructor(public payload: any) {}
}

export class ProjectSubmitSuccess implements Action {
  readonly type = HomeActionTypes.PROJECT_SUBMIT_SUCCESS;
  constructor(public payload: SubmitResult) {}
}

export class ProjectSubmitError implements Action {
  readonly type = HomeActionTypes.PROJECT_SUBMIT_ERROR;
  constructor(public payload: any) {}
}

export class GetSystemIsOpen implements Action {
  readonly type = HomeActionTypes.GET_SYSTEM_IS_OPEN;
  // constructor is implicity empty as this does not have a payload
}

export class SetSystemIsOpen implements Action {
  readonly type = HomeActionTypes.SET_SYSTEM_IS_OPEN;
  constructor(public payload: boolean) {}
}

export type HomeActions =
  | GetProjects
  | GetProjectsLoadSuccess
  | DetailsTabChange
  | HomeModeChange
  | MapModeChange
  | GetIsMapViewReady
  | GetGisProjectsLayerReady
  | GetCanUserEditProject
  | GisApplyEditsSuccess
  | MapProjectLayerClick
  | ProjectSaveSuccess
  | ProjectSaveError
  | GetAllLookups
  | GetAllLookupsLoadSuccess
  | ClearProjectFilters
  | ClearProjects
  | GetFilterOptions
  | FilterProjects
  | SetHasFilterResults
  | SetLanguage
  | SetSelectedProjectTypeId
  | GetSelectedProjectPhaseOptions
  | SelectedProjectPhaseOptionsLoadSuccess
  | SetSelectedProject
  | ClearSelectedProject
  | UserLoginSuccess
  | SelectedProjectLoadSuccess
  | FilterOptionsLoadSuccess
  | LoadFail
  | ProjectDeleteSuccess
  | ProjectDeleteError
  | ProjectSubmitSuccess
  | ProjectSubmitError
  | SetAreNewProjRequiredFieldsEntered
  | GetSystemIsOpen
  | SetSystemIsOpen;
