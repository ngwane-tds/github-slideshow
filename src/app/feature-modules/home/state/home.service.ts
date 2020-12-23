import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AuthHttpService } from '../../../core/services/auth-http.service';
import { ENDPOINTS as endpoints } from '../../../core/services/endpoint.service.config';
import { ValueListItem } from '../types/home.lookup.types';
import { Language } from '../types/home.language.types';
import { Filters } from '../types/home.filter.types';
import { ProjectDTO } from 'src/app/shared/models/dtos/';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  constructor(
    private http: HttpClient,
    private authHttpService: AuthHttpService
  ) {}

  getAllLookups(language: string): Observable<any>[] {
    const requestsUrls = Object.values(
      endpoints.API_LOOKUP_GETS
    ).map((endpoint: any) => endpoint.concat(`?lang=${language}`));
    const options = {
      headers: this.authHttpService.getAuthHeaders()
    };
    return requestsUrls.map((url) =>
      this.http.get(url, options).pipe(catchError(this.handleError))
    );
  }

  getSelectedProjectPhaseOptions(
    language: string,
    projectTypeId: number
  ): Observable<ValueListItem[]> {
    const options = {
      headers: this.authHttpService.getAuthHeaders()
    };
    return this.http
      .get<ValueListItem[]>(
        `${endpoints.API_CONTROLLER_GETS.HOME.PROJECT_PHASE}?projectTypeId=${projectTypeId}&lang=${language}`,
        options
      )
      .pipe(catchError(this.handleError));
  }

  getProjects(language: string): Observable<ProjectDTO[]> {
    // TODO: use Project[] as type
    const options = {
      headers: this.authHttpService.getAuthHeaders()
    };
    return this.http
      .get<ProjectDTO[]>(
        `${endpoints.API_CONTROLLER_GETS.HOME.PROJECTS_TABLE}?lang=${language}`,
        options
      )
      .pipe(catchError(this.handleError));
  }

  setSelectedProject(
    projectTypeId: number,
    projectId: number,
    id: number
  ): Observable<any> {
    // language is not needed for this GET because the english and spanish project IDs are always stored sequentially in the db table.
    const options = {
      headers: this.authHttpService.getAuthHeaders()
    };

    // Get By Id -> error prone because ID is not unique across various project types
    /*
    const getById = Object.values(
      endpoints.API_CONTROLLER_GETS.HOME.PROJECT_DETAILS_BY_ID
    ).find((obj: any) => obj.projectTypeId === projectTypeId) as any;
    const urlId = `${getById.URL}?id=${id}`;
    */

    // Gety By Project ID -> Project Id is unique across all types
    const getByProjectId = Object.values(
      endpoints.API_CONTROLLER_GETS.HOME.PROJECT_DETAILS_BY_PROJECT_ID
    ).find((obj: any) => obj.projectTypeId === projectTypeId) as any;
    const urlProjectId = `${getByProjectId.URL}?projectId=${projectId}`;

    return this.http
      .get<any[]>(urlProjectId, options)
      .pipe(catchError(this.handleError));
  }

  getFilterOptions(language: string): Observable<Filters> {
    const options = {
      headers: this.authHttpService.getAuthHeaders()
    };
    return this.http
      .get<Filters>(
        `${endpoints.API_CONTROLLER_GETS.HOME.DASH_TABLE_FILTERS}?lang=${language}`,
        options
      )
      .pipe(catchError(this.handleError));
  }

  private handleError(err: any) {
    console.log('handleError -> err', err);
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
