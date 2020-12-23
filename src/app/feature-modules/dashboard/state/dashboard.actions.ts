import { Action } from '@ngrx/store';

export enum DashboardActionTypes {
  GET_ALL_PROJECT_DATA = '[Dashboard] GET_ALL_PROJECT_DATA',
  GET_ALL_PROJECT_DATA_LOAD_SUCCESS = '[Dashboard] GET_ALL_PROJECT_DATA_LOAD_SUCCESS',
  GET_DASH_CHART_1 = '[Dashboard] GET_DASH_CHART_1',
  CLEAR_DASHBOARD = '[Dashboard] CLEAR_DASHBOARD',
  GET_DASH_CHART_1_LOAD_SUCCESS = '[Dashboard] GET_DASH_CHART_1_LOAD_SUCCESS',
  GET_DASH_CHART_2 = '[Dashboard] GET_DASH_CHART_2',
  GET_DASH_CHART_2_LOAD_SUCCESS = '[Dashboard] GET_DASH_CHART_2_LOAD_SUCCESS',
  GET_DASH_CHART_3 = '[Dashboard] GET_DASH_CHART_3',
  GET_DASH_CHART_3_LOAD_SUCCESS = '[Dashboard] GET_DASH_CHART_3_LOAD_SUCCESS'
}

export class GetAllProjectData implements Action {
  readonly type = DashboardActionTypes.GET_ALL_PROJECT_DATA;
  constructor(public payload: string) {}
}

export class GetAllProjectDataLoadSuccess implements Action {
  readonly type = DashboardActionTypes.GET_ALL_PROJECT_DATA_LOAD_SUCCESS;
  constructor(public payload: any) {}
}
export class ClearDashboard implements Action {
  readonly type = DashboardActionTypes.CLEAR_DASHBOARD;
}

export class GetDashChart1 implements Action {
  readonly type = DashboardActionTypes.GET_DASH_CHART_1;
  constructor(public payload: any) {}
}

export class GetDashChart1LoadSuccess implements Action {
  readonly type = DashboardActionTypes.GET_DASH_CHART_1_LOAD_SUCCESS;
  constructor(public payload: any) {}
}

export class GetDashChart2 implements Action {
  readonly type = DashboardActionTypes.GET_DASH_CHART_2;
  constructor(public payload: any) {}
}

export class GetDashChart2LoadSuccess implements Action {
  readonly type = DashboardActionTypes.GET_DASH_CHART_2_LOAD_SUCCESS;
  constructor(public payload: any) {}
}

export class GetDashChart3 implements Action {
  readonly type = DashboardActionTypes.GET_DASH_CHART_3;
  constructor(public payload: any) {}
}

export class GetDashChart3LoadSuccess implements Action {
  readonly type = DashboardActionTypes.GET_DASH_CHART_3_LOAD_SUCCESS;
  constructor(public payload: any) {}
}

export type DashboardActions =
  | GetDashChart1
  | GetDashChart1LoadSuccess
  | GetDashChart2
  | GetDashChart2LoadSuccess
  | GetDashChart3
  | GetDashChart3LoadSuccess
  | GetAllProjectData
  | GetAllProjectDataLoadSuccess;
