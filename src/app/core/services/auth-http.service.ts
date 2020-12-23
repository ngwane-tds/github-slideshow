import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { Store, select } from '@ngrx/store';

import { UserInfo, LoginInfo } from '../../shared/models/user';
import { RoleService } from '../services/role.service';
import { ENDPOINTS as endpoints } from '../../../app/core/services/endpoint.service.config';
import { CacheService, KEY_USER_INFO } from './cache.service';
import * as fromHome from '../../feature-modules/home/state/home.reducer';

@Injectable({
  providedIn: 'root'
})
export class AuthHttpService {
  constructor(
    private http: HttpClient,
    private roleService: RoleService,
    private cache: CacheService,
    private router: Router,
    private store: Store
  ) {
    this.store
      .pipe(select(fromHome.userLoginSuccess))
      .subscribe((loginSuccess: boolean) => {
        if (loginSuccess) {
          this.setAuthHeaders();
        }
      });
  }

  private authHeaders: HttpHeaders;

  async login(loginInfo: LoginInfo): Promise<UserInfo> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http
      .post(endpoints.API_METHODS.AUTHENICATE_POST, loginInfo, httpOptions)
      .toPromise()
      .then((res: UserInfo) => {
        this.cache.setUserInfo(res);
        return res;
      })
      .catch((err) => this.handleError(err));
  }

  logout() {
    this.cache.clear(KEY_USER_INFO);
    this.router.navigate(['']);
  }

  isTokenValid(): boolean {
    const userInfo = this.cache.getUserInfo();
    if (!userInfo && !userInfo.token) {
      return false;
    } else {
      const now = Date.now();
      const expires = Date.parse(userInfo.tokenExpiration);
      const expired = expires < now;
      return !expired;
    }
  }

  getAuthHeaders() {
    return this.authHeaders;
  }

  async get(
    url: string,
    requireToken: boolean = true,
    params?: any
  ): Promise<any> {
    const httpOptions = this.getAuthOptions();
    return this.http
      .get(url, httpOptions)
      .toPromise()
      .catch((err) => {
        if (err.status === 401 || err.status === 400) {
          this.router.navigate(['']);
        } else {
          this.handleError(err);
        }
      });
  }

  async getCSV(
    url: string,
    requireToken: boolean = true,
    params?: any
  ): Promise<any> {
    const httpOptions = this.getAuthOptions(requireToken, true);
    return this.http
      .get(url, httpOptions)
      .toPromise()
      .catch((err) => {
        if (err.status === 401 || err.status === 400) {
          this.router.navigate(['']);
        } else {
          this.handleError(err);
        }
      });
  }

  async post(url: string, data: any): Promise<any> {
    const httpOptions = this.getAuthOptions();
    const body = JSON.stringify(data);
    return this.http
      .post(url, body, httpOptions)
      .toPromise()
      .catch((err) => this.handleError(err));
  }

  async put(url: string, data: any): Promise<any> {
    const body = JSON.stringify(data);
    const httpOptions = this.getAuthOptions();
    return this.http
      .put(url, body, httpOptions)
      .toPromise()
      .catch((err) => this.handleError(err));
  }

  async delete(url: string, data?: any): Promise<any> {
    const body = JSON.stringify(data);
    const httpOptions = this.getAuthOptions();
    return this.http
      .delete(url, httpOptions)
      .toPromise()
      .catch((err) => this.handleError(err));
  }

  private getHttpOptions(requireToken: boolean, params?: any) {
    if (requireToken) {
      const userInfo = this.roleService.getUserInfo();
      const token = userInfo.token;
      if (token) {
        const httpHeaders = new HttpHeaders()
          .set('Content-Type', 'application/json')
          .set('Authorization', `Bearer ${token}`);
        const options = {
          headers: httpHeaders,
          params: params ? this.toHttpParams(params) : null
        };
        return options;
      } else {
        this.router.navigate(['']);
      }
    } else {
      const httpHeaders = new HttpHeaders().set(
        'Content-Type',
        'application/json'
      );
      const options = {
        headers: httpHeaders,
        params: params ? this.toHttpParams(params) : null
      };
      return options;
    }
  }

  private getAuthOptions(requireToken = true, isCSV?: boolean) {
    if (requireToken) {
      const userInfo = this.roleService.getUserInfo();
      const token = userInfo.token;
      if (token) {
        let httpAuthOptions: {
          headers: HttpHeaders;
          responseType?: string;
          observe?: string;
        };
        if (isCSV) {
          httpAuthOptions = {
            headers: new HttpHeaders({
              'Content-Type': 'application/octet-stream',
              Authorization: `Bearer ${token}`
            }),
            responseType: 'arraybuffer',
            observe: 'body'
          };
        } else {
          httpAuthOptions = {
            headers: new HttpHeaders({
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            })
          };
        }
        return httpAuthOptions;
      }
    } else {
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      };
      return httpOptions;
    }
  }

  private setAuthHeaders() {
    try {
      const userInfo = this.cache.getUserInfo();
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`
      });
      this.authHeaders = headers;
    } catch {
      console.warn('Unauthorized');
    }
  }

  private toHttpParams(obj: any) {
    let httpParams = new HttpParams();
    Object.keys(obj).forEach((key) => {
      httpParams = httpParams.set(key, obj[key]);
    });
    return httpParams;
  }

  private handleError(err: any, defaultMessage?: any): Promise<any> {
    console.log('Http Service Error:', err);
    let message = defaultMessage ? defaultMessage : `An error has occurred. `;

    if (err.error && err.error.ExceptionMessage) {
      message += err.error.ExceptionMessage;
    } else if (err.error && err.error.Message) {
      message += err.error.Message;
    } else if (err.error) {
      message += err.error;
    } else if (err.statusText) {
      message += err.statusText;
    }

    return Promise.reject(err);
  }
}
