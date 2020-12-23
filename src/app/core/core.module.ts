import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthHttpService } from './services/auth-http.service';
import { CacheService } from './services/cache.service';
import { RoleService } from './services/role.service';
import { AuthGuardService } from './services/auth-guard.service';
import { ResizeHandlerService } from './services/resize-handler.service';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  providers: [
    AuthGuardService,
    AuthHttpService,
    CacheService,
    RoleService,
    ResizeHandlerService
  ],
  imports: [CommonModule, HttpModule, HttpClientModule]
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() core: CoreModule) {
    if (core) {
      throw new Error('You should import core module only in the root module');
    }
  }
}
