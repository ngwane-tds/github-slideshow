import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { AuthHttpService } from '../../../core/services/auth-http.service';
import { CacheService } from '../../../core/services/cache.service';
import * as homeActions from '../../../feature-modules/home/state/home.actions';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  constructor(
    private router: Router,
    private store: Store,
    private authHttpService: AuthHttpService,
    private cacheService: CacheService
    ) {}

  username: string;
  password: string;
  message = '';
  messageSpanish = '';
  loading = false;
  hidePassword = true;

  ngOnInit() {
    const userInfo = this.cacheService.getUserInfo();
    if (userInfo && userInfo.token) {
      this.store.dispatch(new homeActions.UserLoginSuccess(true));
      this.router.navigate(['home']);
    }
  }

  togglePasswordVisible() {
    this.hidePassword = !this.hidePassword;
  }

  async login() {
    this.message = ''; // reset message
    this.loading = true;
    const res = await this.authHttpService.login({ UserName: this.username, Password: this.password }).catch(err => {
      this.loginFailure(err);
    });
    if (res && res.token) {
      this.loginSuccess();
    } else {
      if (this.message.length < 1) {
        this.loginFailure({error: 'Invalid Credentials (Credenciales no válidas)'});
      }
      return;
    }
  }

  forgotPassword() {
    this.router.navigate(['account/forgotpassword']);
  }

  private loginSuccess() {
    this.message = 'Success (Éxito)';
    this.store.dispatch(new homeActions.UserLoginSuccess(true));
    setTimeout(() => {
      this.router.navigate(['home']);
    }, 500);
    this.loading = false;
  }

  private loginFailure(err: any ) {
    this.store.dispatch(new homeActions.UserLoginSuccess(false));
    this.message = err.error;
    if (err && err.status === 0) {
      this.message = 'Server Error -> Please contact the System Admin.';
      this.messageSpanish = 'Error del servidor -> Póngase en contacto con el administrador del sistema.';
    }
    if (err && err.status === 500) {
      this.message = 'Server Error -> Please contact the System Admin.';
      this.messageSpanish = 'Error del servidor -> Póngase en contacto con el administrador del sistema.';
    }
    if (err && err.status === 400) {
      this.messageSpanish = 'Credencial inválida';
    }
    this.loading = false;
    return;
  }

}
