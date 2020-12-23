import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RolesHomeComponent } from './components/roles-home.component';
import { RolesRoutingModule } from './roles-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { TableComponent } from './components/table/table.component';



@NgModule({
  declarations: [RolesHomeComponent, TableComponent],
  imports: [
    SharedModule,
    RolesRoutingModule,
    CommonModule
  ]
})
export class RolesModule { }
