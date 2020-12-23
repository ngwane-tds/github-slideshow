import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { mergeMap, map } from 'rxjs/operators';
import { AdminService } from './admin.service';
import * as adminActions from './admin.actions';

@Injectable()
export class AdminEffects {
  constructor(private actions$: Actions, private adminService: AdminService) {}

  @Effect()
  loadAdminReportsList$ = this.actions$.pipe(
    ofType(adminActions.AdminActionTypes.GET_ASSUMPTIONS_REPORT_LIST),
    mergeMap((action: adminActions.GetAssumptionsReportList) =>
      this.adminService
        .getAssumptionsReportList()
        .pipe(
          map(
            (reports: any) =>
              new adminActions.AssumptionsReportListLoadSuccess(reports)
          )
        )
    )
  );

  @Effect()
  loadColumnsList$ = this.actions$.pipe(
    ofType(adminActions.AdminActionTypes.GET_ASSUMPTIONS_COLUMN_HEADERS_LIST),
    mergeMap((action: adminActions.GetAssumptionsColumnHeadersList) =>
      this.adminService
        .getAssumptionsColumnHeadersList(action.payload)
        .pipe(
          map(
            (columnHeaders: any) =>
              new adminActions.AssumptionsColumnHeadersLoadSuccess(
                columnHeaders
              )
          )
        )
    )
  );

  @Effect()
  loadSelectedReportData$ = this.actions$.pipe(
    ofType(adminActions.AdminActionTypes.GET_ASSUMPTIONS_REPORT_DATA),
    mergeMap((action: adminActions.GetAssumptionsReportData) =>
      this.adminService
        .getSelectedAssumptionsReportData(action.payload)
        .pipe(
          map(
            (reportData: any) =>
              new adminActions.AssumptionsReportDataLoadSuccess(reportData)
          )
        )
    )
  );
}
