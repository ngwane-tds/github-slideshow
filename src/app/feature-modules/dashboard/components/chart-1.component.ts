import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { ChartType, ChartOptions } from 'chart.js';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';

@Component({
  selector: 'app-chart-1',
  templateUrl: './chart-1.component.html',
  styleUrls: ['./chart-1.component.css']
})
export class Chart1Component implements OnInit, OnChanges {
  @Input() chart1Data: any;
  @Input() labels: any;
  public pieChartLabels: any[] = [];
  public pieChartData: any = [];
  public pieChartType: ChartType = 'doughnut';
  public chartOptions = {
    plugins: {
      datalabels: {
        display: true
      }
    },
    title: {
      display: false
    },
    legend: {
      position: 'left',
      display: true
    }
  };
  public pieChartPlugins = [pluginDataLabels];
  public pieChartColors = [
    {
      // if custom color scheme is desired
      // backgroundColor: [
      //   'rgba(255,0,0,0.3)',
      //   'rgba(0,255,0,0.3)',
      //   'rgba(0,0,255,0.3)'
      // ]
    }
  ];
  isLoading = true;

  constructor() {}
  ngOnInit() {}
  ngOnChanges(change: any) {
    if (change.chart1Data.currentValue.length) {
      this.pieChartData = change.chart1Data.currentValue.map(
        (dataPoint: any) => dataPoint.value
      );
      this.pieChartLabels = change.chart1Data.currentValue.map(
        (dataPoint: any) => dataPoint.name
      );
      this.isLoading = false;
    }
  }
}
