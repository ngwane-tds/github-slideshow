import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef, MatDialogConfig } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { SecurityContext } from '@angular/core';

import { BasicDialogData, BasicDialogComponent } from '../../shared/dialogs/basic-dialog/basic-dialog.component';
import { ConfirmDialogComponent } from '../../shared/dialogs/confirm-dialog/confirm-dialog.component';
import { ErrorDialogComponent } from '../../shared/dialogs/error-dialog/error-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  defaultWidth = 400;
  defaultHeight = 200;

  constructor(
    private dialog: MatDialog,
    private dom: DomSanitizer
  ) { }


  alert(config: BasicDialogData): MatDialogRef<BasicDialogComponent> {
    const dialogConfig = this.config(config);
    dialogConfig.data.title = config.title ? config.title : 'ALERT';
    dialogConfig.disableClose = true; // we don't want the user to close the dialog by clicking outside it..
    return this.dialog.open(BasicDialogComponent, dialogConfig);
  }

  error(config: BasicDialogData): MatDialogRef<ErrorDialogComponent> {
    const dialogConfig = this.config(config);
    dialogConfig.data.title = config.title ? config.title : 'ERROR';
    dialogConfig.disableClose = true; // we don't want the user to close the dialog by clicking outside it..
    const dialogRef = this.dialog.open(ErrorDialogComponent, dialogConfig);
    dialogRef.componentInstance.showActionButtons = typeof config.showActionButtons === 'boolean' ? config.showActionButtons : true;
    const htmlMessage = typeof config.htmlMessage === 'string' ? config.htmlMessage.split(',').join('') : '';
    dialogRef.componentInstance.htmlMessage = this.dom.sanitize(SecurityContext.HTML, htmlMessage);
    return dialogRef;
  }

  confirm(config: BasicDialogData): MatDialogRef<ConfirmDialogComponent> {
    const dialogConfig = this.config(config);
    dialogConfig.data.title = config.title ? config.title : 'CONFIRM';
    dialogConfig.disableClose = true; // we don't want the user to close the dialog by clicking outside it..
    const dialogRef = this.dialog.open(ConfirmDialogComponent, dialogConfig);
    dialogRef.componentInstance.showActionButtons = true;
    const htmlMessage = typeof config.htmlMessage === 'string' ? config.htmlMessage : '';
    dialogRef.componentInstance.htmlMessage = this.dom.sanitize(SecurityContext.HTML, htmlMessage);
    return dialogRef;
  }

  private config(config: BasicDialogData): MatDialogConfig {
    const dialogConfig = new MatDialogConfig();
    const dialogWidth = +config.width > 0 ? +config.width : this.defaultWidth;
    const dialogHeight = +config.height > 0 ? +config.height : this.defaultHeight;
    dialogConfig.data = {
      title: config.title,
      message: config.message,
      width: dialogWidth,
      height: dialogHeight,
      showActionButtons: typeof config.showActionButtons === 'boolean' ? config.showActionButtons : true
    };
    return dialogConfig;
  }

}
