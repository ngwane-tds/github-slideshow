import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { StoreModule } from '@ngrx/store';

import { HomeRoutingModule } from './home-routing.module';
import { MapModule } from './map/map.module';
import { TablePaneComponent } from './components/table-pane/table-pane';
import { DetailsPane } from './components/details-pane/details-pane';
import { AttributeTableComponent } from './components/attribute-table/attribute-table';
import { TableService } from './services/table.service';
import { HomeComponent } from './components/home.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ProjectDetailsTabComponent } from './components/details-pane/project-details-tab/project-details-tab.component';
import { GeometryTabComponent } from './components/details-pane/geometry-tab/geometry-tab.component';

import { reducer } from './state/home.reducer';
import { DetailsPaneHeaderComponent } from './components/details-pane/details-pane-header/details-pane-header.component';


@NgModule({
  declarations: [
    HomeComponent,
    TablePaneComponent,
    DetailsPane,
    AttributeTableComponent,
    ProjectDetailsTabComponent,
    GeometryTabComponent,
    DetailsPaneHeaderComponent
  ],
  providers: [TableService],
  imports: [
    MapModule,
    CommonModule,
    HomeRoutingModule,
    SharedModule,
    TranslateModule,
    StoreModule.forFeature('home', reducer)
  ],
  exports: [HomeComponent]
})
export class HomeModule {}
