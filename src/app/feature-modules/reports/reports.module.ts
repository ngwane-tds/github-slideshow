import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportsRoutingModule } from './reports-routing.module';
import { ReportTableComponent } from './components/report-table.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReportsComponent } from './reports.component';
import { StoreModule } from '@ngrx/store';
import { reducer } from './state/reports.reducer';
import { ReportsEffects } from './state/reports.effects';
import { EffectsModule } from '@ngrx/effects';

@NgModule({
  declarations: [ReportsComponent, ReportTableComponent],
  imports: [
    SharedModule,
    CommonModule,
    ReportsRoutingModule,
    StoreModule.forFeature('reports', reducer),
    EffectsModule.forFeature([ReportsEffects])
  ]
})
export class ReportsModule {}
