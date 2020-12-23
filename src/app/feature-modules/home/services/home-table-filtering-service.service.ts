import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import * as fromHome from '../state/home.reducer';
import * as homeActions from '../state/home.actions';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ProjectDTO } from 'src/app/shared/models/dtos';
interface FilterGroupVals {
  searchText: string;
  andIsChecked: boolean;
  dropdowns: {
    agencies: [];
    jurisdictions: [];
    projectPhases: [];
    projectTypes: [];
    statuses: [];
    poeLocations: [];
    usernames: [];
    termSelections: [];
  };
}
@Injectable({
  providedIn: 'root'
})
export class HomeTableFilteringService {
  constructor(private store: Store<fromHome.State>, private fb: FormBuilder) {}
  filterGroup: FormGroup = this.fb.group({
    searchText: '',
    andIsChecked: true,
    dropdowns: this.fb.group({
      agencies: [[]],
      jurisdictions: [[]],
      projectPhases: [[]],
      projectTypes: [[]],
      statuses: [[]],
      poeLocations: [[]],
      usernames: [[]],
      termSelections: [[]]
    })
  });
  filter() {
    const filterGroupVals: FilterGroupVals = this.filterGroup.value;
    let allProjects: ProjectDTO[];
    this.store.pipe(select(fromHome.getProjectsClone)).subscribe((projects) => {
      allProjects = projects.attributes;
    });
    let isEmptyDropdownFilters, isEmptySearch;
    for (const key in filterGroupVals) {
      if (key === 'searchText') {
        if (!filterGroupVals[key]) {
          isEmptySearch = true;
        }
      }
      if (key === 'dropdowns') {
        isEmptyDropdownFilters = Object.values(filterGroupVals[key]).every(
          (dropdown: any) => dropdown.length === 0
        );
      }
    }

    if (allProjects.length > 0) {
      const {
        agencies,
        jurisdictions,
        projectPhases,
        projectTypes,
        statuses,
        poeLocations,
        usernames,
        termSelections
      }: any = filterGroupVals.dropdowns;

      const filteredProjects =
        isEmptySearch && isEmptyDropdownFilters
          ? allProjects
          : allProjects.filter((project: ProjectDTO) => {
              let doesContainSearchText: boolean | null = null,
                foundAgency: boolean | null = null,
                foundJurisidiction: boolean | null = null,
                foundProjectPhase: boolean | null = null,
                foundProjectType: boolean | null = null,
                foundStatus: boolean | null = null,
                foundPoeLocations: boolean | null = null,
                foundUsername: boolean | null = null,
                foundTermSelection: boolean | null = null;

              if (filterGroupVals.searchText.length) {
                // search text checks project name, description and project number
                doesContainSearchText =
                  project.projectName &&
                  project.projectName
                    .toUpperCase()
                    .includes(filterGroupVals.searchText.toUpperCase());
                if (!doesContainSearchText) {
                  doesContainSearchText =
                    project.projectDescription &&
                    project.projectDescription
                      .toUpperCase()
                      .includes(filterGroupVals.searchText.toUpperCase());
                }
                if (!doesContainSearchText) {
                  doesContainSearchText =
                    project.projectNumber &&
                    project.projectNumber
                      .toUpperCase()
                      .includes(filterGroupVals.searchText.toUpperCase());
                }
              }
              if (agencies.length) {
                foundAgency = agencies.some(
                  (a: string) => a === project.agencyName
                );
              }
              if (jurisdictions.length) {
                foundJurisidiction = jurisdictions.some(
                  (j: string) => j === project.jurisdiction
                );
              }
              if (projectPhases.length) {
                foundProjectPhase = projectPhases.some(
                  (projPhase: string) =>
                    projPhase === project.projectPhase.value
                );
              }
              if (projectTypes.length) {
                foundProjectType = projectTypes.some(
                  (projType: string) => projType === project.projectType
                );
              }
              if (statuses.length) {
                foundStatus = statuses.some(
                  (s: string) => s === project.status
                );
              }
              if (poeLocations.length) {
                foundPoeLocations = poeLocations.some(
                  (l: string) => l === project.portOfEntryLocation
                );
              }
              if (usernames.length) {
                foundUsername = usernames.some(
                  (u: string) => u === project.createdByName
                );
              }
              if (termSelections.length) {
                foundTermSelection = termSelections.some(
                  (u: string) => u === project.termSelection
                );

                if (
                  !foundTermSelection &&
                  project.termSelection === null &&
                  (termSelections.includes('Not specified') ||
                    termSelections.includes('No especificado'))
                ) {
                  foundTermSelection = true;
                }
              }
              const conditions = [
                doesContainSearchText,
                foundAgency,
                foundJurisidiction,
                foundProjectPhase,
                foundProjectType,
                foundStatus,
                foundPoeLocations,
                foundUsername,
                foundTermSelection
              ];
              if (filterGroupVals.andIsChecked) {
                return conditions.every((el) => el === true || el === null);
              } else {
                return conditions.some((el) => el === true);
              }
            });
      this.store.dispatch(new homeActions.FilterProjects(filteredProjects));
    }
  }
}
