// import { Contract, Contracts } from '../types/home.contracts.types';
import * as fromRoot from '../../../state/app.state';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { HomeActionTypes, HomeActions } from './home.actions';
import { ValueListItem } from '../types/home.lookup.types';
import { MapMode } from '../types/home.mode.types';
import { ProjectDTO } from 'src/app/shared/models/dtos';
import { SubmitResult } from '../../../shared/models/submit-result';

/*
* imports all exported members -> we can then reference each interface using fromRoot
  defined this way for lazy loading enhancements:
  - if feature isn't lazy loaded (such as user, place in root)
  - if lazy loaded feature place in feature-level reducer
*/

export interface State extends fromRoot.State {
  home: HomeState;
}

export interface HomeState {
  // FDOT EXAMPLES
  // contracts: Contracts;
  // contractsClone: any;
  // END FDOT EXAMPLES
  projects: {
    attributes: ProjectDTO[];
    fields: any;
    hasNoFilterResults: boolean;
  };
  projectsClone: {
    attributes: ProjectDTO[];
    fields: any;
    hasNoFilterResults: boolean;
  };
  selectedProjectIds: {
    projectId: number;
    projectTypeId: number;
    id: number;
  };
  selectedProject: any;
  filterOptions: any;
  language: string | null;
  isMapViewReady: boolean;
  isGisProjectsLayerReady: boolean;
  canUserEditProject: boolean;
  gisApplyEditsSuccess: any;
  projectSaveSuccess: any;
  projectSaveError: any;
  formFields: any;
  homeMode: any;
  lookupValues: any;
  detailTabIndex: number;
  selectedProjectTypeId: number | null;
  selectedProjectPhaseOptions: ValueListItem[] | null;
  userLoginSuccess: boolean;
  projectDeleteSuccess: any;
  projectDeleteError: any;
  projectSubmitSuccess: SubmitResult;
  projectSubmitError: any;
  areNewProjRequiredFieldsEntered: boolean;
  mapProjectLayerClickResult: any;
  mapMode: MapMode;
  systemIsOpen: boolean;
}

const initialState: HomeState = {
  language: null,
  formFields: {
    projectDetails: {
      portOfEntry: [
        { name: 'ProjectId', alias: 'Project ID' },
        { name: 'County', alias: 'County' },
        { name: 'ExistingCondition', alias: 'Existing Condition' }
      ],
      railroad: [],
      interchange: []
    }
  },
  projects: {
    // any updates to this must be duplicated to projectClone below.
    // ALIAS MATCHES (EN.JSON and ES-MX.JSON).TABLE PROPERTIES FOR TRANSLATIONS
    attributes: [],
    fields: [
      { name: 'projectNumber', alias: 'PROJECT_NUMBER', type: 'string' },
      { name: 'projectName', alias: 'PROJECT_NAME', type: 'string' },
      { name: 'agencyName', alias: 'AGENCY', type: 'string' },
      { name: 'createdByName', alias: 'USER', type: 'string' },
      { name: 'projectType', alias: 'PROJECT_TYPE', type: 'string' },
      {
        name: 'projectDescription',
        alias: 'PROJECT_DESCRIPTION',
        type: 'string'
      },
      { name: 'projectId', alias: 'Project ID', type: 'number' },
      { name: 'projectPhase', alias: 'PROJECT_PHASE', type: 'string' },
      { name: 'portOfEntryLocation', alias: 'POE_SERVED', type: 'string' },
      { name: 'projectTypeId', alias: 'Project Type ID', type: 'number' },
      { name: 'status', alias: 'STATUS', type: 'string' },
      { name: 'jurisdiction', alias: 'JURISDICTION', type: 'string' },
      { name: 'createdDateTime', alias: 'CREATED_DATE', type: 'Date' },
      { name: 'totalProjectCost', alias: 'TOTAL_PROJECT_COST', type: 'money' },
      {
        name: 'yearProjectOperational',
        alias: 'YEAR_PROJECT_OPERATIONAL',
        type: 'number'
      },
      {
        name: 'termSelection',
        alias: 'TERM_SELECTION',
        type: 'string'
      }
    ],
    hasNoFilterResults: false
  },
  projectsClone: {
    // initial state must match projects above - this duplication of state is intentional for client side table filtering.
    attributes: [],
    fields: [
      { name: 'projectNumber', alias: 'PROJECT_NUMBER', type: 'string' },
      { name: 'projectName', alias: 'PROJECT_NAME', type: 'string' },
      { name: 'agencyName', alias: 'AGENCY', type: 'string' },
      { name: 'createdByName', alias: 'USER', type: 'string' },
      { name: 'projectType', alias: 'PROJECT_TYPE', type: 'string' },
      {
        name: 'projectDescription',
        alias: 'PROJECT_DESCRIPTION',
        type: 'string'
      },
      { name: 'projectId', alias: 'Project ID', type: 'number' },
      { name: 'projectPhase', alias: 'PROJECT_PHASE', type: 'string' },
      { name: 'portOfEntryLocation', alias: 'POE_SERVED', type: 'string' },
      { name: 'projectTypeId', alias: 'Project Type ID', type: 'number' },
      { name: 'status', alias: 'STATUS', type: 'string' },
      { name: 'jurisdiction', alias: 'JURISDICTION', type: 'string' },
      { name: 'createdDateTime', alias: 'CREATED_DATE', type: 'Date' },
      { name: 'totalProjectCost', alias: 'TOTAL_PROJECT_COST', type: 'money' },
      {
        name: 'yearProjectOperational',
        alias: 'YEAR_PROJECT_OPERATIONAL',
        type: 'number'
      },
      {
        name: 'termSelection',
        alias: 'Time Period',
        type: 'string'
      }
    ],
    hasNoFilterResults: false
  },
  selectedProjectIds: null,
  selectedProject: null,
  filterOptions: null,
  selectedProjectTypeId: null,
  selectedProjectPhaseOptions: null,
  isMapViewReady: false,
  isGisProjectsLayerReady: false,
  canUserEditProject: false,
  gisApplyEditsSuccess: null,
  projectSaveSuccess: null,
  projectSaveError: null,
  lookupValues: null,
  detailTabIndex: 0,
  homeMode: null,
  userLoginSuccess: false,
  projectDeleteSuccess: null,
  projectDeleteError: null,
  projectSubmitSuccess: null,
  projectSubmitError: null,
  areNewProjRequiredFieldsEntered: false,
  mapProjectLayerClickResult: null,
  mapMode: MapMode.navMode,
  systemIsOpen: false
};

const getHomeFeatureState = createFeatureSelector<HomeState>('home');

export const getAreNewProjRequiredFieldsEntered = createSelector(
  getHomeFeatureState,
  (state) => state.areNewProjRequiredFieldsEntered
);

export const getDetailTabIndex = createSelector(
  getHomeFeatureState,
  (state) => state.detailTabIndex
);

export const getHomeMode = createSelector(
  getHomeFeatureState,
  (state) => state.homeMode
);

export const getMapMode = createSelector(
  getHomeFeatureState,
  (state) => state.mapMode
);

export const getLookupValues = createSelector(
  getHomeFeatureState,
  (state) => state.lookupValues
);

export const getSelectedProjectPhaseOptions = createSelector(
  getHomeFeatureState,
  (state) => state.selectedProjectPhaseOptions
);

export const getIsMapViewReady = createSelector(
  getHomeFeatureState,
  (state) => state.isMapViewReady
);

export const getIsGisProjectsLayerReady = createSelector(
  getHomeFeatureState,
  (state) => state.isGisProjectsLayerReady
);

export const getCanUserEditProject = createSelector(
  getHomeFeatureState,
  (state) => state.canUserEditProject
);

export const gisApplyEditsSuccess = createSelector(
  getHomeFeatureState,
  (state) => state.gisApplyEditsSuccess
);

export const userLoginSuccess = createSelector(
  getHomeFeatureState,
  (state) => state.userLoginSuccess
);

export const projectSaveSuccess = createSelector(
  getHomeFeatureState,
  (state) => state.projectSaveSuccess
);

export const projectSaveError = createSelector(
  getHomeFeatureState,
  (state) => state.projectSaveError
);

export const projectDeleteSuccess = createSelector(
  getHomeFeatureState,
  (state) => state.projectDeleteSuccess
);

export const projectDeleteError = createSelector(
  getHomeFeatureState,
  (state) => state.projectDeleteError
);

export const projectSubmitSuccess = createSelector(
  getHomeFeatureState,
  (state) => state.projectSubmitSuccess
);

export const projectSubmitError = createSelector(
  getHomeFeatureState,
  (state) => state.projectSubmitError
);

export const getLanguage = createSelector(
  getHomeFeatureState,
  (state) => state.language
);

export const getProjects = createSelector(
  getHomeFeatureState,
  (state) => state.projects
);

export const getProjectsClone = createSelector(
  getHomeFeatureState,
  (state) => state.projectsClone
);

export const getSelectedProject = createSelector(
  getHomeFeatureState,
  (state) => state.selectedProject
);

export const getFilterOptions = createSelector(
  getHomeFeatureState,
  (state) => state.filterOptions
);

export const getHasFilterResults = createSelector(
  getHomeFeatureState,
  (state) => state.projects.hasNoFilterResults
);

export const getMapProjectLayerClickResult = createSelector(
  getHomeFeatureState,
  (state) => state.mapProjectLayerClickResult
);

export const systemIsOpen = createSelector(
  getHomeFeatureState,
  (state) => state.systemIsOpen
);

export function reducer(state = initialState, action: HomeActions): HomeState {
  switch (action.type) {
    case HomeActionTypes.SET_LANGUAGE:
      return {
        ...state,
        language: action.payload
      };
    case HomeActionTypes.SET_SELECTED_PROJECT_TYPE_ID:
      return {
        ...state,
        selectedProjectIds: {
          ...state.selectedProjectIds,
          projectTypeId: action.payload
        }
      };
    case HomeActionTypes.GET_SELECTED_PROJECT_PHASE_OPTIONS:
      return {
        ...state
      };
    case HomeActionTypes.SELECTED_PROJECT_PHASE_OPTIONS_LOAD_SUCCESS:
      return {
        ...state,
        selectedProjectPhaseOptions: action.payload
      };
    case HomeActionTypes.GET_ALL_LOOKUPS:
      return {
        ...state
      };
    case HomeActionTypes.GET_ALL_LOOKUPS_LOAD_SUCCESS:
      return {
        ...state,
        lookupValues: action.payload
      };
    case HomeActionTypes.HOME_MODE_CHANGE:
      return {
        ...state,
        homeMode: action.payload
      };
    case HomeActionTypes.MAP_MODE_CHANGE:
      return {
        ...state,
        mapMode: action.payload
      };
    case HomeActionTypes.DETAILS_TAB_CHANGE:
      return {
        ...state,
        detailTabIndex: action.payload
      };
    case HomeActionTypes.GET_IS_MAP_VIEW_READY:
      return {
        ...state,
        isMapViewReady: action.payload
      };
    case HomeActionTypes.GET_GIS_PROJECTS_LAYER_READY:
      return {
        ...state,
        isGisProjectsLayerReady: action.payload
      };
    case HomeActionTypes.GET_CAN_USER_EDIT_PROJECT:
      return {
        ...state,
        canUserEditProject: action.payload
      };
    case HomeActionTypes.GIS_APPLY_EDITS_SUCCESS:
      return {
        ...state,
        gisApplyEditsSuccess: action.payload
      };
    case HomeActionTypes.MAP_PROJECT_LAYER_CLICK:
      return {
        ...state,
        mapProjectLayerClickResult: action.payload
      };
    case HomeActionTypes.PROJECT_SAVE_SUCCESS:
      return {
        ...state,
        projectSaveSuccess: action.payload
      };
    case HomeActionTypes.PROJECT_SAVE_ERROR:
      return {
        ...state,
        projectSaveError: action.payload
      };
    case HomeActionTypes.PROJECT_DELETE_SUCCESS:
      return {
        ...state,
        projectDeleteSuccess: action.payload
      };
    case HomeActionTypes.PROJECT_DELETE_ERROR:
      return {
        ...state,
        projectDeleteError: action.payload
      };
    case HomeActionTypes.PROJECT_SUBMIT_SUCCESS:
      return {
        ...state,
        projectSubmitSuccess: action.payload
      };
    case HomeActionTypes.PROJECT_SUBMIT_ERROR:
      return {
        ...state,
        projectSubmitError: action.payload
      };
    case HomeActionTypes.GET_SYSTEM_IS_OPEN:
      return { ...state };
    case HomeActionTypes.SET_SYSTEM_IS_OPEN:
      return {
        ...state,
        systemIsOpen: action.payload
      };
    case HomeActionTypes.GET_PROJECTS:
      return { ...state };
    case HomeActionTypes.GET_PROJECTS_LOAD_SUCCESS:
      return {
        ...state,
        projects: {
          attributes: action.payload,
          fields: [...state.projects.fields],
          hasNoFilterResults: false
        },
        projectsClone: {
          attributes: action.payload,
          fields: [...state.projects.fields],
          hasNoFilterResults: false
        }
      };
    case HomeActionTypes.CLEAR_PROJECTS:
      return {
        ...state,
        projects: initialState.projects,
        projectsClone: initialState.projectsClone
      };
    case HomeActionTypes.USER_LOGIN_SUCCESS:
      return {
        ...state,
        userLoginSuccess: action.payload
      };
    case HomeActionTypes.CLEAR_PROJECT_FILTERS:
      return {
        ...state,
        projects: state.projectsClone
      };
    case HomeActionTypes.FILTER_PROJECTS:
      return {
        ...state,
        projects: {
          ...state.projects,
          attributes: action.payload
        }
      };
    case HomeActionTypes.SET_HAS_FILTER_RESULTS:
      return {
        ...state,
        projects: {
          ...state.projects,
          hasNoFilterResults: action.payload
        }
      };
    case HomeActionTypes.SET_SELECTED_PROJECT:
      return { ...state, selectedProjectIds: action.payload };
    case HomeActionTypes.SELECTED_PROJECT_LOAD_SUCCESS:
      return { ...state, selectedProject: action.payload };
    case HomeActionTypes.CLEAR_SELECTED_PROJECT:
      return { ...state, selectedProject: null, selectedProjectIds: null };
    case HomeActionTypes.GET_FILTER_OPTIONS:
      return { ...state };
    case HomeActionTypes.FILTER_OPTIONS_LOAD_SUCCESS:
      return { ...state, filterOptions: action.payload };
    case HomeActionTypes.SET_ARE_NEW_PROJ_REQUIRED_FIELDS_ENTERED:
      return {
        ...state,
        areNewProjRequiredFieldsEntered: action.payload
      };
    // case HomeActionTypes.SET_MAP_SELECTED_PROJECT:
    //   return { ...state, selectedProject: action.payload };
    // case HomeActionTypes.MAP_SELECTED_PROJECT_LOAD_SUCCESS:
    //   return {
    //     ...state,
    //     selectedProject: action.payload
    //   };
    default:
      return state;
  }
}
