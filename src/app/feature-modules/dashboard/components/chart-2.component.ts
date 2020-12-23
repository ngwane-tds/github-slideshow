import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { ChartType, ChartOptions } from 'chart.js';
import * as fromHome from '../../home/state/home.reducer';
import * as homeActions from '../../home/state/home.actions';
import { select, Store } from '@ngrx/store';
@Component({
  selector: 'app-chart-2',
  templateUrl: './chart-2.component.html',
  styleUrls: ['./chart-2.component.scss']
})
export class Chart2Component implements OnInit, OnChanges {
  hoveringLegend: boolean = false;
  hoveringLegendValue: string = 'test';
  @Input() chart2Data: any;
  selectedLanguage: string;
  componentRef = this;
  public labels: any[] = [];
  public data: any[] = [];
  public pieChartType: ChartType = 'bar';
  public chartOptions = {
    plugins: {
      datalabels: {
        display: false
      }
    },
    title: {
      display: false
    }
    // legend: {
    //   position: 'left',
    //   display: true,
    //   onHover: (event: any, legendItem: any) => {
    //     const name = this.pieChartLabels.find(
    //       (item) => item === legendItem.text
    //     );
    //     const idx = this.pieChartLabels.indexOf(name);
    //     this.hoveringLegend = true;
    //     this.hoveringLegendValue = `${legendItem.text}: ${
    //       this.selectedLanguage === 'es-mx' ? 'Mex$ ' : '$ '
    //     } ${this.pieChartData[idx]}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    //   },
    //   onLeave: () => {
    //     this.hoveringLegend = false;
    //   }
    // },
    // plugins: {
    //   datalabels: {
    //     align: 'start',
    //     offset: '-10',
    //     borderWidth: 2,
    //     borderColor: '#fff',
    //     borderRadius: 35,
    //     backgroundColor: (context: any) => {
    //       return context.dataset.backgroundColor;
    //     },
    //     formatter: (value: any) => {
    //       return `${
    //         this.selectedLanguage === 'es-mx' ? 'Mex$ ' : '$ '
    //       }${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    //     }
    //   }
    // }
  };
  isLoading = true;
  constructor(private store: Store<fromHome.State>) {}
  ngOnInit() {
    this.store
      .pipe(select(fromHome.getLanguage))
      .subscribe((language: string) => {
        this.selectedLanguage = language;
      });
  }
  ngOnChanges(change: any) {
    if (change.chart2Data.currentValue.length) {
      this.data = change.chart2Data.currentValue;
      this.labels = [
        'Roadway',
        'Interchange',
        'Railroad',
        'Port of Entry',
        'Crossborder',
        'Short Term'
      ];
      this.isLoading = false;
    }
  }
}
