import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AuthHttpService } from 'src/app/core/services/auth-http.service';
import { ENDPOINTS as endpoints } from '../../../core/services/endpoint.service.config';
import { FormGroup } from '@angular/forms';
import * as fromHome from '../state/home.reducer';
import * as homeActions from '../state/home.actions';
import { Store } from '@ngrx/store';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class DeleteProjectService {
  constructor(
    private authHttpService: AuthHttpService, // TODO: use authHttp instead to pass token
    private http: HttpClient,
    private store: Store<fromHome.State>
  ) {}
  public async deleteProject(
    projectTypeId: number,
    projectId: number,
    projectNumber: string,
    language: string
  ) {

    console.log('Project Delete Existing -> ', projectTypeId);
    let endpoint = null;
    switch (projectTypeId) {
      case 10:
        // Roadway
        endpoint = `${endpoints.API_DELETE.ROADWAY}`;
        break;
      // Interchange
      case 20:
          endpoint = `${endpoints.API_DELETE.INTERCHANGE}`;
          break;
      case 30:
        // Rail
        endpoint = `${endpoints.API_DELETE.RAILROAD}`;
        break;
      case 40:
        // POE
        endpoint = `${endpoints.API_DELETE.PORT_OF_ENTRY}`;
        break;
      case 50:
        // 'Crossborder Pedestrian and Micromobility Facilities (CPMF)'
        endpoint = `${endpoints.API_DELETE.CROSS_BORDER}`;
        break;
      case 60:
        // 'Short-term Operational & Minor Capital Investments to Reduce Border Wait Times'
        endpoint = `${endpoints.API_DELETE.SHORT_TERM}`;
        break;
      default:
        const err = new Error(
          `Project Type case not handled in save function: ${projectTypeId}`
        );
        this.store.dispatch(new homeActions.ProjectSaveError(err));
        throw err;
    }
    // call delete
    try {
      const url = `${endpoint}?id=${projectId}`;
      if (environment.isLocalHost) {
        console.log('DELETE PROJECT -> ', url);
      }
      const res = await this.authHttpService.delete(url);
      this.store.dispatch(new homeActions.GetProjects(language));
      const deleteResult = {
        deleted: {
          projectId,
          projectNumber,
          projectTypeId
        }
      };
      this.store.dispatch(new homeActions.ProjectDeleteSuccess(deleteResult));
      return deleteResult;
    } catch (err) {
      this.store.dispatch(new homeActions.ProjectDeleteError(err));
      return console.error(err);
    }
  }
}
