import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';

import { environment } from '../../../../environments/environment';
import * as fromHome from '../../../feature-modules/home/state/home.reducer';
import * as homeActions from '../../../feature-modules/home/state/home.actions';
import { AuthHttpService } from '../../../core/services/auth-http.service';
import { RoleService } from '../../../core/services/role.service';

import {
  LANG_ENGLISH,
  LANG_SPANISH
} from '../../../core/services/endpoint.service.config';

@Component({
  selector: 'app-header',
  templateUrl: 'header.component.html',
  styleUrls: ['header.component.scss']
})
export class HeaderComponent implements OnInit {
  constructor(
    private authHttpService: AuthHttpService,
    private router: Router,
    public translate: TranslateService,
    private store: Store<fromHome.State>,
    private roleService: RoleService
  ) {
    translate.addLangs(['en', 'es-mx']);
    translate.setDefaultLang('en');
    const browserLang = translate.getBrowserLang();
    // if browserLang is Spanish, use that, else default to English
    translate.use(browserLang.match('es-mx|es') ? LANG_SPANISH : LANG_ENGLISH);
    this.store.dispatch(new homeActions.SetLanguage(browserLang));
  }

  username = '';
  isAdmin = false;
  environment = environment;
  selectedLanguage: string;

  ngOnInit() {
    this.isAdmin = this.roleService.isUserAdmin();
    this.username = this.roleService.getUserInfo().userName;
    this.selectedLanguage = this.translate.currentLang;
  }

  onLanguageSelectChange(value: any) {
    this.translate.use(value).subscribe(() => {
      // can now dispatch now that the updated language has loaded
      this.store.dispatch(new homeActions.SetLanguage(value));
      this.store.dispatch(new homeActions.ClearProjectFilters());
    });
  }

  convertLanguageStrForDisplay(lang: string) {
    if (lang === 'en') {
      return 'English';
    } else if (lang === 'es' || lang === 'es-mx') {
      return 'Spanish';
    }
  }

  logout() {
    localStorage.clear();
    this.router.navigate([``]);
  }

  reportIssue() {}

  navigate(route: string) {
    this.router.navigate([`/${route}`]);
  }
}
