import { NgModule } from '@angular/core';
import { ServerModule } from '@angular/platform-server';

import { AppModule } from './app.module';
import { AppComponent } from './app.component';
import { SessionStorageService } from './session-storage';
import { ServerSessionStorageService } from './server-session-storage';

@NgModule({
  imports: [
    AppModule,
    ServerModule,
  ],
  bootstrap: [AppComponent],
  providers: [
    {
      provide: SessionStorageService,
      useClass: ServerSessionStorageService
    }
  ]
})
export class AppServerModule {}
