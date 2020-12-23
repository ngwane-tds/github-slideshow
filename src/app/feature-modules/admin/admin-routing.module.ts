import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './components/admin.component';
// import { AssumptionsComponent } from './components/assumptions/assumptions.component';
import { UsersComponent } from './components/users/users.component';
import { SystemComponent } from './components/system/system.component';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      // { path: 'assumptions', component: AssumptionsComponent },
      { path: 'system', component: SystemComponent },
      { path: 'users', component: UsersComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {}
