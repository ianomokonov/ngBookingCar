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
import { ProfileGuard } from './guards/profile.guard';
import { ApiService } from './services/api.service';
import { AuthService } from './services/auth.service';
import { UserInfoComponent } from './profile/profile-details/user-info/user-info.component';
import { BookingHistoryComponent } from './profile/profile-details/booking-history/booking-history.component';
import { OrderComponent } from './profile/profile-details/booking-history/order/order.component';
import { CarsComponent } from './profile/profile-details/cars/cars.component';
import { EditUserFormComponent } from './profile/profile-details/user-info/edit-user-form/edit-user-form.component';
import { EditCarComponent } from './profile/profile-details/cars/edit-car/edit-car.component';
import { DoubleSliderComponent } from './utils/double-slider/double-slider.component';
import { FileUploaderComponent } from './utils/file-uploader/file-uploader.component';
import { SignUpComponent } from './profile/sign-up/sign-up.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { PlacesComponent } from './profile/profile-details/places/places.component';
import { PlaceComponent } from './profile/profile-details/places/place/place.component';
import { SearchService } from './services/search.service';
import { AdminGuard } from './guards/admin.guard';
import { CarPlacesPipe } from './utils/pipes/car-places.pipe';
import { LoaderComponent } from './utils/loader/loader.component';
import { LoadingService } from './services/loading.service';

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
    CarPlacesPipe,
    DetailsComponent,
    BookingFormComponent,
    ProfileComponent,
    EnterComponent,
    UserInfoComponent,
    BookingHistoryComponent,
    OrderComponent,
    CarsComponent,
    EditUserFormComponent,
    EditCarComponent,
    DoubleSliderComponent,
    FileUploaderComponent,
    SignUpComponent,
    PlacesComponent,
    PlaceComponent,
    LoaderComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, NgbModule, FormsModule, ReactiveFormsModule, RouterModule, HttpClientModule],
  providers: [
    LoadingService,
    FormBuilder,
    ProfileGuard,
    AdminGuard,
    ApiService,
    AuthService,
    SearchService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
