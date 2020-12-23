import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MatSort } from '@angular/material/sort';
import { AuthHttpService } from 'src/app/core/services/auth-http.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {
  luReports: any[] = [];
  reportDefinitions: any[] = [];
  selectedId = new BehaviorSubject<number>(0);
  selectedIdName = new BehaviorSubject<string>('');
  displayedColumns = new BehaviorSubject<any[]>([]);
  fields = new BehaviorSubject<any[]>([]);
  loadingTable = new BehaviorSubject<boolean>(false);
  loadingReportList = new BehaviorSubject<boolean>(false);
  reportDefinition = new BehaviorSubject<string>(null);
  selectedReport: string;
  searchText: string;
  sort: MatSort = new MatSort();

  constructor(private authHttpService: AuthHttpService) {}

  ngOnInit() {}

  sortChange(sort: MatSort) {
    this.sort = sort;
  }

  getSortText() {
    const { active, direction } = this.sort;
    return active && direction
      ? `&sort_column=${active}&ascending=${direction === 'asc'}`
      : '';
  }

  // onReportSelect(event: any) {
  //   this.loadingTable.next(true);
  //   this.selectedReport = event.value;
  //   this.getReport('?1=1');
  // }

  export() {}

  search() {}

  // private getReport(odataFilter: string) {
  //   this.loadingTable.next(true);
  //   this.displayedColumns.next(null);
  //   this.fields.next(null);
  //   this.dataSource.next(null);
  //   Promise.all([
  //     this.authHttpService.get(
  //       'adminViewInfo/Get?view_name=' + this.selectedReport
  //     ),
  //     this.authHttpService.get(this.selectedReport + odataFilter)
  //   ])
  //     .then((resArray) => {
  //       const res = resArray[0];
  //       const report = resArray[1];
  //       if (res && res.length > 0 && report) {
  //         const resFields = [];
  //         const cols = res.map((x: any) => x.COLUMN_NAME);
  //         for (const item of res) {
  //           resFields.push({
  //             alias: item.LOGICAL_NAME,
  //             name: item.COLUMN_NAME,
  //             type: item.DATA_TYPE
  //           });
  //         }
  //         this.reportDefinition.next(
  //           this.reportDefinitions.find((i) => i.id === this.selectedReport)
  //             .value
  //         );
  //         this.displayedColumns.next(cols);
  //         this.fields.next(resFields);
  //         const result: any = {
  //           attributes: [],
  //           fields: []
  //         };
  //         result.attributes = report;
  //         result.fields = this.fields.getValue();
  //         this.dataSource.next(result);
  //         this.loadingTable.next(false);
  //       }
  //     })
  //     .catch((e) => console.error('Report error:', e));
  // }
}
