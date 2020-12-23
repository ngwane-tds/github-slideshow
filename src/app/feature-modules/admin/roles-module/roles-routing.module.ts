import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RolesHomeComponent } from './components/roles-home.component';

const routes: Routes = [
  { path: '', component: RolesHomeComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RolesRoutingModule { }
