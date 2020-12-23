import * as fromRoot from '../../../state/app.state';
import { AdminActionTypes, AdminActions } from './admin.actions';
import { createFeatureSelector, createSelector } from '@ngrx/store';

/*
from prior app shell
import { createReducer, Action, on } from '@ngrx/store';
import * as AdminActions from './admin.actions';

export const initialState: any = {
  user: null
};

const adminReducer = createReducer(
  initialState,
  on(AdminActions.logout, (state) => ({ ...state, home: state.home + 1 })),
  on(AdminActions.login, (state, { user }) => ({ user }))
);

export function reducer(state: any | undefined, action: Action) {
  return adminReducer(state, action);
}
*/

export interface AdminState {
  assumptionsReportList: [];
  assumptionsColumnHeaders: [];
  assumptionsSelectedReportData: [];
}

export interface State extends fromRoot.State {
  admin: AdminState;
}

const initialState: any = {
  assumptionsReportList: [],
  assumptionsColumnHeaders: [],
  assumptionsSelectedReportData: []
};

const getAdminFeatureState = createFeatureSelector<AdminState>('admin');

export const getAssumptionsReportsList = createSelector(
  getAdminFeatureState,
  (state) => state.assumptionsReportList
);

export const getColumnHeadersList = createSelector(
  getAdminFeatureState,
  (state) => state.assumptionsColumnHeaders
);

export const getSelectedReportData = createSelector(
  getAdminFeatureState,
  (state) => state.assumptionsSelectedReportData
);

export function reducer(state = initialState, action: any): AdminState {
  switch (action.type) {
    case AdminActionTypes.GET_ASSUMPTIONS_REPORT_LIST: {
      return {
        ...state
      };
    }
    case AdminActionTypes.CLEAR_ADMIN: {
      return {
        ...initialState
      };
    }
    case AdminActionTypes.ASSUMPTIONS_REPORT_LIST_LOAD_SUCCESS:
      return { ...state, assumptionsReportList: action.payload };
    case AdminActionTypes.GET_ASSUMPTIONS_COLUMN_HEADERS_LIST:
      return {
        ...state
      };
    case AdminActionTypes.ASSUMPTIONS_COLUMN_HEADERS_LOAD_SUCCESS:
      return { ...state, assumptionsColumnHeaders: action.payload };
    case AdminActionTypes.GET_ASSUMPTIONS_REPORT_DATA:
      return {
        ...state
      };
    case AdminActionTypes.ASSUMPTIONS_REPORT_DATA_LOAD_SUCCESS:
      return { ...state, assumptionsSelectedReportData: action.payload };
    default:
      return state;
  }
}
