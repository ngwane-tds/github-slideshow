import { Action } from '@ngrx/store';

export enum ReportsActionTypes {
  GET_REPORTS_LIST = '[Reports] GET_REPORT_LIST',
  GET_REPORT_DATA = '[Reports] GET_REPORT_DATA',
  CLEAR_REPORTS = '[Reports] CLEAR_REPORTS',
  GET_COLUMN_HEADERS_LIST = '[Reports] GET_COLUMN_HEADERS_LIST',
  GET_FILTER_OPTIONS = '[Reports] GET_FILTER_OPTIONS',
  REPORTS_LIST_LOAD_SUCCESS = '[Reports] Reports List Load Success',
  COLUMN_HEADERS_LOAD_SUCCESS = '[Reports] Column Headers Load Success',
  FILTER_OPTIONS_LOAD_SUCCESS = '[Reports] Filter Options Load Success',
  REPORT_DATA_LOAD_SUCCESS = '[Reports] Report Data Load Success'
}

export class GetReportsList implements Action {
  readonly type = ReportsActionTypes.GET_REPORTS_LIST;
}

export class ClearReports implements Action {
  readonly type = ReportsActionTypes.CLEAR_REPORTS;
}

export class ReportsListLoadSuccess implements Action {
  readonly type = ReportsActionTypes.REPORTS_LIST_LOAD_SUCCESS;
  constructor(public payload: []) {}
}

export class GetColumnHeadersList implements Action {
  readonly type = ReportsActionTypes.GET_COLUMN_HEADERS_LIST;
  constructor(public payload: string) {}
}

export class ColumnHeadersLoadSuccess implements Action {
  readonly type = ReportsActionTypes.COLUMN_HEADERS_LOAD_SUCCESS;
  constructor(public payload: any) {}
}

export class GetReportData implements Action {
  readonly type = ReportsActionTypes.GET_REPORT_DATA;
  constructor(
    public payload: {
      selectedReportName: string;
      districts?: string;
      years?: string;
      searchText?: string;
    }
  ) {}
}

export class ReportDataLoadSuccess implements Action {
  readonly type = ReportsActionTypes.REPORT_DATA_LOAD_SUCCESS;
  constructor(public payload: any) {}
}

export class GetFilterOptions implements Action {
  readonly type = ReportsActionTypes.GET_FILTER_OPTIONS;
  constructor(public payload: any) {}
}

export class FilterOptionsLoadSuccess implements Action {
  readonly type = ReportsActionTypes.FILTER_OPTIONS_LOAD_SUCCESS;
  constructor(public payload: any) {}
}

export type ReportActions =
  | GetReportsList
  | ClearReports
  | ReportsListLoadSuccess
  | GetColumnHeadersList
  | ColumnHeadersLoadSuccess
  | GetReportData
  | ReportDataLoadSuccess
  | GetFilterOptions
  | FilterOptionsLoadSuccess;
