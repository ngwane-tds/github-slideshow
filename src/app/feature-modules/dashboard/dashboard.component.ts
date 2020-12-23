import { Component, OnInit, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import * as fromDashboard from './state/dashboard.reducer';
import * as dashboardActions from './state/dashboard.actions';
import { MatSelectChange } from '@angular/material/select';
import { FormControl } from '@angular/forms';
import * as fromHome from '../home/state/home.reducer';
import * as homeActions from '../home/state/home.actions';
import { ENDPOINTS as endpoints } from 'src/app/core/services/endpoint.service.config';
import { ProjectTypeCodes } from 'src/app/shared/models/dtos';

interface Year {
  // value: number;
  value: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.sass']
})
export class DashboardComponent implements OnInit, OnDestroy {
  elevateCard = true;
  isLoading = new BehaviorSubject<boolean>(true);
  public chart1Labels = new BehaviorSubject<any>(null);
  public chart1Data = new BehaviorSubject<any>(null);
  public chart2Labels = new BehaviorSubject<any>(null);
  public chart2Data = new BehaviorSubject<any>(null);
  public chart3Data = new BehaviorSubject<any>(null);
  public chart3Labels = new BehaviorSubject<[]>(null);
  public chart3DataLaborHours = new BehaviorSubject<[]>(null);
  public chart3DataContractFTE = new BehaviorSubject<[]>(null);
  public chart3DataWorkFTE = new BehaviorSubject<[]>(null);
  allProjectData: any;
  constructor(private store: Store<fromDashboard.State>) {}

  getChartOneData(allProjectData: any) {
    const numProjectPerType = Object.keys(allProjectData).map(
      (projectType: string) => ({
        name: projectType.split('_').join(' '),
        value: allProjectData[projectType].length
      })
    );
    return numProjectPerType;
  }

  getChartTwoData(allProjectData: any) {
    const allProjectDataCombined: any = [];
    const keys = Object.keys(allProjectData);
    keys.forEach((d: any) => {
      allProjectData[d].forEach((dataObj: any) => {
        allProjectDataCombined.push(dataObj);
      });
    });
    let shortTermData = [0, 0, 0, 0, 0, 0];
    let medTermData = [0, 0, 0, 0, 0, 0];
    let longTermData = [0, 0, 0, 0, 0, 0];
    let nullData = [0, 0, 0, 0, 0, 0];

    allProjectDataCombined.map((d: any) => {
      if (d.project && d.project.hasOwnProperty('projectTypeId')) {
        switch (d.project.projectTypeId) {
          case ProjectTypeCodes.roadway:
            switch (d.termSelection) {
              case 'Short-term':
                shortTermData[0]++;
                return;
              case 'Medium-term':
                medTermData[0]++;
                return;
              case 'Long-term':
                longTermData[0]++;
                return;
              case null:
                nullData[0]++;
                return;
              default:
                const err = new Error(`Unhandled case ${d.termSelection}`);
                throw err;
            }
          case ProjectTypeCodes.interchange:
            switch (d.termSelection) {
              case 'Short-term':
                shortTermData[1]++;
                return;
              case 'Medium-term':
                medTermData[1]++;
                return;
              case 'Long-term':
                longTermData[1]++;
                return;
              case null:
                nullData[1]++;
                return;
              default:
                const err = new Error(`Unhandled case ${d.termSelection}`);
                throw err;
            }
          case ProjectTypeCodes.railroad:
            switch (d.termSelection) {
              case 'Short-term':
                shortTermData[2]++;
                return;
              case 'Medium-term':
                medTermData[2]++;
                return;
              case 'Long-term':
                longTermData[2]++;
                return;
              case null:
                nullData[2]++;
                return;
              default:
                const err = new Error(`Unhandled case ${d.termSelection}`);
                throw err;
            }
          case ProjectTypeCodes.portOfEntry:
            switch (d.termSelection) {
              case 'Short-term':
                shortTermData[3]++;
                return;
              case 'Medium-term':
                medTermData[3]++;
                return;
              case 'Long-term':
                longTermData[3]++;
                return;
              case null:
                nullData[3]++;
                return;
              default:
                const err = new Error(`Unhandled case ${d.termSelection}`);
                throw err;
            }
          case ProjectTypeCodes.crossBorder:
            switch (d.termSelection) {
              case 'Short-term':
                shortTermData[4]++;
                return;
              case 'Medium-term':
                medTermData[4]++;
                return;
              case 'Long-term':
                longTermData[4]++;
                return;
              case null:
                nullData[4]++;
                return;
              default:
                const err = new Error(`Unhandled case ${d.termSelection}`);
                throw err;
            }
          case ProjectTypeCodes.shortTerm:
            switch (d.termSelection) {
              case 'Short-term':
                shortTermData[5]++;
                return;
              case 'Medium-term':
                medTermData[5]++;
                return;
              case 'Long-term':
                longTermData[5]++;
                return;
              case null:
                nullData[5]++;
                return;
              default:
                const err = new Error(`Unhandled case ${d.termSelection}`);
                throw err;
            }
          case null:
            return;
          default:
            const err = new Error(
              `Unhandled project type in dashboard component: ${d.project.projectTypeId}`
            );
            throw err;
        }
      } else {
        console.log('no projectTypeId property on dashboard object');
        return;
      }
    });

    const res = [
      { data: shortTermData, label: 'Short Term', stack: 'a' },
      { data: medTermData, label: 'Medium Term', stack: 'a' },
      { data: longTermData, label: 'Long Term', stack: 'a' },
      { data: nullData, label: 'Not specified', stack: 'a' }
    ];

    return res;
  }

  getChartThreeData(allProjectData: any) {
    const projectCostByProjectType = Object.keys(allProjectData).map(
      (projectType: string) => ({
        name: projectType.split('_').join(' '),
        value: allProjectData[projectType].reduce((acc: any, cur: any) => {
          return cur.totalProjectCost ? acc + cur.totalProjectCost : acc;
        }, 0)
      })
    );
    return projectCostByProjectType;
  }

  ngOnInit() {
    this.store
      .pipe(select(fromDashboard.getAllProjectData))
      .subscribe((allProjectData) => {
        if (allProjectData) {
          this.chart1Data.next(this.getChartOneData(allProjectData));
          this.chart2Data.next(this.getChartTwoData(allProjectData));
          this.chart3Data.next(this.getChartThreeData(allProjectData));
        }
      });
    this.store
      .pipe(select(fromHome.getLanguage))
      .subscribe((language: string) => {
        if (language) {
          this.store.dispatch(new dashboardActions.GetAllProjectData(language));
        }
      });
  }

  ngOnDestroy() {
    this.store.dispatch(new dashboardActions.ClearDashboard());
  }
}
