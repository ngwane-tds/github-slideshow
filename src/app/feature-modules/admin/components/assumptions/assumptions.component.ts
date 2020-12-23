import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import * as adminActions from '../../state/admin.actions';
import * as fromAdmin from '../../state/admin.reducer';
import { BehaviorSubject, Subscription } from 'rxjs';
import { SubSink } from 'subsink';
import { MatSelectChange } from '@angular/material/select';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-assumptions',
  templateUrl: './assumptions.component.html',
  styleUrls: ['./assumptions.component.scss']
})
export class AssumptionsComponent implements OnInit, OnDestroy {
  constructor(private store: Store<fromAdmin.State>) {}
  private subs = new SubSink();
  reportOptions: any[];
  columnHeaders: any[];
  displayCols: string[] = [];
  sortedData: any[];
  selectedReport: string;
  selectedReportData: any;
  dataSource = new BehaviorSubject<any>(null);
  loading = new BehaviorSubject<boolean>(false);

  ngOnInit(): void {
    this.store.dispatch(new adminActions.GetAssumptionsReportList());

    this.subs.sink = this.store
      .pipe(select(fromAdmin.getAssumptionsReportsList))
      .subscribe((reports) => {
        this.reportOptions = reports;
      });

    this.subs.sink = this.store
      .pipe(select(fromAdmin.getColumnHeadersList))
      .subscribe((columnHeaders) => {
        this.columnHeaders = columnHeaders.map((columnHeader) => columnHeader);
        this.displayCols = columnHeaders.map(
          (columnHeader: any) => columnHeader.columnName
        );
      });

    this.subs.sink = this.store
      .pipe(select(fromAdmin.getSelectedReportData))
      .subscribe((reports) => {
        if (this.selectedReport) {
          this.selectedReportData = reports;
        }
        const res: any = {
          attributes: reports,
          fields: []
        };
        for (const item of this.columnHeaders) {
          res.fields.push({
            alias: item.logicalName,
            name: item.columnName,
            type: item.format
          });
        }
        this.dataSource.next(res);
        this.loading.next(false);
      });
  }

  ngOnDestroy() {
    this.dataSource.next(null);
    this.subs.unsubscribe();
  }

  onReportSelect(event: MatSelectChange) {
    this.loading.next(true);
    const { value } = event;
    this.store.dispatch(
      new adminActions.GetAssumptionsColumnHeadersList(value)
    );
    setTimeout(() => {
      this.store.dispatch(new adminActions.GetAssumptionsReportData(value));
    }, 300);
  }

  sortChange(sort: MatSort) {
    const data = this.dataSource.getValue().attributes.slice();
    const isAsc = sort.direction === 'asc';
    if (!sort.active || sort.direction === '') {
      this.sortedData = data;
      return;
    }
    if (sort.active === 'month_name') {
      // sort based on the value in the monthNames object
      const monthNames: any = {
        Jan: 1,
        Feb: 2,
        Mar: 3,
        Apr: 4,
        May: 5,
        Jun: 6,
        Jul: 7,
        Aug: 8,
        Sep: 9,
        Oct: 10,
        Nov: 11,
        Dec: 12
      };
      this.sortedData = data.sort(function(a: any, b: any) {
        if (isAsc) {
          return monthNames[a.month_name] - monthNames[b.month_name];
        } else {
          return monthNames[b.month_name] - monthNames[a.month_name];
        }
      });
      this.dataSource.next({
        ...this.dataSource.getValue(),
        attributes: this.sortedData
      });
      return;
    }
    this.sortedData = data.sort((a: any, b: any) => {
      return compare(a[sort.active], b[sort.active], isAsc);
    });
    this.dataSource.next({
      ...this.dataSource.getValue(),
      attributes: this.sortedData
    });
    // alphabetical sort
    function compare(a: number | string, b: number | string, isAsc: boolean) {
      return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
    }
  }
}
