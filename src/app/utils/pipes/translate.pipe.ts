import { Pipe, PipeTransform } from '@angular/core';
import { Translate } from 'src/app/models/translate';
import { TranslateService, DefaultLangChangeEvent } from '@ngx-translate/core';

@Pipe({ name: 'bkTranslate', pure: false })
export class BkTranslatePipe implements PipeTransform {
  constructor(private translateService: TranslateService) {}
  transform(value: Translate): string {
    if (!value) {
      return '';
    }
    return value[this.translateService.currentLang] || value['en'];
  }
}
