import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { ChartType, ChartOptions, ChartDataSets } from 'chart.js';
import { BehaviorSubject, Observable } from 'rxjs';
import { Label } from 'ng2-charts';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';

@Component({
  selector: 'app-chart-3',
  templateUrl: './chart-3.component.html',
  styleUrls: ['./chart-3.component.css']
})
export class Chart3Component implements OnInit {
  @Input() chart3Data: [] = [];
  @Input() labels: any;
  isLoading = true;
  public chart3Options: ChartOptions = {
    plugins: {
      datalabels: {
        formatter: function (value, context) {
          return value.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
          });
        }
      }
    },
    tooltips: {
      callbacks: {
        label: function (t, d) {
          var yLabel =
            t.yLabel >= 1000
              ? '$' + t.yLabel.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
              : '$' + t.yLabel;
          return yLabel;
        }
      }
    },
    responsive: true,
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
            callback: function (value, index, values) {
              return value.toLocaleString('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
              });
            }
          }
        }
      ]
    },
    legend: {
      position: 'top',
      display: false
    }
  };
  public chart3Labels: Label[] = [];
  public chart3Type: ChartType = 'bar';

  constructor() {}

  ngOnInit() {}

  ngOnChanges(change: any) {
    if (change.chart3Data && change.chart3Data.currentValue.length) {
      this.chart3Data = change.chart3Data.currentValue.map((dataPoint: any) => {
        return dataPoint.value;
      });
      this.chart3Labels = change.chart3Data.currentValue.map(
        (dataPoint: any) => {
          return dataPoint.name;
        }
      );

      this.isLoading = false;
    }
  }
}
