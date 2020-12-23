import * as fromRoot from '../../../state/app.state';
import { ReportsActionTypes, ReportActions } from './reports.actions';
import { createFeatureSelector, createSelector } from '@ngrx/store';

export interface State extends fromRoot.State {
  reports: ReportsState;
}

// TODO: add strong types
interface Report {
  name: string;
  description: string;
  id: number;
}

interface ColumnHeader {
  columnName: string;
  logicalName: string;
  format: string;
  id: number;
}

export interface ReportsState {
  reportsList: [];
  columnHeaders: [];
  selectedReportData: [];
  filterOptions: {};
}

const initialState: any = {
  reportsList: [],
  columnHeaders: [],
  selectedReportData: [],
  filterOptions: {}
};

const getReportsFeatureState = createFeatureSelector<ReportsState>('reports');

export const getReportsList = createSelector(
  getReportsFeatureState,
  (state) => state.reportsList
);

export const getColumnHeadersList = createSelector(
  getReportsFeatureState,
  (state) => state.columnHeaders
);

export const getSelectedReportData = createSelector(
  getReportsFeatureState,
  (state) => state.selectedReportData
);

export const getFilterOptions = createSelector(
  getReportsFeatureState,
  (state) => state.filterOptions
);

export function reducer(state = initialState, action: any): ReportsState {
  switch (action.type) {
    case ReportsActionTypes.GET_REPORTS_LIST: {
      return {
        ...state
      };
    }
    case ReportsActionTypes.CLEAR_REPORTS: {
      return {
        ...initialState
      };
    }
    case ReportsActionTypes.REPORTS_LIST_LOAD_SUCCESS:
      return { ...state, reportsList: action.payload };
    case ReportsActionTypes.GET_COLUMN_HEADERS_LIST:
      return {
        ...state
      };
    case ReportsActionTypes.COLUMN_HEADERS_LOAD_SUCCESS:
      return { ...state, columnHeaders: action.payload };
    case ReportsActionTypes.GET_REPORT_DATA:
      return {
        ...state
      };
    case ReportsActionTypes.REPORT_DATA_LOAD_SUCCESS:
      return { ...state, selectedReportData: action.payload };
    default:
      return state;
    case ReportsActionTypes.GET_FILTER_OPTIONS:
      return { ...state };
    case ReportsActionTypes.FILTER_OPTIONS_LOAD_SUCCESS:
      return { ...state, filterOptions: action.payload };
  }
}
