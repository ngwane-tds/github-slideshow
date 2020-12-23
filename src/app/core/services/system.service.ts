import { Injectable } from '@angular/core';

import { AuthHttpService } from 'src/app/core/services/auth-http.service';
import { ENDPOINTS, ENDPOINTS as endpoints } from 'src/app/core/services/endpoint.service.config';

@Injectable({
  providedIn: 'root'
})
export class SystemService {

  constructor(
    private authService: AuthHttpService
  ) { }

  async getIsSystemOpen(): Promise<boolean> {
    const isOpen = await this.authService.get(endpoints.API_CONTROLLER_GETS.ADMIN.SYSTEM_OPEN_GET);
    return isOpen;
  }

  async putIsSystemOpen(open: boolean) {
    try {
      await this.authService.put(endpoints.API_PUT.SYSTEM_OPEN, open);
    } catch {
      console.log('Failed to update system status');
    }
  }

}
