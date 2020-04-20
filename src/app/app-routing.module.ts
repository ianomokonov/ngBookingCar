import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SearchComponent } from './search/search.component';
import { CatalogComponent } from './catalog/catalog.component';
import { DetailsComponent } from './catalog/details/details.component';
import { BookingFormComponent } from './booking-form/booking-form.component';
import { ProfileComponent } from './profile/profile.component';
import { EnterComponent } from './profile/enter/enter.component';
import { ProfileDetailsComponent } from './profile/profile-details/profile-details.component';
import { ProfileGuard } from './guards/profile.guard';
import { BookingHistoryComponent } from './profile/profile-details/booking-history/booking-history.component';
import { CarsComponent } from './profile/profile-details/cars/cars.component';
import { EditCarComponent } from './profile/profile-details/cars/edit-car/edit-car.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'search' },
  { path: 'search', component: SearchComponent },
  { path: 'catalog', component: CatalogComponent },
  { path: 'details/:id', component: DetailsComponent },
  { path: 'booking/:id', component: BookingFormComponent },
  { path: 'edit-car/:id', component: EditCarComponent },
  { path: 'add-car', component: EditCarComponent },
  {
    path: 'profile',
    component: ProfileComponent,
    children: [
      { path: 'enter', component: EnterComponent },
      {
        path: ':id',
        component: ProfileDetailsComponent,
        canActivate: [ProfileGuard],
        children: [
          { path: '', pathMatch: 'full', redirectTo: 'history' },
          { path: 'history', component: BookingHistoryComponent },
          { path: 'cars', component: CarsComponent },
        ],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
