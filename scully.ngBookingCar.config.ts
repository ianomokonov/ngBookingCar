import { ScullyConfig } from '@scullyio/scully';
const getRoutes = () => {
  const res = [];

  for (let i = 4; i < 40; i++) {
    res.push(`/en/booking/${i + 1}`);
    res.push(`/en/details/${i + 1}`);
    res.push(`/ru/booking/${i + 1}`);
    res.push(`/ru/details/${i + 1}`);
    res.push(`/de/booking/${i + 1}`);
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
    '/de/search',
    '/de/catalog',
    '/de/contacts',
    '/de/policy',
    '/de/about-crete',
    '/de/feedback',
    ...getRoutes(),
  ],
};
