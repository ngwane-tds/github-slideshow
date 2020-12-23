import { Injectable } from '@angular/core';

import { ArcGISTokenResponse } from '../../../app/feature-modules/home/map/models/arcgis-token-response';
import { UserInfo } from '../../shared/models/user';
import { environment } from '../../../environments/environment';

export const KEY_ARCGIS_TOKEN = 'arcgisToken';
export const KEY_USER_INFO = 'userInfo';

@Injectable({
    providedIn: 'root'
})
export class CacheService {
    private prefix = `sandag_bmp_${environment.name}_`;

    set(key: string, value: any) {
        const jsonizedValue = JSON.stringify(value);
        localStorage.setItem(this.prefix + key, jsonizedValue);
    }

    get(key: string) {
        const jsonizedValue = localStorage.getItem(this.prefix + key);
        return (jsonizedValue === null) ? null : JSON.parse(jsonizedValue);
    }

    setUserInfo(value: UserInfo) {
      const jsonizedValue = JSON.stringify(value);
      localStorage.setItem(this.prefix + KEY_USER_INFO, jsonizedValue);
    }

    getUserInfo(): UserInfo {
      const jsonizedValue = localStorage.getItem(this.prefix + KEY_USER_INFO);
      return (jsonizedValue === null) ? null : JSON.parse(jsonizedValue) as UserInfo;
    }

    setArcGISToken(value: ArcGISTokenResponse) {
      const jsonizedValue = JSON.stringify(value);
      localStorage.setItem(this.prefix + KEY_ARCGIS_TOKEN, jsonizedValue);
    }

    getArcGISToken(): ArcGISTokenResponse {
      const jsonizedValue = localStorage.getItem(this.prefix + KEY_ARCGIS_TOKEN);
      return (jsonizedValue === null) ? null : JSON.parse(jsonizedValue) as ArcGISTokenResponse;
    }

    clear(key: string) {
      localStorage.removeItem(this.prefix + key);
    }

    clearAll() {
      localStorage.clear();
    }
}
