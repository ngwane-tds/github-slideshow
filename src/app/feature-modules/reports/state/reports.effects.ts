import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { mergeMap, map } from 'rxjs/operators';
import { ReportsService } from './reports.service';
import * as reportsActions from './reports.actions';
@Injectable()
export class ReportsEffects {
  constructor(
    private actions$: Actions,
    private reportsService: ReportsService
  ) {}

  @Effect()
  loadReportsList$ = this.actions$.pipe(
    ofType(reportsActions.ReportsActionTypes.GET_REPORTS_LIST),
    mergeMap((action: reportsActions.GetReportsList) =>
      this.reportsService
        .getReportsList()
        .pipe(
          map(
            (reports: any) => new reportsActions.ReportsListLoadSuccess(reports)
          )
        )
    )
  );

  @Effect()
  loadColumnsList$ = this.actions$.pipe(
    ofType(reportsActions.ReportsActionTypes.GET_COLUMN_HEADERS_LIST),
    mergeMap((action: reportsActions.GetColumnHeadersList) =>
      this.reportsService
        .getColumnHeadersList(action.payload)
        .pipe(
          map(
            (columnHeaders: any) =>
              new reportsActions.ColumnHeadersLoadSuccess(columnHeaders)
          )
        )
    )
  );

  @Effect()
  loadSelectedReportData$ = this.actions$.pipe(
    ofType(reportsActions.ReportsActionTypes.GET_REPORT_DATA),
    mergeMap((action: reportsActions.GetReportData) =>
      this.reportsService
        .getSelectedReportData(
          action.payload.selectedReportName,
          action.payload.districts,
          action.payload.years,
          action.payload.searchText
        )
        .pipe(
          map(
            (reportData: any) =>
              new reportsActions.ReportDataLoadSuccess(reportData)
          )
        )
    )
  );

  @Effect()
  loadFilterOptions$ = this.actions$.pipe(
    ofType(reportsActions.ReportsActionTypes.GET_FILTER_OPTIONS),
    mergeMap((action: reportsActions.GetFilterOptions) =>
      this.reportsService
        .getFilterOptions(action.payload)
        .pipe(
          map((data: any) => new reportsActions.FilterOptionsLoadSuccess(data))
        )
    )
  );
}
