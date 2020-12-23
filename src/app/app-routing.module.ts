import { NgModule } from '@angular/core';
import { Routes, RouterModule, CanActivate } from '@angular/router';
import { PageNotFoundComponent } from './page-not-found.component';
import { LoginComponent } from './shared/components/login/login.component';
import { AuthGuardService as AuthGuard } from '../app/core/services/auth-guard.service';

const routes: Routes = [
  { path: '', component: LoginComponent },
  {
    path: 'home',
    loadChildren: () =>
      import('./feature-modules/home/home.module').then((m) => m.HomeModule),
      canActivate: [AuthGuard]
  },
  { path: 'login', component: LoginComponent },
  {
    path: 'reports',
    loadChildren: () =>
      import('./feature-modules/reports/reports.module').then(
        (m) => m.ReportsModule
      ),
      canActivate: [AuthGuard]

  },
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./feature-modules/dashboard/dashboard.module').then(
        (m) => m.DashboardModule
      ),
      canActivate: [AuthGuard]

  },
  // { path: 'dashboard', component: DashboardComponent },
  {
    path: 'admin',
    loadChildren: () =>
      import('./feature-modules/admin/admin.module').then((m) => m.AdminModule),
      canActivate: [AuthGuard]

  },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      // enableTracing: true // <-- debugging purposes only
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
