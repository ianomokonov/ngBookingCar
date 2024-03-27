import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LangGuard } from './guards/lang.guard';
import { LangsComponent } from './langs/langs.component';
import { getPages } from './utils/constants';

@NgModule({
  imports: [
    RouterModule.forRoot(
      [
        { path: '', pathMatch: 'full', redirectTo: 'en' },
        {
          path: 'ru',
          component: LangsComponent,
          children: getPages('en'),
          canActivate: [LangGuard],
        },
        {
          path: 'en',
          component: LangsComponent,
          children: getPages('en'),
          canActivate: [LangGuard],
        },
        {
          path: 'de',
          component: LangsComponent,
          children: getPages('de'),
          canActivate: [LangGuard],
        },
      ],
      {
        initialNavigation: 'enabled',
      }
    ),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
