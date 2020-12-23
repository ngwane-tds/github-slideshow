import {
  Component,
  ChangeDetectorRef,
  Output,
  EventEmitter,
  OnInit
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { BehaviorSubject } from 'rxjs';
import { Store, select } from '@ngrx/store';

import { DetailsPaneAnimations } from './details-pane-animations';
import * as fromHome from '../../state/home.reducer';
import * as homeActions from '../../state/home.actions';
import { HomeMode, DetailMode } from '../../types/home.mode.types';

@Component({
  selector: 'details-pane',
  templateUrl: 'details-pane.html',
  styleUrls: ['details-pane.sass'],
  animations: DetailsPaneAnimations
})
export class DetailsPane implements OnInit {
  isSaveClicked = false;
  isDeleteClicked = false;
  isSubmitClicked = false;
  @Output() toggleMode = new EventEmitter<any>();

  constructor(
    private cdr: ChangeDetectorRef,
    private store: Store<fromHome.State>
  ) {}

  mode = new BehaviorSubject<string>('tableCriticalDateMode');
  canEditGeometry = new BehaviorSubject<boolean>(false);
  form: FormGroup;

  collapsePanels() {}

  ngOnInit() {
    // get detail mode
    this.store
    .pipe(select(fromHome.getHomeMode))
    .subscribe(async (mode: any) => {
      // handle detail mode
      if (mode && mode.homeMode === HomeMode.detailsMode) {
        // new project
        if (mode && mode.detailMode === DetailMode.addMode) {
          this.canEditGeometry.next(false);
        // existing project
        } else {
          this.canEditGeometry.next(true);
        }
      }
    });
    // project save success
    this.store
    .pipe(select(fromHome.projectSaveSuccess))
    .subscribe(async (result: any) => {
      if (result && result.projectId) {
        this.canEditGeometry.next(true);
      } else {
        this.canEditGeometry.next(false);
      }
    });
  }

  onTabChanged(event: MatTabChangeEvent) {
    this.store.dispatch(new homeActions.DetailsTabChange(event.index));
  }

  onSaveClicked(event: boolean): void {
    this.isSaveClicked = event;
  }

  onDeleteClicked(event: boolean): void {
    this.isDeleteClicked = event;
    this.store.dispatch(new homeActions.DetailsTabChange(0));
  }

  onSubmitClicked(event: boolean): void {
    this.isSubmitClicked = event;
  }

}
