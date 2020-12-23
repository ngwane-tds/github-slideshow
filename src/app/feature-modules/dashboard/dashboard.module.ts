import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartsModule } from 'ng2-charts';
import { DashboardComponent } from './dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { StoreModule } from '@ngrx/store';
import { MatTableModule } from '@angular/material/table';
import { reducer } from './state/dashboard.reducer';
import { EffectsModule } from '@ngrx/effects';
import { DashboardEffects } from './state/dashboard.effects';

import { Chart1Component } from './components/chart-1.component';
import { Chart2Component } from './components/chart-2.component';
import { Chart3Component } from './components/chart-3.component';

@NgModule({
  declarations: [
    DashboardComponent,
    Chart1Component,
    Chart2Component,
    Chart3Component
  ],
  imports: [
    SharedModule,
    CommonModule,
    DashboardRoutingModule,
    ChartsModule,
    StoreModule.forFeature('dashboard', reducer),
    EffectsModule.forFeature([DashboardEffects]),
    MatTableModule
  ]
})
export class DashboardModule {}
