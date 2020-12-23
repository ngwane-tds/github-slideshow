import {
  Component,
  Input,
  ChangeDetectionStrategy,
  ViewChild,
  OnChanges,
  AfterViewInit,
  Output,
  EventEmitter,
  SimpleChange,
  OnDestroy,
  OnInit
} from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TableService } from '../../services/table.service';
import * as fromHome from '../../state/home.reducer';
import { Store, select } from '@ngrx/store';
import { SubSink } from 'subsink';
import { ProjectDTO } from 'src/app/shared/models/dtos';
import * as homeActions from '../../state/home.actions';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'attribute-table',
  templateUrl: 'attribute-table.html',
  styleUrls: ['attribute-table.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AttributeTableComponent
  implements OnInit, OnChanges, AfterViewInit, OnDestroy {
  private subs = new SubSink();
  initialLoad = true;
  hasNoFilterResults: BehaviorSubject<boolean | null> = new BehaviorSubject(
    null
  );
  constructor(
    public tableService: TableService,
    private store: Store<fromHome.State>,
    private translate: TranslateService
  ) {}

  @Input() selectionBehaviorSubject: BehaviorSubject<number>;
  @Input() projectsResult: any;
  @Output() sortChange: EventEmitter<MatSort> = new EventEmitter();
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  rows = new MatTableDataSource([]);
  projects: {
    fields: any;
    attributes: ProjectDTO[];
  };
  displayCols: string[] = [];
  selectedRowIndex = -1;
  translatedTableJSON: any = null;
  displayedColumns = [
    // 'projectId', // temporarily show to make it easier to wire up data
    'projectNumber',
    // 'agencyName',
    'createdByName',
    // 'projectTypeId', // temporarily show to make it easier to wire up data
    'projectName',
    'projectDescription',
    'projectType',
    'portOfEntryLocation',
    'projectPhase',
    'status',
    'jurisdiction',
    'createdDateTime',
    'totalProjectCost',
    'yearProjectOperational',
    'termSelection'
  ];
  ngOnInit() {
    this.store.pipe(select(fromHome.getProjects)).subscribe((projects) => {
      this.projects = projects;
      if (projects) {
        this.initialLoad = false;
      }
    });
    // treat language change as initial table load because it needs to get a new list of projects
    this.store
      .pipe(select(fromHome.getLanguage))
      .subscribe((language: string) => {
        this.initialLoad = true;
        this.translate.getTranslation(language).subscribe((res) => {
          if (res && res.hasOwnProperty('TABLE')) {
            this.translatedTableJSON = res.TABLE;
          }
        });
      });
    this.hasNoFilterResults.subscribe((hasNoFilterResults: boolean) => {
      if (hasNoFilterResults === true) {
        this.store.dispatch(new homeActions.SetHasFilterResults(false));
      } else if (hasNoFilterResults === false) {
        this.store.dispatch(new homeActions.SetHasFilterResults(true));
      }
    });
    this.store
      .pipe(select(fromHome.getMapProjectLayerClickResult))
      .subscribe((result) => {
        if (result && (result.ProjectID || result.ProjectNumber)) {
          // const row = this.getRowByProjectId(result.projectID); // left if we want to get by projectId
          const row = this.getRowByProjectNumber(result.ProjectNumber);
          if (row) {
            this.tableService.selectProject(row);
          }
        }
      });
  }

  getTranslatedColumnHeaders(alias: string) {
    if (alias && this.translatedTableJSON) {
      return this.translatedTableJSON[alias];
    }
  }
  toggleSelection(projectId: number) {}

  ngAfterViewInit() {
    this.rows.sort = this.sort;
    this.subs.sink = this.sort.sortChange.subscribe((sort: MatSort) => {
      this.sortChange.emit(sort);
    });
  }

  typeof(item: any) {
    return typeof item;
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  ngOnChanges(change: { [propName: string]: SimpleChange }) {
    this.displayCols = this.displayedColumns;
    const projects = change.projectsResult.currentValue.attributes;
    if (
      !change.projectsResult.firstChange &&
      change.projectsResult.previousValue.attributes.length !==
        change.projectsResult.currentValue.attributes.length &&
      this.projects &&
      this.projects.attributes.length === 0 &&
      !this.initialLoad
    ) {
      this.hasNoFilterResults.next(true);
    }
    if (
      !change.projectsResult.firstChange &&
      change.projectsResult.previousValue.attributes.length !==
        change.projectsResult.currentValue.attributes.length &&
      this.projects &&
      this.projects.attributes.length !== 0 &&
      !this.initialLoad
    ) {
      this.hasNoFilterResults.next(false);
    }

    this.rows.data = projects;
  }

  private getRowByProjectId(projectId: number) {
    const row = this.rows.data.filter((r) => r.projectId === projectId)[0];
    return row;
  }

  private getRowByProjectNumber(projectNumber: string) {
    const row = this.rows.data.filter(
      (r) => r.projectNumber === projectNumber
    )[0];
    return row;
  }
}
