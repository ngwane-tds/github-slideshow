import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Store, select } from '@ngrx/store';
import * as fromHome from '../state/home.reducer';
import * as homeActions from '../state/home.actions';
import { MapService } from '../map/services/map.service';
@Injectable({
  providedIn: 'root'
})
export class TableService {
  selectedProject: BehaviorSubject<any> = new BehaviorSubject(null);
  constructor(
    private store: Store<fromHome.State>,
    private mapService: MapService
  ) {}

  selectProject(row: any) {
    if (row !== this.selectedProject.value) {
      // language changed, row is the same
      this.selectedProject.next(row);
      this.store.dispatch(
        new homeActions.SetSelectedProject({
          projectTypeId: row.projectTypeId,
          projectId: row.projectId,
          id: row.id
        })
      );
      this.store.dispatch(
        new homeActions.SetAreNewProjRequiredFieldsEntered(true)
      );
    } else {
      this.clearProject();
    }
    this.scrollToRow(row.id);
    // TODO: this.scrollToRow(row.id) needs reworking due to paginator only displaying a portion of table elements. Is this functionality still possible with a paginator?
    // const type = row.contract_id.length ? 'contract' : 'itemSeg';
    // this.mapService.zoomToRecord(row.id, type);
  }

  clearProject() {
    this.selectedProject.next(null);
    this.store.dispatch(new homeActions.ClearSelectedProject());
    this.store.dispatch(
      new homeActions.SetAreNewProjRequiredFieldsEntered(false)
    );
  }

  scrollToRow(id: number) {
    // TODO: needs reworking due to paginator. Is this functionality still possible?
    const scrollToTarget = (target: HTMLElement, containerEl: HTMLElement) => {
      const offset = target.offsetTop;
      containerEl.scrollTop = offset - 56;
    };

    const scrollableDiv = document.getElementById('scrollableDiv');
    const el = id.toString();
    const targetElement = document.getElementById(el);
    scrollToTarget(targetElement, scrollableDiv);
  }

}
