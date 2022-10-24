import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LangGuard } from './guards/lang.guard';
import { LangsComponent } from './langs/langs.component';
import { pages } from './utils/constants';

@NgModule({
  imports: [
    RouterModule.forRoot(
      [
        { path: '', pathMatch: 'full', redirectTo: 'en' },
        {
          path: 'ru',
          component: LangsComponent,
          children: pages,
          canActivate: [LangGuard],
        },
        {
          path: 'en',
          component: LangsComponent,
          children: pages,
          canActivate: [LangGuard],
        },
        {
          path: 'de',
          component: LangsComponent,
          children: pages,
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
