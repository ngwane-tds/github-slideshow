import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  Router,
  Event,
  NavigationStart,
  NavigationEnd,
} from '@angular/router';
import { Store } from '@ngrx/store';

import * as adminActions from '../state/admin.actions';
import * as fromAdmin from '../state/admin.reducer';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit, OnDestroy {
  usersSelected = false;
  systemSelected = false;
  constructor(
    private router: Router,
    private store: Store<fromAdmin.State>
  ) {}

  ngOnInit() {
    if (this.router.url === '/admin/system') {
      this.toggleToSystemView();
    } else if (this.router.url === '/admin/users') {
      this.toggleToUsersView();
    }
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart) {
        // TODO: show loading indicator
      }
      if (event instanceof NavigationEnd) {
        if (event.url === '/admin/system') {
          this.toggleToSystemView();
        }
        if (event.url === '/admin/users') {
          this.toggleToUsersView();
        }
      }
    });
  }

  ngOnDestroy() {
    this.store.dispatch(new adminActions.ClearAdmin());
  }

  toggleToUsersView() {
    this.usersSelected = true;
    this.systemSelected = false;
  }

  toggleToSystemView() {
    this.usersSelected = false;
    this.systemSelected = true;
  }

}
