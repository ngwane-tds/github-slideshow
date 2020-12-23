import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Filters } from '../types/reports.types';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {
  private getReportsListUrl = `${environment.api}/reportsList/Get`;
  private getColumnHeadersListUrl = `${environment.api}/adminColumnInfo/Get?name=`;
  private getSelectedReportDataUrl = `${environment.api}/`;
  private getFilterOptionsUrl = `${environment.api}/`;

  constructor(private http: HttpClient) {}

  getReportsList(): Observable<any> {
    return this.http
      .get<any>(this.getReportsListUrl)
      .pipe(catchError(this.handleError));
  }
  getColumnHeadersList(selectedReportName: string): Observable<any> {
    return this.http
      .get<any>(`${this.getColumnHeadersListUrl}${selectedReportName}`)
      .pipe(catchError(this.handleError));
  }

  getSelectedReportData(
    selectedReportName: string,
    districts: string = '',
    years: string = '',
    searchText: string = ''
  ): Observable<any> {
    return this.http
      .get<any>(
        `${this.getSelectedReportDataUrl}${selectedReportName}/get?search_filter=${searchText}&districts=${districts}&years=${years}`
      )

      .pipe(catchError(this.handleError));
  }

  getFilterOptions(selectedReportName: string): Observable<Filters> {
    return this.http
      .get<Filters>(
        `${this.getFilterOptionsUrl}${selectedReportName}/getFilter`
      )
      .pipe(catchError(this.handleError));
  }

  private handleError(err: any) {
    let errorMessage: string;
    if (err.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      errorMessage = `Backend returned code ${err.status}: ${err.body.error}`;
    }
    console.error(err);
    return throwError(errorMessage);
  }
}
