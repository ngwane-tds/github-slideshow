import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  ViewChild,
  OnDestroy
} from '@angular/core';
import { HomeAnimations } from './home.animations';
import { BehaviorSubject, Observable, fromEvent } from 'rxjs';
import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';

import * as homeActions from '../state/home.actions';
import { Filters } from '../types/home.filter.types';
import { HomeMode, DetailMode } from '../types/home.mode.types';
import * as fromHome from '../state/home.reducer';
import { ProjectDTO } from 'src/app/shared/models/dtos';
import { MapService } from '../map/services/map.service';
import { DetailsPane } from './details-pane/details-pane';
import { TableService } from '../services/table.service';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass'],
  animations: HomeAnimations,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit, OnDestroy {
  @ViewChild(DetailsPane, { static: true }) detailsPane: DetailsPane;
  projects$: Observable<{ attributes: ProjectDTO[]; fields: any }>;
  filterOptions$: Observable<Filters>;
  mode = new BehaviorSubject<string>(HomeMode.tableMode);
  isMapViewReady = false;
  isProjectSelected = false;
  detailMode = '';
  loginSuccess = false;
  systemOpen = false;

  private ngUnsubscribe$: Subject<void> = new Subject<void>();

  constructor(
    private store: Store<fromHome.State>,
    public tableService: TableService,
    private mapService: MapService
  ) {}

  ngOnInit() {
    // make call to check if system is open
    this.store.dispatch(new homeActions.GetSystemIsOpen());
    this.store
    .pipe(select(fromHome.systemIsOpen))
    .subscribe((systemOpen: any) => {
      if (typeof systemOpen === 'boolean') {
        this.systemOpen = systemOpen;
      }
    });
    this.store
      .pipe(select(fromHome.getSelectedProject))
      .subscribe((project) => {
        if (project) {
          this.isProjectSelected = true;
          this.mapService.highlightProject(project.project.projectNumber);
        } else {
          this.isProjectSelected = false;
          this.fabIcon(false);
          this.mapService.highlightClear();
        }
      });
    this.store
      .pipe(select(fromHome.userLoginSuccess))
      .subscribe((loginSuccess: boolean) => {
        this.loginSuccess = loginSuccess;
      });
    this.store
      .pipe(select(fromHome.getLanguage))
      .subscribe((language: string) => {
        if (language && this.loginSuccess) {
          this.store.dispatch(new homeActions.ClearProjects());
          this.store.dispatch(new homeActions.ClearSelectedProject());
          this.store.dispatch(
            new homeActions.SetAreNewProjRequiredFieldsEntered(false)
          );
          this.store.dispatch(new homeActions.GetAllLookups(language));
          this.store.dispatch(new homeActions.GetProjects(language));
          this.store.dispatch(new homeActions.GetFilterOptions(language));
        }
      });
    this.projects$ = this.store
      .pipe(select(fromHome.getProjects))
      .pipe(takeUntil(this.ngUnsubscribe$));

    this.filterOptions$ = this.store.pipe(select(fromHome.getFilterOptions));

    this.store
      .pipe(select(fromHome.getIsMapViewReady))
      .subscribe((isMapViewReady: boolean) => {
        if (isMapViewReady) {
          this.isMapViewReady = isMapViewReady;
        }
      });

    this.store
      .pipe(select(fromHome.projectDeleteSuccess))
      .subscribe(async (result: any) => {
        if (result && result.deleted) {
          await this.mapService.deleteProject(result.deleted.projectNumber);
          this.tableService.clearProject();
          this.toggleMode();
        }
      });

    // close details / deselect after submit
    // this is to stop the user from accidently editing the geometry after
    this.store
      .pipe(select(fromHome.projectSubmitSuccess))
      .subscribe(async (result: any) => {
        if (result && result.isSubmitted) {
          this.tableService.clearProject();
          this.toggleMode();
        }
      });

    this.attachFabToTablePane();
  }

  ngOnDestroy() {
    this.store.dispatch(new homeActions.ClearProjects());
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }

  toggleMode() {
    this.mode.next(
      this.mode.getValue() === HomeMode.tableMode
        ? HomeMode.detailsMode
        : HomeMode.tableMode
    );
    this.store.dispatch(
      new homeActions.HomeModeChange({
        homeMode: this.mode.value,
        detailMode: this.detailMode
      })
    );
  }

  fabClick() {
    if (this.mode.getValue() === HomeMode.detailsMode) {
      this.detailsPane.collapsePanels();
    }
    this.toggleMode();
  }

  fabIcon(isProjectSelected: boolean) {
    if (this.mode.getValue() === HomeMode.tableMode) {
      this.detailMode = isProjectSelected
        ? DetailMode.infoMode
        : DetailMode.addMode;
      // details pane is closed
      return this.detailMode;
    } else {
      // details pane is open
      return 'arrow_back';
    }
  }

  iconToolTip(isProjectSelected: boolean) {
    if (this.mode.getValue() === HomeMode.tableMode) {
      return isProjectSelected ? 'View Details' : 'Add a Project';
    } else {
      return 'Close Details';
    }
  }

  attachFabToTablePane() {
    const pane = document.getElementById('tablePane');
    const container = document.getElementById('fabMotionContainer');

    const setContainerHeight = () => {
      container.style.height = `${
        window.innerHeight - pane.offsetHeight - 100
      }px`;
    };

    setContainerHeight();
    fromEvent(pane, 'resize').subscribe(() => setContainerHeight());
    fromEvent(window, 'resize').subscribe(() => setContainerHeight());
  }
}
