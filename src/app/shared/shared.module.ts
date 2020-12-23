import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { MaterialModules } from './material-modules';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './components/login/login.component';
import { TranslateModule } from '@ngx-translate/core';
import { BasicDialogComponent } from './dialogs/basic-dialog/basic-dialog.component';
import { ErrorDialogComponent } from './dialogs/error-dialog/error-dialog.component';
import { ConfirmDialogComponent } from './dialogs/confirm-dialog/confirm-dialog.component';

@NgModule({
  declarations: [HeaderComponent, LoginComponent, BasicDialogComponent, ErrorDialogComponent, ConfirmDialogComponent],
  exports: [HeaderComponent, MaterialModules, FormsModule, ReactiveFormsModule],
  imports: [
    MaterialModules,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    TranslateModule
  ]
})
export class SharedModule {}
