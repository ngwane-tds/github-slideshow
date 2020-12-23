import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private getAssumptionsReportListUrl = `${environment.api}/assumptionsList/Get`;
  private getAssumptionsColumnHeadersListUrl = `${environment.api}/adminColumnInfo/Get?name=`;
  private getSelectedAssumptionsReportDataUrl = `${environment.api}/`;

  constructor(
    private http: HttpClient
    ) {}

  getAssumptionsReportList(): Observable<any> {
    return this.http
      .get<any>(this.getAssumptionsReportListUrl)
      .pipe(catchError(this.handleError));
  }
  getAssumptionsColumnHeadersList(selectedReportName: string): Observable<any> {
    return this.http
      .get<any>(
        `${this.getAssumptionsColumnHeadersListUrl}${selectedReportName}`
      )
      .pipe(catchError(this.handleError));
  }

  getSelectedAssumptionsReportData(
    selectedReportName: string
  ): Observable<any> {
    return this.http
      .get<any>(
        `${this.getSelectedAssumptionsReportDataUrl}${selectedReportName}/get`
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
