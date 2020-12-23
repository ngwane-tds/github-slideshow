import {
  Component,
  OnInit,
} from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { filter, skip } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {
  currentTab = 0;
  subscriptions: Array<Subscription> = [];
  searchString = '';
  users: { username: string; roles: string[] }[] = [
    { username: 'Josh', roles: ['Admin', 'Approval'] },
    { username: 'Alex', roles: ['Admin', 'Approval'] },
    { username: 'Bryan', roles: ['Admin'] },
    { username: 'Bobby', roles: ['Admin'] },
    { username: 'Tim', roles: ['Admin'] },
    { username: 'Mike', roles: ['Admin'] }
  ];

  roles: { usernames: string[]; role: string }[] = [
    { role: 'Admin', usernames: ['Josh', 'Alex', 'Bryan', 'Bobby', 'Tim', 'Mike']},
    { role: 'Approval', usernames: ['Josh', 'Alex']},
  ];

  constructor(
    public snackBar: MatSnackBar,
    private fb: FormBuilder,
    private dialog: MatDialog
  ) { }

  ngOnInit() {

  }

  filterRows(username: string) {
    return username.toUpperCase().indexOf(this.searchString.toUpperCase()) > -1
      ? 'table-row'
      : 'none';
  }

  discard() {
    alert('To do - discard');
  }

  sorter(items: Array<string>, control: Array<string>): Array<string> {
    const filteredItems = items.filter(x => control.indexOf(x) === -1);
    return control.concat(filteredItems);
  }

  save() {
    alert('To do - Saved');
  }

  join(items: string[]) {
    return items.join(', ');
  }

  keys(item: any) {
    return Object.keys(item);
  }

  tabChange(event: MatTabChangeEvent) {
    this.currentTab = event.index;
    this.searchString = '';
  }
}
