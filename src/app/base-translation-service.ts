// import { isPlatformBrowser } from '@angular/common';
// import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
// import { TranslateService } from '@ngx-translate/core';
// import { Observable } from 'rxjs';
// import { SessionStorageService } from './session-storage';

// @Injectable()
// export class BaseTranslationService {
//   constructor(
//     private translateService: TranslateService,
//     private ss: SessionStorageService
//   ) {
//     this.init();
//   }

//   getLanguage(): string {
//     return this.translateService.currentLang;
//   }

//   getLanguages(): string[] {
//     return this.translateService.getLangs();
//   }

//   setLanguage(language: string): Observable<string> {
//     this.ss.setItem(language);

//     return this.translateService.use(language);
//   }

//   /**
//    * Init
//    */
//   private init(): void {
//     let language = 'en';
//     if (!language) {
//       // If browser, select locale from browser
//       if (isPlatformBrowser(this.platformId)) {
//         language = window.navigator.language.split('-').shift();
//       }
//       if (!language) {
//         language = languages[0];
//       }
//     }
//     const currentLanguage = this.translationStorage.getLanguage() || language;

//     this.translateService.addLangs(languages);
//     this.translateService.setDefaultLang(language);
//     this.translateService.use(currentLanguage);
//     this.translationStorage.setLanguage(currentLanguage);
//   }
// }