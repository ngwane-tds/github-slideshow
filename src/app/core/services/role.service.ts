import { Injectable } from '@angular/core';
import { CacheService } from './cache.service';
import { Store, select } from '@ngrx/store';


import { ProjectStatusType } from '../../feature-modules/home/types/home.lookup.types';
import { UserInfo } from '../../shared/models/user';
import * as fromHome from '../../feature-modules/home/state/home.reducer';

export const USER_ROLES = [
  'bmpuser',
  'user'
];

export const ADMIN_ROLES = [
  'admin',
  'bmpadmin'
];


@Injectable({
  providedIn: 'root'
})
export class RoleService {

  constructor(
    private cacheService: CacheService,
    private store: Store
    ) {
    /*
    this.store
    .pipe(select(fromHome.userLoginSuccess))
    .subscribe((loginSuccess: boolean) => {
      if (loginSuccess) {
        this.getRoles();
      }
    });*/
  }

  getRoles() {
    try {
      const roles = this.cacheService.getUserInfo().roles.map(r => r.toLowerCase());
      return roles;
    } catch {
      console.warn('Unable to access cache service');
    }
  }

  getUserInfo(): UserInfo {
    return this.cacheService.getUserInfo();
  }

  isUserAdmin() {
    const roles = this.cacheService.getUserInfo().roles.map(r => r.toLowerCase());
    const isAdmin = roles.filter(r => ADMIN_ROLES.indexOf(r) > -1).length > 0 ? true : false;
    return isAdmin;
  }

  canUserEditProject(projectData: any): boolean {
    const user = this.cacheService.getUserInfo();
    const roles = user.roles.map(r => r.toLowerCase());
    const isAdmin = roles.filter(r => ADMIN_ROLES.indexOf(r) > -1).length > 0 ? true : false;
    const sharedProjectInfo = projectData.project;
    const projectMatch = sharedProjectInfo.createdBy === user.userId;
    // if admin, they can always edit
    if (isAdmin) {
      return true;
    }
    // if user created the project, check it's status
    if (projectMatch) {
      const inProgress = sharedProjectInfo.statusId === ProjectStatusType.inProgressId ? true : false;
      return inProgress;
    } else {
      // not admin, didn't create the project
      return false;
    }
  }

}
