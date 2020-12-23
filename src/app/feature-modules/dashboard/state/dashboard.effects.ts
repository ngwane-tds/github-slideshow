import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { mergeMap, map } from 'rxjs/operators';
import { DashboardService } from './dashboard.service';
import * as dashboardActions from './dashboard.actions';
import { forkJoin, Observable } from 'rxjs';
import { ENDPOINTS as endpoints } from 'src/app/core/services/endpoint.service.config';
@Injectable()
export class DashboardEffects {
  constructor(
    private actions$: Actions,
    private dashboardService: DashboardService
  ) {}

  @Effect()
  loadAllProjectData = this.actions$.pipe(
    ofType(dashboardActions.DashboardActionTypes.GET_ALL_PROJECT_DATA),
    map((action: dashboardActions.GetAllProjectData) => action.payload),
    mergeMap(async (language: string) => {
      const observables = this.dashboardService.getAllProjectData(language);
      const combinedObservables: Observable<any> = forkJoin(observables);
      const allProjectsData = await combinedObservables.toPromise();
      const formattedProjectsObj: any = {};
      Object.keys(endpoints.API_CONTROLLER_GETS.DASHBOARD.GET_ALL).forEach(
        (key: any, i) => {
          // index can be used because we use Object.values in getAllProjectData() in dashboard.service to form the observables array
          formattedProjectsObj[key] = allProjectsData[i];
        }
      );
      return new dashboardActions.GetAllProjectDataLoadSuccess(
        formattedProjectsObj
      );
    })
  );

  @Effect()
  loadDashChart1$ = this.actions$.pipe(
    ofType(dashboardActions.DashboardActionTypes.GET_DASH_CHART_1),
    mergeMap((action: dashboardActions.GetDashChart1) =>
      this.dashboardService.getDashChart1(action.payload).pipe(
        map((chartOneData: any) => {
          // console.log('DashboardEffects -> chartOneData', chartOneData);
          return new dashboardActions.GetDashChart1LoadSuccess(chartOneData);
        })
      )
    )
  );

  @Effect()
  loadDashChart2$ = this.actions$.pipe(
    ofType(dashboardActions.DashboardActionTypes.GET_DASH_CHART_2),
    mergeMap((action: dashboardActions.GetDashChart2) =>
      this.dashboardService.getDashChart2(action.payload).pipe(
        map((chartTwoData: any) => {
          // console.log('DashboardEffects -> chartTwoData', chartTwoData);
          return new dashboardActions.GetDashChart2LoadSuccess(chartTwoData);
        })
      )
    )
  );

  @Effect()
  loadDashChart3$ = this.actions$.pipe(
    ofType(dashboardActions.DashboardActionTypes.GET_DASH_CHART_3),
    mergeMap((action: dashboardActions.GetDashChart3) =>
      this.dashboardService.getDashChart3(action.payload).pipe(
        map((chartThreeData: any) => {
          // console.log('DashboardEffects -> chartThreeData', chartThreeData);
          return new dashboardActions.GetDashChart3LoadSuccess(chartThreeData);
        })
      )
    )
  );
}
