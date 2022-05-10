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
import { LangGuard } from './guards/lang.guard';
import { LangsComponent } from './langs/langs.component';
import { ContactsComponent } from './contacts/contacts.component';
import { PolicyComponent } from './policy/policy.component';
import { AboutCreteComponent } from './about-crete/about-crete.component';
import { PlacesOfInterestComponent } from './profile/profile-details/places-of-interest/places-of-interest.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { MainSliderComponent } from './profile/profile-details/main-slider/main-slider.component';

// const routes: Routes = [
//   { path: '', pathMatch: 'full', redirectTo: 'search' },
//   {
//     path: 'search',
//     component: SearchComponent,
//     data: {
//       title: 'Cheap Rent a car Crete / Car Hire in Crete with CAR4CRETE / Heraklion / Rethymnon / Chania ',
//       description:
//         'Rent a car in Crete /Full insurance against all risks 100% no excess/ Free delivery at airport Heraklion and oll ower Crete',
//       keywords:
//         'rent a car crete, rent a car heraklion, rent a car Rethymnon, rent a car Chania, crete car hire, rent a car heraklion crete, rent a car heraklion airport crete, rent a car heraklion port, rent a car heraklion greece, car rental in Crete Heraklion Airport ',
//     },
//   },
//   {
//     path: 'catalog',
//     component: CatalogComponent,
//     data: {
//       title: 'Car Hire in Heraklion airport Crete / Сhoose your car model with CAR4CRETE',
//       description:
//         'Crete: Rent cars of different brands, horsepower and configuration to adapt to your needs whether you are travelling as a couple, family or a group of friends',
//       keywords:
//         'Hire car heraklion airport, Hire cars crete - heraklion airport, Best car hire heraklion airport, Cheap car hire crete heraklion airport, Hire a car in Crete, Car hire in crete greece, Car hire in crete hersonissos, Car hire in crete airport',
//     },
//   },
//   {
//     path: 'contacts',
//     component: ContactsComponent,
//     data: {
//       title: 'Car rental company in Crete - CAR4CRETE',
//       description:
//         'Booking a car in Crete with CAR4CRETE is very easy. Write online chat, call on telephone or Whats up, mail us. Rent a car Heraklion airport Crete, rent a car Heraklion port Crete. We are in touch 24/7.+30 69 4936 7278 info@carcrete24.com ',
//       keywords:
//         'Rent a car heraklion crete, rent a car heraklion airport crete, rent a car heraklion port, rent a car heraklion greece, car rental in Crete Heraklion Airport / rent a car deals with CAR4CRETE',
//     },
//   },
//   {
//     path: 'policy',
//     component: PolicyComponent,
//     data: {
//       title: 'Car rental company in Crete - CAR4CRETE',
//       description:
//         'Booking a car in Crete with CAR4CRETE is very easy. Write online chat, call on telephone or Whats up, mail us. Rent a car Heraklion airport Crete, rent a car Heraklion port Crete. We are in touch 24/7.+30 69 4936 7278 info@carcrete24.com ',
//       keywords:
//         'Rent a car heraklion crete, rent a car heraklion airport crete, rent a car heraklion port, rent a car heraklion greece, car rental in Crete Heraklion Airport / rent a car deals with CAR4CRETE',
//     },
//   },
//   {
//     path: 'about-crete',
//     component: AboutCreteComponent,
//     data: {
//       title: 'What to see in Crete',
//       description: 'Holiday in Crete with car',
//       keywords: 'Crete car rental, Crete car hire',
//     },
//   },
//   {
//     path: 'feedback',
//     component: FeedbackComponent,
//     data: {
//       title: 'What to see in Crete',
//       description: 'Holiday in Crete with car',
//       keywords: 'Crete car rental, Crete car hire',
//     },
//   },
//   { path: 'details/:id', component: DetailsComponent },
//   { path: 'booking/:id', component: BookingFormComponent },
//   { path: 'edit-car/:id', component: EditCarComponent, canActivate: [AdminGuard] },
//   { path: 'add-car', component: EditCarComponent, canActivate: [AdminGuard] },
//   { path: 'enter', component: EnterComponent },
//   { path: 'sign-up', component: SignUpComponent },
//   {
//     path: 'profile',
//     component: ProfileComponent,
//     canActivate: [ProfileGuard],
//     children: [
//       { path: '', pathMatch: 'full', redirectTo: 'history' },
//       { path: 'history', component: BookingHistoryComponent },
//       { path: 'cars', component: CarsComponent, canActivate: [AdminGuard] },
//       { path: 'places', component: PlacesComponent, canActivate: [AdminGuard] },
//       { path: 'places-of-interest', component: PlacesOfInterestComponent, canActivate: [AdminGuard] },
//     ],
//   },
// ];

@NgModule({
  imports: [
    RouterModule.forRoot(
      [
        { path: '', pathMatch: 'full', redirectTo: 'en' },
        {
          path: 'ru',
          component: LangsComponent,
          children: [
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
            {
              path: 'contacts',
              component: ContactsComponent,
              data: {
                title: 'Car rental company in Crete - CAR4CRETE',
                description:
                  'Booking a car in Crete with CAR4CRETE is very easy. Write online chat, call on telephone or Whats up, mail us. Rent a car Heraklion airport Crete, rent a car Heraklion port Crete. We are in touch 24/7.+30 69 4936 7278 info@carcrete24.com ',
                keywords:
                  'Rent a car heraklion crete, rent a car heraklion airport crete, rent a car heraklion port, rent a car heraklion greece, car rental in Crete Heraklion Airport / rent a car deals with CAR4CRETE',
              },
            },
            {
              path: 'policy',
              component: PolicyComponent,
              data: {
                title: 'Car rental company in Crete - CAR4CRETE',
                description:
                  'Booking a car in Crete with CAR4CRETE is very easy. Write online chat, call on telephone or Whats up, mail us. Rent a car Heraklion airport Crete, rent a car Heraklion port Crete. We are in touch 24/7.+30 69 4936 7278 info@carcrete24.com ',
                keywords:
                  'Rent a car heraklion crete, rent a car heraklion airport crete, rent a car heraklion port, rent a car heraklion greece, car rental in Crete Heraklion Airport / rent a car deals with CAR4CRETE',
              },
            },
            {
              path: 'about-crete',
              component: AboutCreteComponent,
              data: {
                title: 'What to see in Crete',
                description: 'Holiday in Crete with car',
                keywords: 'Crete car rental, Crete car hire',
              },
            },
            {
              path: 'feedback',
              component: FeedbackComponent,
              data: {
                title: 'What to see in Crete',
                description: 'Holiday in Crete with car',
                keywords: 'Crete car rental, Crete car hire',
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
                { path: 'places-of-interest', component: PlacesOfInterestComponent, canActivate: [AdminGuard] },
                { path: 'main-slider', component: MainSliderComponent, canActivate: [AdminGuard] },
              ],
            },
          ],
          canActivate: [LangGuard],
        },
        {
          path: 'en',
          component: LangsComponent,
          children: [
            { path: '', pathMatch: 'full', redirectTo: 'search' },
            {
              path: 'search',
              component: SearchComponent,
              data: {
                title: 'Rent a Car Crete 2022 / Hire a Car Crete 2022 / Car4Crete.com',
                description:
                  'Rent a car in Crete with Car4Crete. Hire a new car at Heraklion airport - no waiting in the line. Rent a vehicle in Heraklion port or hotel in Crete with best price. Family company, we are always in touch!',
                keywords: 'rent a car heraklion, car rental heraklion airport, car hire heraklion airport',
              },
            },
            {
              path: 'catalog',
              component: CatalogComponent,
              data: {
                title: 'Car models for rent in Crete 2022/ Find the Best Price / Car4Crete.com',
                description:
                  'The best car rental company in Crete will provide you with brand new Volkswagen, Fiat, Suzuki and Hyundai cars. Automatic, manual, hybrid and electric cars for rent in Crete. R ent a car Heraklion with Best Rates.',
                keywords: 'best car hire crete, rent a car crete prices, rent a car heraklion price, rent a car heraklion airport price',
              },
            },
            {
              path: 'contacts',
              component: ContactsComponent,
              data: {
                title: 'Contact Car4Crete for rent a car Crete 2022 / Car4Crete.com',
                description:
                  'Car Hire with Car4Crete is easy. Call us the car to delivered to the airport of Heraklion, Port or any Hotel of Crete ',
                keywords:
                  'car hire heraklion airport, car rental crete heraklion airport, rent a car crete heraklion airport, car hire Heraklion, car rental amoudara crete, rent a car amoudara crete',
              },
            },
            {
              path: 'policy',
              component: PolicyComponent,
              data: {
                title: 'Hire Car in Crete 2022 / Insurance policy / Car4Crete.com',
                description:
                  'Conditions for car hire Crete Heraklion Rethimno Hersonissos. Premium car rental insurance for car hire Heraklion airport in Crete including 24 hour roadside assistance. Car rental company Car4Crete is an honest and reliable partner!',
                keywords: 'car hire crete heraklion, car rental heraklion port, crete car hire heraklion airport',
              },
            },
            {
              path: 'about-crete',
              component: AboutCreteComponent,
              data: {
                title: 'What to see in Crete',
                description: 'Holiday in Crete with car',
                keywords: 'Crete car rental, Crete car hire',
              },
            },
            {
              path: 'feedback',
              component: FeedbackComponent,
              data: {
                title: 'What to see in Crete',
                description: 'Holiday in Crete with car',
                keywords: 'Crete car rental, Crete car hire',
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
                { path: 'places-of-interest', component: PlacesOfInterestComponent, canActivate: [AdminGuard] },
                { path: 'main-slider', component: MainSliderComponent, canActivate: [AdminGuard] },
              ],
            },
          ],
          canActivate: [LangGuard],
        },
        {
          path: 'de',
          component: LangsComponent,
          children: [
            { path: '', pathMatch: 'full', redirectTo: 'search' },
            {
              path: 'search',
              component: SearchComponent,
              data: {
                title: 'Mietwagen Kreta 2022 / Autovermietung Kreta / Car4Crete.com',
                description:
                  'Die besten Mietwagenangebote auf Kreta. Vermietung am Flughafen Heraklion. Schnelle Autovermietung in Kreta Hotels. Familienunternehmen. Wir sind immer in Kontakt mit Ihnen!',
                keywords:
                  'auto mieten kreta, kreta mietwagen, mietwagen kreta heraklion flughafen, kreta auto mieten, mietwagen kreta heraklion, mietwagen kreta hotelzustellung',
              },
            },
            {
              path: 'catalog',
              component: CatalogComponent,
              data: {
                title: 'Automodelle zu vermieten auf Kreta 2022 /Autovermietung in Heraklion, Rethymnon, Chania / Car4Crete.com',
                description:
                  'Neue Autovermietung auf Kreta - Audi, VW, Fiat, Suzuki. Automatik, Schalt, Hybrid und Elektroautos zur Miete auf Kreta. Reservierung eines bestimmten Modells ohne Vorauszahlung. Preisgarantie ohne Zwischenhändler. Autovermietung in Heraklion, Heraklion Flughafen, Rethymnon, Hersonissos – einfach im Jahr 2022.',
                keywords:
                  'heraklion mietwagen flughafen, mietauto kreta heraklion flughafen, auto mieten in kreta, autovermietung flughafen heraklion,',
              },
            },
            {
              path: 'contacts',
              component: ContactsComponent,
              data: {
                title: 'Kontaktieren Sie uns, um ein Auto auf Kreta zu mieten / Car4Crete.com',
                description:
                  'Mietwagen Kreta 2022 - kontaktieren Sie uns direkt ohne Zeitverlust. Sie können ein Auto auf Kreta mieten, indem Sie anrufen, an den Messenger schreiben oder auf der Website buchen.',
                keywords:
                  'billiger mietwagen kreta, auto mieten kreta flughafen, heraklion auto mieten, autovermietung kreta heraklion, mietwagen kreta hotelzustellung',
              },
            },
            {
              path: 'policy',
              component: PolicyComponent,
              data: {
                title: 'Mietbedingung zum Auto auf Kreta mieten 2022 / Car4Crete.com',
                description: 'Premium-Mietwagenversicherung auf Kreta – Sie entspannen sich, wir kümmern uns um Sie!',
                keywords: 'auto auf kreta mieten, kreta autovermietung',
              },
            },
            {
              path: 'about-crete',
              component: AboutCreteComponent,
              data: {
                title: 'What to see in Crete',
                description: 'Holiday in Crete with car',
                keywords: 'Crete car rental, Crete car hire',
              },
            },
            {
              path: 'feedback',
              component: FeedbackComponent,
              data: {
                title: 'Autovermietung auf Kreta - Mietstationen /  Car4Crete.com',
                description:
                  'Sie können überall auf Kreta ein Auto mieten - direkt am Flughafen Heraklion oder zu Hotels mit Lieferung in Heraklion, Rethymno, Hersonissos, Malia, Anissaras, Bali. Wenn Sie auf Kreta ein Auto mieten, können Sie die Insel besser kennenlernen!',
                keywords:
                  'autovermietung rethymno, autovermietung chersonissos, mietwagen kreta rethymno, autovermietung stalis kreta, autovermietung malia kreta, mietwagen agios nikolaos, mietwagen agia pelagia',
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
                { path: 'places-of-interest', component: PlacesOfInterestComponent, canActivate: [AdminGuard] },
                { path: 'main-slider', component: MainSliderComponent, canActivate: [AdminGuard] },
              ],
            },
          ],
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
