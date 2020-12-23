import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { mergeMap, map, switchMap } from 'rxjs/operators';
import { forkJoin, Observable, from } from 'rxjs';

import { ENDPOINTS as endpoints } from 'src/app/core/services/endpoint.service.config';
import { SystemService } from 'src/app/core/services/system.service';
import { HomeService } from './home.service';
import * as homeActions from './home.actions';
import { ValueListItem } from '../types/home.lookup.types';
import { ProjectDTO } from 'src/app/shared/models/dtos';

@Injectable()
export class HomeEffects {
  constructor(
    private actions$: Actions,
    private homeService: HomeService,
    private systemService: SystemService
  ) {}

  @Effect()
  loadLookups$ = this.actions$.pipe(
    ofType(homeActions.HomeActionTypes.GET_ALL_LOOKUPS),
    map((action: homeActions.GetAllLookups) => action.payload),
    mergeMap(async (language: string) => {
      const observables = this.homeService.getAllLookups(language);
      const combinedObservables: Observable<any> = forkJoin(observables);
      const allLookupsData = await combinedObservables.toPromise();
      const formattedLookupsObj: any = {};
      Object.keys(endpoints.API_LOOKUP_GETS).forEach((key: any, i) => {
        // index can be used because we use Object.values in getAllLookups() in home.service to form the observables array
        formattedLookupsObj[key] = allLookupsData[i];
      });
      return new homeActions.GetAllLookupsLoadSuccess(formattedLookupsObj);
    })
  );

  @Effect()
  loadSystemIsOpen$ = this.actions$.pipe(
    ofType(homeActions.HomeActionTypes.GET_SYSTEM_IS_OPEN),
    map((action: homeActions.GetSystemIsOpen) => action),
    mergeMap(async (_) => {
      const isOpen = await this.systemService.getIsSystemOpen();
      return new homeActions.SetSystemIsOpen(isOpen);
    })
  );

  @Effect()
  loadSelectedProjectPhaseOptions$ = this.actions$.pipe(
    ofType(homeActions.HomeActionTypes.GET_SELECTED_PROJECT_PHASE_OPTIONS),
    map((action: homeActions.GetSelectedProjectPhaseOptions) => action.payload),
    mergeMap((payload: { language: string; projectTypeId: number }) =>
      this.homeService
        .getSelectedProjectPhaseOptions(payload.language, payload.projectTypeId)
        .pipe(
          map(
            (data: ValueListItem[]) =>
              new homeActions.SelectedProjectPhaseOptionsLoadSuccess(data)
          )
        )
    )
  );

  @Effect()
  loadProjects$ = this.actions$.pipe(
    ofType(homeActions.HomeActionTypes.GET_PROJECTS),
    map((action: homeActions.GetProjects) => action.payload),
    mergeMap((payload: string) =>
      this.homeService.getProjects(payload).pipe(
        map((projects: ProjectDTO[]) => {
          console.log('HomeEffects -> projects', projects);
          return new homeActions.GetProjectsLoadSuccess(projects);
        })
      )
    )
  );

  @Effect()
  loadSelectedProject$ = this.actions$.pipe(
    ofType(homeActions.HomeActionTypes.SET_SELECTED_PROJECT),
    map((action: homeActions.SetSelectedProject) => action.payload),
    switchMap(
      (payload: { projectTypeId: number; projectId: number; id: number }) =>
        this.homeService
          .setSelectedProject(
            payload.projectTypeId,
            payload.projectId,
            payload.id
          )
          .pipe(
            map(
              (project: ProjectDTO[]) =>
                new homeActions.SelectedProjectLoadSuccess(project)
            )
          )
    )
  );

  @Effect()
  loadFilterOptions$ = this.actions$.pipe(
    ofType(homeActions.HomeActionTypes.GET_FILTER_OPTIONS),
    map((action: homeActions.GetFilterOptions) => action.payload),
    mergeMap((payload: string) => {
      return this.homeService.getFilterOptions(payload).pipe(
        map((data: any) => {
          // FILTER AGENCY AND PROJECTPHASE FOR DISTINCT VALUES
          Object.keys(data).forEach((d: any) => {
            if (d === 'agencies' || d === 'projectPhases') {
              const unique = [...new Set(data[d].map((d2: any) => d2.value))];
              data[d] = unique.map((uniqueValue) => {
                return {
                  value: uniqueValue
                };
              });
            }
          });
          return new homeActions.FilterOptionsLoadSuccess(data);
        })
      );
    })
  );
}
