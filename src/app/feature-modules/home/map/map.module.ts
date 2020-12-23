import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapComponent } from './components/map/map.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [MapComponent],
  imports: [
    SharedModule,
    CommonModule
  ],
  exports: [
    MapComponent
  ]
})
export class MapModule { }
