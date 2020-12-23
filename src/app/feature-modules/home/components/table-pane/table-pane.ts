import {
  Component,
  ChangeDetectionStrategy,
  ElementRef,
  OnInit,
  Input,
  SimpleChange
} from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { FormBuilder } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { SubSink } from 'subsink';

import * as fromHome from '../../state/home.reducer';
import * as homeActions from '../../state/home.actions';
import { MapService } from '../../map/services/map.service';
import { TableService } from '../../services/table.service';
import { HomeTableFilteringService } from '../../services/home-table-filtering-service.service';
import { ProjectDTO } from 'src/app/shared/models/dtos';
import { HomeMode } from '../../types/home.mode.types';
import { ResizeHandlerService } from 'src/app/core/services/resize-handler.service';

@Component({
  selector: 'table-pane',
  templateUrl: 'table-pane.html',
  styleUrls: ['table-pane.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TablePaneComponent implements OnInit {
  private subs = new SubSink();
  @Input() projectsResult: any;
  @Input() filterOptions: any;
  projects: {
    attributes: ProjectDTO[];
    fields: any[];
  } = null;
  projects$: Observable<{
    attributes: ProjectDTO[];
    fields: any[];
  }>;

  constructor(
    private elRef: ElementRef,
    private fb: FormBuilder,
    private resizeHandler: ResizeHandlerService,
    private tableService: TableService,
    private store: Store<fromHome.State>,
    private mapService: MapService,
    private homeTableFilteringService: HomeTableFilteringService
  ) {
    this.resizeHandler.registerTableElement(this.elRef.nativeElement);
  }
  sort: MatSort = new MatSort();
  hideFilterPanel = false;
  filterGroup = this.homeTableFilteringService.filterGroup;
  selectedLanguage: string;
  hasTableSelection = new BehaviorSubject<boolean>(false);

  ngOnInit() {
    this.projects$ = this.store.pipe(select(fromHome.getProjects));
    // then passed to attr table component
    // this.subs.sink = this.store
    // .pipe(select(fromHome.getContractsClone))
    // .subscribe((contracts) => {
    //   this.allContracts = contracts.attributes;
    // });
    // get home mode
    this.store
      .pipe(select(fromHome.getHomeMode))
      .subscribe(async (mode: any) => {
        // detail mode
        if (mode && mode.homeMode === HomeMode.detailsMode) {
          this.resizeHandler.collapseTable();
        }
        // 'table' mode
        if (mode && mode.homeMode === HomeMode.tableMode) {
          this.resizeHandler.expandTable();
        }
      });
    this.store
      .pipe(select(fromHome.getProjects))
      .subscribe((projects: { attributes: ProjectDTO[]; fields: any[] }) => {
        if (projects) {
          this.projects = projects;
        }
      });
    this.store
      .pipe(select(fromHome.getLanguage))
      .subscribe((language: string) => {
        if (this.selectedLanguage) {
          this.clearFilter();
        }
        this.selectedLanguage = language;
      });
    this.store
      .pipe(select(fromHome.getSelectedProject))
      .subscribe((selectedProject: any) => {
        if (selectedProject) {
          this.hasTableSelection.next(true);
        } else {
          this.hasTableSelection.next(false);
        }
      });
  }

  /*
  ngOnChanges(change: { [propName: string]: SimpleChange }) {
    if (change.filterOptions && change.filterOptions.currentValue) {
      const data = change.filterOptions.currentValue;
      this.filterOptions = data;
    }
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
  */

  onHandleMouseDown(mouseEvent: MouseEvent) {
    this.resizeHandler.resizeElements(mouseEvent);
  }

  zeroPad(num: number, places: number) {
    return String(num).padStart(places, '0');
  }

  filter() {
    this.homeTableFilteringService.filter();
  }

  clearTableSelection() {
    this.tableService.clearProject();
  }

  clearFilter() {
    this.mapService.clearMapFilter();
    this.filterGroup.patchValue({
      searchText: '',
      andIsChecked: true,
      dropdowns: {
        agencies: [],
        jurisdictions: [],
        projectPhases: [],
        projectTypes: [],
        statuses: [],
        poeLocations: [],
        usernames: [],
        termSelections: []
      }
    });
    this.store.dispatch(new homeActions.ClearProjectFilters());
  }

  export() {
    alert('to do - export table');
  }

  sortChange(sort: MatSort) {
    this.sort = sort;
  }
}
