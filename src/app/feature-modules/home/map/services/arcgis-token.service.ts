import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AuthHttpService } from '../../../../core/services/auth-http.service';
import { ENDPOINTS as endpoints } from '../../../../core/services/endpoint.service.config';
import { ArcGISTokenResponse } from '../models/arcgis-token-response';
import { CacheService } from '../../../../../app/core/services/cache.service';

@Injectable({
  providedIn: 'root'
})
export class ArcGISTokenService {
  constructor(
    private authHttpService: AuthHttpService,
    private cacheService: CacheService,
    private http: HttpClient
    ) {}

  async getToken(): Promise<ArcGISTokenResponse> {
    const expired = this.isTokenExpired();
    if (expired) {
      const url = endpoints.API_METHODS.ARCGIS_TOKEN_GET;
      const options = {
        headers: this.authHttpService.getAuthHeaders()
      };
      const res = await this.http.get(url, options).toPromise() as ArcGISTokenResponse;
      return new Promise((resolve, reject) => {
        if (res.token) {
          this.cacheService.setArcGISToken(res);
          resolve(res);
        } else {
          reject(`Token Request Error: ${res}`);
        }
      });
    } else {
      return this.cacheService.getArcGISToken();
    }
  }

  isTokenExpired(): boolean {
    const token = this.cacheService.getArcGISToken();
    if (!token) {
      return true;
    } else {
      const now = Date.now();
      return token.expires < now ? true : false;
    }
  }

  // uses auth service with bearer token
  async getTokenAuthorized(): Promise<ArcGISTokenResponse> {
    const expired = this.isTokenExpired();
    if (expired) {
      const url = endpoints.API_METHODS.ARCGIS_TOKEN_GET;
      const res = await this.authHttpService.get(url, true) as ArcGISTokenResponse;
      return new Promise((resolve, reject) => {
        if (res && res.token) {
          this.cacheService.setArcGISToken(res);
          resolve(res);
        } else {
          reject(`Token Request Error: ${res}`);
        }
      });
    } else {
      return this.cacheService.getArcGISToken();
    }
  }

}
