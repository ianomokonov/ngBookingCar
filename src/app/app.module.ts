import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MenuComponent } from './menu/menu.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FiltersFormComponent } from './search/filters-form/filters-form.component';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SearchCarsComponent } from './search/search-cars/search-cars.component';
import { SearchComponent } from './search/search.component';
import { NgbdDatepickerI18n } from './utils/date-picker-i18.component';
import { CatalogComponent } from './catalog/catalog.component';
import { RouterModule } from '@angular/router';
import { FiltersComponent } from './catalog/filters/filters.component';
import { NgbDatePipe } from './utils/pipes/ngb-date-pipe';
import { DetailsComponent } from './catalog/details/details.component';
import { BookingFormComponent } from './booking-form/booking-form.component';
import { ProfileComponent } from './profile/profile.component';
import { EnterComponent } from './profile/enter/enter.component';
import { ProfileDetailsComponent } from './profile/profile-details/profile-details.component';
import { ProfileGuard } from './guards/profile.guard';
import { ApiService } from './services/api.service';
import { AuthService } from './services/auth.service';

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    FiltersFormComponent,
    SearchCarsComponent,
    SearchComponent,
    NgbdDatepickerI18n,
    CatalogComponent,
    FiltersComponent,
    NgbDatePipe,
    DetailsComponent,
    BookingFormComponent,
    ProfileComponent,
    EnterComponent,
    ProfileDetailsComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, NgbModule, FormsModule, ReactiveFormsModule, RouterModule],
  providers: [FormBuilder, ProfileGuard, ApiService, AuthService],
  bootstrap: [AppComponent],
})
export class AppModule {}
