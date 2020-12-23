import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class TsTranslateService {

  constructor(
    private translateService: TranslateService,
    ) {}

    getTranslation(key: string) {
      return this.translateService.get(key);
    }
}


