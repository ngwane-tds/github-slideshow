import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, CanActivate } from '@angular/router';
import { CacheService } from './cache.service';
import { AuthHttpService } from './auth-http.service';
import * as homeActions from '../../feature-modules/home/state/home.actions';
import { Store } from '@ngrx/store';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {
  constructor(
    private cache: CacheService,
    private store: Store,
    private authHttpService: AuthHttpService,
    private router: Router,
    ) {}

  isAuthenticated(): boolean {
    const isTokenValid = this.authHttpService.isTokenValid();
    this.store.dispatch(new homeActions.UserLoginSuccess(isTokenValid));
    return isTokenValid;
  }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    if (!this.isAuthenticated()) {
      this.router.navigate(['login']);
      return false;
    }
    return true;
  }
}
