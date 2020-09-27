import { ScullyConfig } from '@scullyio/scully';
export const config: ScullyConfig = {
  projectRoot: './src',
  projectName: 'ngBookingCar',
  outDir: './dist/static',
  routes: {
    '/edit-car/:id': {
      type: 'json',
    },
  },
  extraRoutes: [
    '/en/search',
    '/en/catalog',
    '/en/contacts',
    '/en/policy',
    '/en/about-crete',
    '/en/feedback',
    '/ru/search',
    '/ru/catalog',
    '/ru/contacts',
    '/ru/policy',
    '/ru/about-crete',
    '/ru/feedback',
  ],
};
