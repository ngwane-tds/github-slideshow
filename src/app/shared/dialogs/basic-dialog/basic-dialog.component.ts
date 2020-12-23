import { Component, ChangeDetectionStrategy, Inject, HostBinding } from '@angular/core';

import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

export interface BasicDialogData {
  title?: string;
  message: string;
  htmlMessage?: string;
  height?: number;
  width?: number;
  showActionButtons?: boolean;
}

@Component({
  selector: 'app-basic-dialog',
  templateUrl: './basic-dialog.component.html',
  styleUrls: ['./basic-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BasicDialogComponent {

  @HostBinding('style.height') height: string;
  @HostBinding('style.width') width: string;

  htmlMessage: string;
  showActionButtons = true;

  constructor(
    public dialogRef: MatDialogRef<BasicDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: BasicDialogData,
  ) {
    if (this.data.height) {
      this.height = `${this.data.height.toString()}px`;
    }
    if (this.data.width) {
      this.width = `${this.data.width.toString()}px`;
    }
  }

  closeDialog(output: any) {
    this.dialogRef.close(output);
  }

}
