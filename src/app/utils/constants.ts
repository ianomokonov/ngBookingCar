import { SearchComponent } from '../search/search.component';
import { CatalogComponent } from '../catalog/catalog.component';
import { DetailsComponent } from '../catalog/details/details.component';
import { BookingFormComponent } from '../booking-form/booking-form.component';
import { ProfileComponent } from '../profile/profile.component';
import { EnterComponent } from '../profile/enter/enter.component';
import { ProfileGuard } from '../guards/profile.guard';
import { BookingHistoryComponent } from '../profile/profile-details/booking-history/booking-history.component';
import { CarsComponent } from '../profile/profile-details/cars/cars.component';
import { EditCarComponent } from '../profile/profile-details/cars/edit-car/edit-car.component';
import { SignUpComponent } from '../profile/sign-up/sign-up.component';
import { PlacesComponent } from '../profile/profile-details/places/places.component';
import { AdminGuard } from '../guards/admin.guard';
import { ContactsComponent } from '../contacts/contacts.component';
import { PolicyComponent } from '../policy/policy.component';
import { AboutCreteComponent } from '../about-crete/about-crete.component';
import { PlacesOfInterestComponent } from '../profile/profile-details/places-of-interest/places-of-interest.component';
import { MainSliderComponent } from '../profile/profile-details/main-slider/main-slider.component';
import { RentalLocationsComponent } from '../rental-locations/rental-locations.component';
import { LocationsComponent } from '../profile/profile-details/locations/locations.component';
import { EditLocationComponent } from '../profile/profile-details/locations/edit-location/edit-location.component';

export const keywords = {
  en: {
    search: {
      title: 'Rent a Car Crete / Hire a Car Crete / Car4Crete',
      description:
        'Rent a car in Crete with Car4Crete. Hire a new car at Heraklion airport - no waiting in the line. Rent a vehicle in Heraklion port or hotel in Crete with best price. Family company, we are always in touch!',
      keywords:
        'rent a car heraklion, luxury car hire crete, local car hire crete, best car hire crete, cheap car hire crete, rentacar kreta car rental crete, rental center crete,noleggio auto a creta, car hire crete, rent a car crete, voiture location Crete, car hire crete, auto mieten auf kreta,',
    },
    catalog: {
      title: 'Car models for rent in Crete / Find the Best Price / Car4Crete',
      description:
        '100% best car rental company in Crete will provide you rental cars with brand new Volkswagen, Fiat, Suzuki and Hyundai cars. Automatic, manual, hybrid and electric cars for rent in Crete. Rent a car Heraklion with Best Rates.',
      keywords:
        'best car hire crete, rent a car crete prices, rent a car heraklion price, rent a car heraklion airport price, convertible car hire crete, creta rent a car',
    },
    contacts: {
      title: 'Contact Car4Crete for rent a car Crete / Car4Crete',
      description:
        'Car Hire with Car4Crete is easy. Call us the car to be delivered to the airport of Heraklion, Port or any Hotel of Crete',
      keywords:
        'car hire heraklion airport, car rental crete heraklion airport, rent a car crete heraklion airport, car hire Heraklion, car rental amoudara crete, rent a car amoudara crete',
    },
    policy: {
      title: 'Hire Car in Crete / Insurance policy / Car4Crete',
      description:
        'All included prices for rent a car in Crete. Conditions for car hire Crete Heraklion Rethimno Hersonissos. Premium car rental insurance for car hire Heraklion airport in Crete including 24 hour roadside assistance. Car rental company Car4Crete is an honest and reliable partner!',
      keywords: 'car hire crete heraklion, car rental heraklion port, crete car hire heraklion airport',
    },
    /** локации */
    'heraklion-airport': {
      title: 'Car Hire  Heraklion airport Crete / Rent a Car Heraklion airport / Car4Crete',
      description:
        'Car rental in Heraklion airport Crete from 19€. Car Hire in Heraklion Airport All included - we meet you right outside the terminal.  Car4Crete Car Hire in Heraklion Airport * brandnew safe car * exact model, no category *book now, pay on arrival * free cancelation. ',
      keywords:
        'car heraklion airport, location de voiture heraklion airport, rental center cretelocation voiture crete heraklion aeroport,location voiture heraklion aéroport,location voiture heraklion airport,location voiture heraklion aéroport,aeroport heraklion location voiture, car rental heraklion airport crete greece,car hire heraklion airport crete,hire car heraklion airport,car hire heraklion airport crete,hire car heraklion airport,cheap car hire heraklion airport, car hire heraklion airport crete, car rental heraklion airport greece, car rental crete heraklion airport, crete heraklion airport rent a car, heraklion airport car rental companies,rental car heraklion airport,rent a car crete heraklion airport,car rental crete heraklion airport,car hire heraklion airport,rent a car heraklion airport,best car rental heraklion airport,car rental heraklion airport greece',
    },
    'chania-airport': {
      title: 'Car Hire Chania airport / Rent a car Crete Chania airport / Car4Crete',
      description:
        'Car Hire Chania airport all included by Car4Crete! Here you STOP looking for Car Rental in Chania airport. 24/7Hours Pickup and Return Car. Easy online booking with no prepayment. New cars with personalized service.',
      keywords:
        'car chania airport, crete chania car rental, car hire chania crete, car hire chania town, crete car hire chania airport, crete car rental chania airport, chania airport car hire in terminalcar hire chania,car chania airport,auto chania airport,aeroporto chania noleggio auto,car hire crete chania,car hire chania airport, cheap car hire crete chania airport,car hire chania airport reviews, car4crete rent a car chania airport',
    },
    heraklion: {
      title: 'Car Hire Heraklion Crete / Car Rental Heraklion Greece / Car4Crete',
      description:
        '19€ Hire Car in Heraklion Greece. Call +(30) 6949367278 to get Car Hire best deal in Heraklion city, Heraklion port and near area. Personalized offers in chat on the site!',
      keywords:
        'car hire crete heraklion port, car hire crete heraklion, heraklion rent a car, car rental heraklion greece, rent a car in heraklion crete, location voiture Heraklion, autonoleggio creta heraklion  car rent heraklion,  car rental crete heraklion,  car rental heraklion greece, cheap car hire heraklion,  hire car in heraklion,  rent a car heraklion,  rent a car in heraklion crete,  rent car airport heraklion,  rent car heraklion,  rental car heraklion,  rental car heraklion greece,  rental heraklion,  heraklion car rental,  heraklion car hire,',
    },
    rethymno: {
      title: 'Rethymno Car Rental / Car Hire Rethimno Crete / Car4Crete ',
      description:
        'How much does it cost to Rent a car Rethymno Crete? Car Rentals in Rethymno from 19€! You can travel around and return car in airport Heraklion or Chania. ',
      keywords:
        'rethymno car rent, rethymno car rental, car hire rethymno, rethymno car rental prices, rent a car bali crete,rethymno rent a car',
    },
    hersonissos: {
      title: 'Car Hire Hersonissos Crete /Rent a car Hersonissos / Car4Crete',
      description:
        'Rent a car Hersonissos or Malia? Maybe Agios Nikolaos or Elounda in Crete? Car rental with free delivery to your door 🚗 to any hotel in Crete. For YOU we made it easy - rent a car in Crete anywhere - right at Heraklion airport or to hotels of Heraklion, Elounda, Hersonissos, Malia, Anissaras, Kokkini Hani .',
      keywords:
        'hersonissos location de voiture, car hire agios nikolaos crete, rent a car agios nikolaos crete, car hire elounda crete, car hire gouves crete, rent a car hersonissos crete, car hire Hersonissos, rent a car malia crete, car hire stalis crete,car rental stalis crete,rent a car stalis,car hire hersonissos crete,car rental hersonissos crete,rent car chersonissos,car hire hersonissos,',
    },
  },
  de: {
    search: {
      title: 'Mietwagen Kreta  / Autovermietung Kreta / Car4Crete',
      description:
        'Wie teuer ist ein Auto mieten auf Kreta? Mit belibsteste Autovermietung Car4Crete Gutes Angebot 19 €/Tag. Sparen & Fahren in Komfort & Stil! Neue Volkswagen zu vermieten überall auf Kreta - direkt am Flughafen Heraklion oder zu Hotels mit Lieferung in Heraklion, Rethymno, Chania, Hersonissos, Malia, Anissaras, Bali.',
      keywords:
        'auto mieten kreta, kreta mietwagen, mietwagen kreta heraklion flughafen, kreta auto mieten, mietwagen kreta heraklion, mietwagen kreta hotelzustellung, autovermietung rethymno, autovermietung chersonissos,  kreta flughafen auto mieten, mietwagen heraklion flughafen, mietwagen kreta rethymno, autovermietung stalis kreta, autovermietung malia kreta, mietwagen agios nikolaos, mietwagen agia pelagia,  mietwagen kreta günstig, mietwagen kreta buchen,billiger mietwagen kreta, mietwagen kreta online, mietwagen kreta hotelzustellung, mietwagen kreta cabrio mietwagen kreta billig, mietwagen kreta, mietwagen kreta flughafen, Kreta mietwagen kosten',
    },
    catalog: {
      title: 'Automodelle zu vermieten auf Kreta / Autovermietung in Heraklion, Rethymnon, Chania / Car4Crete',
      description:
        'Neue Autovermietung auf Kreta - Audi, VW, Fiat, Suzuki. Automatik, Schalt, Hybrid und Elektroautos zur Miete auf Kreta. Reservierung eines bestimmten Modells ohne Vorauszahlung. Preisgarantie ohne Zwischenhändler. Autovermietung in Heraklion, Heraklion Flughafen, Rethymnon, Hersonissos – einfach im Jahr 2022.',
      keywords:
        'heraklion mietwagen flughafen, mietauto kreta heraklion flughafen, auto mieten in kreta, autovermietung flughafen heraklion,auto mieten kreta kosten, auto mieten auf kreta preise',
    },
    contacts: {
      title:
        'Autovermietung auf Kreta - Mietstationen & Angebote Car4Crete. Kontaktieren Sie uns, um ein Auto auf Kreta zu mieten / Car4Crete',
      description:
        'Mietwagen Kreta - kontaktieren Sie uns direkt ohne Zeitverlust. Sie können ein Auto auf Kreta mieten, indem Sie anrufen, an den Messenger schreiben oder auf der Website buchen.',
      keywords:
        'billiger mietwagen kreta, auto mieten kreta flughafen, heraklion auto mieten, autovermietung kreta heraklion, mietwagen kreta hotelzustellung',
    },
    policy: {
      title: 'Mietbedingung zum Auto auf Kreta mieten / Car4Crete',
      description: 'Premium-Mietwagenversicherung auf Kreta – Sie entspannen sich, wir kümmern uns um Sie!',
      keywords: 'auto auf kreta mieten, kreta autovermietung',
    },
    /** локации */
    'heraklion-airport': {
      title: 'Mietwagen Heraklion Flughafen / Autovermietung Heraklion Flughafen / Car4Crete',
      description:
        'Sehr Gut Angebote für Mietwagen am Flughafen Kreta Heraklion ab 19 € pro Tag ohne zusätzliche Gebühren. Auto mieten Kreta Heraklion Flughafen ist ganz einfach ✓ Buchen online ✓Treffen am Terminal ✓ Kostenlose Stornierung ✓ Keine versteckten Kosten. Autovermietung Kreta Heraklion Flughafen ➤ Auto mieten und flexibel bleiben ',
      keywords:
        'mietwagen kreta heraklion flughafen, auto mieten in heraklion flughafen, mietwagen heraklion Kreta, mietwagen heraklion flughafen günstig, mietwagen heraklion airport,  kreta heraklion auto mieten, auto mieten heraklion flughafen, mietwagen kreta heraklion flughafen, mietwagen kreta flughafen iraklio, heraklion flughafen auto mieten, heraklion flughafen mietwagen, mietwagen heraklion flighafen empfehlung, ',
    },
    'chania-airport': {
      title: 'Autovermietung Chania Flughafen / Mietwagen Chania Flughafen Kreta / Car4Crete',
      description:
        'Chania Flughafen Auto Mieten. Der beliebsteste Autovermietung der Kreta am Flughafen Chania. Du glaubst nicht? Klicken Sie hier und finden Sie einen neuen Mietwagen zu einem attraktiven Preis. ✓ All-Inclusive ✓ Treffen am Terminal ✓ Preisgarantie ✓ Kostenlose Stornierung ✓ Keine versteckten Kosten',
      keywords:
        'Chania autovermietung Kreta, Chania car hire airport, Chania mietwagen, Chania auto huren, Chania auto vermieten, Chania auto rentals, Chania auto mieten',
    },
    heraklion: {
      title: 'Autovermietung Heraklion / Mietwagen Kreta / Car4Crete',
      description:
        'STOP! Du suchst günstige Mietwagen in Heraklion? Autovermietung Heraklion alles inklusive von Car4Crete! Die besten Mietwagenangebote auf Kreta. Neuwagen mit persönlichem Service. Ausgabe und Rückgabe des Autos 24/7. Vermietung am Flughafen und Hafen Heraklion. Schnelle Autovermietung in Kreta Hotels.',
      keywords:
        'günstig auto mieten heraklion, mietwagen kreta amoudara, mietwagen heraklion hafen, rentcar kreta, auto mieten auf kreta heraklion auto mieten kreta heraklion, billiger mietwagen kreta heraklion, autovermietung kreta heraklion, günstige mietwagen kreta heraklion, heraklion autovermietung stadt, heraklion autovermietung hafen',
    },
    rethymno: {
      title: 'Autovermietung Rethymnon / Mietwagen Rethymnon Kreta / Car4Crete',
      description:
        'Check24 /7 Mietwagen in Rethymno. Mietwagen Rethymno und Kreta erkunden ✓Neues Autos ✓ Hotelzustellung ✓Keine versteckten Kosten✓Localiche Autovermietung  ✓All-Inclusive ✓Kostenlose Stornierung. Jetzt Auto mieten mit Angebote ab 19 € pro Tag. ',
      keywords:
        'auto mieten kreta rethymno, auto mieten bali kreta,mietwagen kreta bali, mietwagen kreta rethymno, rethymnon auto mieten,   rethymno car rental,   auto mieten kreta rethymno,   auto mieten rethymno, Check24 Mietwagen Rethymnon,   mietwagen kreta rethymno,   car rental rethymno,   auto mieten rethymnon,   rethymnon auto mieten,      ',
    },
    hersonissos: {
      title: 'Mietwagen Chersonissos / Autovermietung Stalis / Car4Crete',
      description:
        'Mietwagen Chersonissos oder Malia? Aktuelle Mietwagen Angebote in Chersonissos. Mietwagen in Chersonissos ist eine großartige Möglichkeit, die Gegend zu erkunden.',
      keywords:
        'auto mieten chersonissos kreta, mietwagen kreta kokkini hani, mietwagen kreta chersonissos, auto mieten malia kreta,auto mieten agios nikolaos,auto mieten gouves kreta,auto mieten kreta stalis,mietwagen kreta malia,   auto huren malia,   location voiture malia,   auto mieten malia kreta,   mietwagen kreta malia,   malia auto mieten,mietwagen kreta anissaras, auto huren malia,   location voiture malia,   malia auto mieten,auto mieten kreta stalis,   mietwagen kreta stalis,   auto mieten stalis,elounda car hire   car hire elounda crete,    mietwagen kreta agios nikolaos   ',
    },
  },
};

export const getPages = (lang: keyof typeof keywords) => [
  { path: '', pathMatch: 'full', redirectTo: 'search' },
  {
    path: 'search',
    component: SearchComponent,
    data: {
      ...keywords[lang].search,
    },
  },
  {
    path: 'catalog',
    component: CatalogComponent,
    data: {
      ...keywords[lang].catalog,
    },
  },
  {
    path: 'contacts',
    component: ContactsComponent,
    data: {
      ...keywords[lang].contacts,
    },
  },
  {
    path: 'policy',
    component: PolicyComponent,
    data: {
      ...keywords[lang].policy,
    },
  },
  {
    path: 'about-crete',
    component: AboutCreteComponent,
    data: {},
  },
  {
    path: 'rental-locations/:location',
    component: RentalLocationsComponent,
    data: {},
  },
  { path: 'details/:id', component: DetailsComponent },
  { path: 'booking/:id', component: BookingFormComponent },
  { path: 'edit-car/:id', component: EditCarComponent, canActivate: [AdminGuard] },
  { path: 'edit-location/:location', component: EditLocationComponent, canActivate: [AdminGuard] },
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
      { path: 'locations', component: LocationsComponent, canActivate: [AdminGuard] },
    ],
  },
];
