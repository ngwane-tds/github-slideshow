import * as fromRoot from '../../../state/app.state';
import { DashboardActionTypes, DashboardActions } from './dashboard.actions';
import { createFeatureSelector, createSelector } from '@ngrx/store';

export interface State extends fromRoot.State {
  dashboard: DashboardState;
}

interface DashChart1 {
  projectID: number;
  projectName: string;
  totalProjectCost: number;
}
interface DashChart2 {
  projectID: number;
  projectName: string;
  jurisdiction: number;
  projectDescription: string;
}

interface DashChart3 {
  fiscal_year: number;
  dwr_month: number;
  labor_hours: number;
  fte_contract: number;
  fte_workprogram: number;
}

export interface DashboardState {
  allProjectData: any;
  dashChart1: DashChart1[];
  dashChart2: DashChart2[];
  dashChart3: DashChart3[];
}

const initialState: DashboardState = {
  allProjectData: {},
  dashChart1: [],
  dashChart2: [],
  dashChart3: []
};

const getDashboardFeatureState = createFeatureSelector<DashboardState>(
  'dashboard'
);

export const getAllProjectData = createSelector(
  getDashboardFeatureState,
  (state) => state.allProjectData
);

export const getDashChart1 = createSelector(
  getDashboardFeatureState,
  (state) => state.dashChart1
);

export const getDashChart2 = createSelector(
  getDashboardFeatureState,
  (state) => state.dashChart2
);

export const getDashChart3 = createSelector(
  getDashboardFeatureState,
  (state) => state.dashChart3
);

export function reducer(state = initialState, action: any): DashboardState {
  switch (action.type) {
    case DashboardActionTypes.GET_ALL_PROJECT_DATA: {
      return {
        ...state
      };
    }
    case DashboardActionTypes.GET_ALL_PROJECT_DATA_LOAD_SUCCESS: {
      return {
        ...state,
        allProjectData: action.payload
      };
    }
    case DashboardActionTypes.GET_DASH_CHART_1: {
      return {
        ...state
      };
    }
    case DashboardActionTypes.CLEAR_DASHBOARD: {
      return {
        ...initialState
      };
    }
    case DashboardActionTypes.GET_DASH_CHART_1_LOAD_SUCCESS: {
      return {
        ...state,
        dashChart1: action.payload
      };
    }
    case DashboardActionTypes.GET_DASH_CHART_2: {
      return {
        ...state
      };
    }
    case DashboardActionTypes.GET_DASH_CHART_2_LOAD_SUCCESS: {
      return {
        ...state,
        dashChart2: action.payload
      };
    }
    case DashboardActionTypes.GET_DASH_CHART_3: {
      return {
        ...state
      };
    }
    case DashboardActionTypes.GET_DASH_CHART_3_LOAD_SUCCESS: {
      return {
        ...state,
        dashChart3: action.payload
      };
    }
    default:
      return state;
  }
}
