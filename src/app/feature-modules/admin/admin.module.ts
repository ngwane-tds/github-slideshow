import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { reducer } from './state/admin.reducer';
import { AdminRoutingModule } from './admin-routing.module';
import { UsersComponent } from './components/users/users.component';
import { AdminComponent } from './components/admin.component';
import { RolesModule } from './roles-module/roles.module';
import { SharedModule } from 'src/app/shared/shared.module';
// import { AssumptionsComponent } from './components/assumptions/assumptions.component';
import { AdminEffects } from './state/admin.effects';
import { SystemComponent } from './components/system/system.component';

@NgModule({
  declarations: [
    AdminComponent,
    UsersComponent,
    // AssumptionsComponent,
    SystemComponent],
  imports: [
    SharedModule,
    CommonModule,
    StoreModule.forFeature('admin', reducer),
    EffectsModule.forFeature([AdminEffects]),
    AdminRoutingModule,
    RolesModule,
    TranslateModule
  ]
})
export class AdminModule {}
