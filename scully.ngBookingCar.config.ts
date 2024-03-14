import { ScullyConfig } from '@scullyio/scully';
require('./scully/plugins/plugin');

const getRoutes = () => {
  const res = [];

  for (let i = 4; i < 40; i++) {
    res.push(`/en/details/${i + 1}`);
    res.push(`/ru/details/${i + 1}`);
    res.push(`/de/details/${i + 1}`);
  }

  return res;
};
export const config: ScullyConfig = {
  projectRoot: './src',
  projectName: 'ngBookingCar',
  outDir: './dist/static',
  routes: {
    '/edit-car/:id': {
      type: 'json',
    },
    '/rental-locations/:location': {
      type: 'json',
    },
  },
  extraRoutes: [
    '/en/search',
    '/en/catalog',
    '/en/contacts',
    '/en/policy',
    '/en/about-crete',
    '/ru/search',
    '/ru/catalog',
    '/ru/contacts',
    '/ru/policy',
    '/ru/about-crete',
    '/de/search',
    '/de/catalog',
    '/de/contacts',
    '/de/policy',
    '/de/about-crete',
    '/en/rental-locations/heraclion-airport',
    '/de/rental-locations/heraclion-airport',
    '/ru/rental-locations/heraclion-airport',
    '/en/rental-locations/chania-airport',
    '/de/rental-locations/chania-airport',
    '/ru/rental-locations/chania-airport',
    '/en/rental-locations/hersonissos',
    '/de/rental-locations/hersonissos',
    '/ru/rental-locations/hersonissos',
    '/en/rental-locations/heraclion',
    '/de/rental-locations/heraclion',
    '/ru/rental-locations/heraclion',
    '/en/rental-locations/rethymno',
    '/de/rental-locations/rethymno',
    '/ru/rental-locations/rethymno',
    ...getRoutes(),
  ],
};
