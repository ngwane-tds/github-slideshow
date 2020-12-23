import {
  Component,
  OnInit,
  OnChanges,
  SimpleChange,
  OnDestroy,
  ViewChild
} from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { MatSort } from '@angular/material/sort';
import { Store, select } from '@ngrx/store';
import * as reportsActions from '../state/reports.actions';
import * as fromReports from '../state/reports.reducer';
import { BehaviorSubject, Subscription } from 'rxjs';
import { reportsRes } from '../types/reports.types';
import { environment } from '../../../../environments/environment';
import { SubSink } from 'subsink';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder } from '@angular/forms';
import { ENDPOINTS as endpoints } from '../../../core/services/endpoint.service.config';
import * as fromHome from '../../home/state/home.reducer';
import * as homeActions from '../../home/state/home.actions';
import { AuthHttpService } from '../../../core/services/auth-http.service';
import { TranslateService } from '@ngx-translate/core';

interface ReportOption {
  ENDPOINT_NAME: string;
  DESCRIPTION: string;
}
@Component({
  selector: 'report-table',
  templateUrl: 'report-table.component.html',
  styleUrls: ['./report-table.component.css']
})
export class ReportTableComponent implements OnChanges, OnInit, OnDestroy {
  private subs = new SubSink();
  dataSource = new BehaviorSubject<reportsRes>(null);
  selectedReport: ReportOption = {
    ENDPOINT_NAME: '',
    DESCRIPTION: ''
  };
  columnHeaders: any;
  reportOptions: ReportOption[];
  displayCols: string[] = [];
  sortedData: any[];
  loading = new BehaviorSubject<boolean>(false);
  selectedReportData: any;
  filterOptions: {
    searchText: string;
    dropdowns: { district: number[]; year: number[] };
  };
  selectedLanguage: string;
  translatedJSON: {
    EXPORT_BUTTON: string;
    EXPORT_OPTIONS: ReportOption[];
    SELECT_REPORT: string;
  } = null;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  rows = new MatTableDataSource(null);

  constructor(
    private store: Store<fromReports.State>,
    private fb: FormBuilder,
    private authHttpService: AuthHttpService,
    private translate: TranslateService
  ) {}

  filterGroup = this.fb.group({
    searchText: '', // TODO: move searchText control to here
    dropdowns: this.fb.group({
      district: [[]],
      year: [[]]
    })
  });

  ngOnInit() {
    this.store
      .pipe(select(fromHome.getLanguage))
      .subscribe((language: string) => {
        this.selectedLanguage = language;
        this.translate.getTranslation(language).subscribe((res) => {
          if (res && res.hasOwnProperty('REPORTS_TAB')) {
            this.selectedReport = { ENDPOINT_NAME: '', DESCRIPTION: '' };
            this.translatedJSON = res.REPORTS_TAB;
          }
        });
      });
  }

  ngAfterViewInit() {
    this.rows.paginator = this.paginator;
  }

  ngOnDestroy() {
    this.dataSource.next(null);
    this.subs.unsubscribe();
  }

  ngOnChanges(change: { [propName: string]: SimpleChange }) {
    this.displayCols = change.dataSource.currentValue.fields.map(
      (field: any) => field.name
    );
  }

  onSelectedReportChange(newValue: string) {
    this.selectedReport = this.translatedJSON.EXPORT_OPTIONS.find(
      (o: ReportOption) => o.ENDPOINT_NAME === newValue
    );
  }
  async export() {
    this.loading.next(true);
    await this.authHttpService
      .getCSV(
        `${
          endpoints.API_CONTROLLER_GETS.REPORTS.GET_CSV[
            this.selectedReport.ENDPOINT_NAME
          ]
        }?lang=${this.selectedLanguage}`
      )
      .then((file) => {
        const blob = new Blob(['\ufeff', file], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.download = `${
          this.selectedLanguage === 'en'
            ? `${this.selectedReport.DESCRIPTION} Report`
            : `Informe ${this.selectedReport.DESCRIPTION}`
        }.csv`; // determines filename
        anchor.href = url;
        anchor.click();
      });
    this.loading.next(false);
  }

  filter() {
    this.loading.next(true);
    const { searchText } = this.filterGroup.value;
    const { district, year } = this.filterGroup.value.dropdowns;
    const districts = district
      .map((d: { district: string }) => `${d.district}`)
      .join();
    const years = year
      .map((y: { fiscal_year: string }) => String(y.fiscal_year))
      .join();

    this.store.dispatch(
      new reportsActions.GetColumnHeadersList(this.selectedReport.ENDPOINT_NAME)
    );
    this.store.dispatch(
      new reportsActions.GetReportData({
        selectedReportName: this.selectedReport.ENDPOINT_NAME,
        districts,
        years,
        searchText
      })
    );
  }

  clearFilter() {
    this.filterGroup.patchValue({
      searchText: '',
      dropdowns: {
        district: [],
        year: []
      }
    });
    this.loading.next(true);
    this.store.dispatch(
      new reportsActions.GetReportData({
        selectedReportName: this.selectedReport.ENDPOINT_NAME
      })
    );
  }

  sortChange(sort: MatSort) {
    const data = this.dataSource.getValue().attributes.slice();
    if (!sort.active || sort.direction === '') {
      this.sortedData = data;
      return;
    }
    this.sortedData = data.sort((a: any, b: any) => {
      const isAsc = sort.direction === 'asc';
      return compare(a[sort.active], b[sort.active], isAsc);
    });
    this.rows.data = this.sortedData;
    function compare(a: number | string, b: number | string, isAsc: boolean) {
      return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
    }
  }
}
