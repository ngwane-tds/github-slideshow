/*
from prior app shell
import { createAction, props } from '@ngrx/store';
export const logout = createAction('[Admin] Login');
export const login = createAction('[Admin] Logout', props<{user: any}>());
*/

import { Action } from '@ngrx/store';

export enum AdminActionTypes {
  GET_ASSUMPTIONS_REPORT_LIST = '[Admin] GET_ASSUMPTIONS_REPORT_LIST',
  CLEAR_ADMIN = '[Admin] CLEAR_ADMIN',
  ASSUMPTIONS_REPORT_LIST_LOAD_SUCCESS = '[Admin] Assumptions Report List Load Success',
  GET_ASSUMPTIONS_COLUMN_HEADERS_LIST = '[Admin] GET_ASSUMPTIONS_COLUMN_HEADERS_LIST',
  ASSUMPTIONS_COLUMN_HEADERS_LOAD_SUCCESS = '[Admin] Assumptions Column Headers Load Success',
  GET_ASSUMPTIONS_REPORT_DATA = '[Admin] GET_ASSUMPTIONS_REPORT_DATA',
  ASSUMPTIONS_REPORT_DATA_LOAD_SUCCESS = '[Admin] Assumptions Report Data Load Success'
}

export class GetAssumptionsReportList implements Action {
  readonly type = AdminActionTypes.GET_ASSUMPTIONS_REPORT_LIST;
}

export class ClearAdmin implements Action {
  readonly type = AdminActionTypes.CLEAR_ADMIN;
}

export class AssumptionsReportListLoadSuccess implements Action {
  readonly type = AdminActionTypes.ASSUMPTIONS_REPORT_LIST_LOAD_SUCCESS;
  constructor(public payload: []) {}
}

export class GetAssumptionsColumnHeadersList implements Action {
  readonly type = AdminActionTypes.GET_ASSUMPTIONS_COLUMN_HEADERS_LIST;
  constructor(public payload: string) {}
}

export class AssumptionsColumnHeadersLoadSuccess implements Action {
  readonly type = AdminActionTypes.ASSUMPTIONS_COLUMN_HEADERS_LOAD_SUCCESS;
  constructor(public payload: any) {}
}

export class GetAssumptionsReportData implements Action {
  readonly type = AdminActionTypes.GET_ASSUMPTIONS_REPORT_DATA;
  constructor(public payload: string) {}
}

export class AssumptionsReportDataLoadSuccess implements Action {
  readonly type = AdminActionTypes.ASSUMPTIONS_REPORT_DATA_LOAD_SUCCESS;
  constructor(public payload: any) {}
}

export type AdminActions =
  | GetAssumptionsReportList
  | ClearAdmin
  | AssumptionsReportListLoadSuccess
  | GetAssumptionsColumnHeadersList
  | AssumptionsColumnHeadersLoadSuccess
  | GetAssumptionsReportData
  | AssumptionsReportDataLoadSuccess;
