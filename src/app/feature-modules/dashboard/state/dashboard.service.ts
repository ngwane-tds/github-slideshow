import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import {
  chart1DummyData,
  chart2DummyData,
  chart3DummyData
} from '../dummy-data/';
import { ENDPOINTS as endpoints } from '../../../core/services/endpoint.service.config';
import { AuthHttpService } from 'src/app/core/services/auth-http.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private getDashChart1Url = `${environment.api}/dashLaborHoursByDistrict/Get?years=`;
  private getDashChart2Url = `${environment.api}/dashFTEsByDistrict/Get?years=`;
  private getDashChart3Url = `${environment.api}/dashProjectedLaborNeeds/Get?years=`;

  constructor(
    private http: HttpClient,
    private authHttpService: AuthHttpService
  ) {}

  getAllProjectData(language: string): Observable<any>[] {
    const requestsUrls = Object.values(
      endpoints.API_CONTROLLER_GETS.DASHBOARD.GET_ALL
    ).map((endpoint: any) => endpoint.concat(`?lang=${language}`));
    const options = {
      headers: this.authHttpService.getAuthHeaders()
    };
    return requestsUrls.map((url) =>
      this.http.get(url, options).pipe(catchError(this.handleError))
    );
  }

  getDashChart1(selectedYear: any): Observable<any> {
    return of(chart1DummyData); // TODO: replace with actual GET when API is configured
    // selectedYear = selectedYear.join(',');
    // return this.http
    //   .get<any>(`${this.getDashChart1Url}${selectedYear}`)
    //   .pipe(catchError(this.handleError));
  }

  getDashChart2(selectedYear: any): Observable<any> {
    return of(chart2DummyData); // TODO: replace with actual GET when API is configured
    // selectedYear = selectedYear.join(',');
    // return this.http
    //   .get<any>(`${this.getDashChart2Url}${selectedYear}`)
    //   .pipe(catchError(this.handleError));
  }

  getDashChart3(selectedYear: any): Observable<any> {
    return of(chart3DummyData); // TODO: replace with actual GET when API is configured
    // selectedYear = selectedYear.join(',');
    // return this.http
    //   .get<any>(`${this.getDashChart3Url}${selectedYear}`)
    //   .pipe(catchError(this.handleError));
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
