import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SearchComponent } from './search/search.component';
import { CatalogComponent } from './catalog/catalog.component';
import { DetailsComponent } from './catalog/details/details.component';
import { BookingFormComponent } from './booking-form/booking-form.component';
import { ProfileComponent } from './profile/profile.component';
import { EnterComponent } from './profile/enter/enter.component';
import { ProfileGuard } from './guards/profile.guard';
import { BookingHistoryComponent } from './profile/profile-details/booking-history/booking-history.component';
import { CarsComponent } from './profile/profile-details/cars/cars.component';
import { EditCarComponent } from './profile/profile-details/cars/edit-car/edit-car.component';
import { SignUpComponent } from './profile/sign-up/sign-up.component';
import { PlacesComponent } from './profile/profile-details/places/places.component';
import { AdminGuard } from './guards/admin.guard';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'search' },
  {
    path: 'search',
    component: SearchComponent,
    data: {
      title: 'Cheap Rent a car Crete / Car Hire in Crete with CAR4CRETE / Heraklion / Rethymnon / Chania ',
      description:
        'Rent a car in Crete /Full insurance against all risks 100% no excess/ Free delivery at airport Heraklion and oll ower Crete',
      keywords:
        'rent a car crete, rent a car heraklion, rent a car Rethymnon, rent a car Chania, crete car hire, rent a car heraklion crete, rent a car heraklion airport crete, rent a car heraklion port, rent a car heraklion greece, car rental in Crete Heraklion Airport ',
    },
  },
  {
    path: 'catalog',
    component: CatalogComponent,
    data: {
      title: 'Car Hire in Heraklion airport Crete / Сhoose your car model with CAR4CRETE',
      description:
        'Crete: Rent cars of different brands, horsepower and configuration to adapt to your needs whether you are travelling as a couple, family or a group of friends',
      keywords:
        'Hire car heraklion airport, Hire cars crete - heraklion airport, Best car hire heraklion airport, Cheap car hire crete heraklion airport, Hire a car in Crete, Car hire in crete greece, Car hire in crete hersonissos, Car hire in crete airport',
    },
  },
  { path: 'details/:id', component: DetailsComponent },
  { path: 'booking/:id', component: BookingFormComponent },
  { path: 'edit-car/:id', component: EditCarComponent, canActivate: [AdminGuard] },
  { path: 'add-car', component: EditCarComponent, canActivate: [AdminGuard] },
  { path: 'enter', component: EnterComponent },
  { path: 'sign-up', component: SignUpComponent },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [ProfileGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'history' },
      { path: 'history', component: BookingHistoryComponent },
      { path: 'cars', component: CarsComponent, canActivate: [AdminGuard] },
      { path: 'places', component: PlacesComponent, canActivate: [AdminGuard] },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
