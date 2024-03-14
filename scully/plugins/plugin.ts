import { HandledRoute, registerPlugin } from '@scullyio/scully';

registerPlugin('routeProcess', 'filteredRoute', (routes: HandledRoute[]): Promise<HandledRoute[]> => {
  return Promise.resolve(
    routes.filter((r) => {
      console.log(
        r.route,
        r.route.indexOf('profile') < 0 && (r.route.indexOf('/en') > -1 || r.route.indexOf('/de') > -1 || r.route.indexOf('/ru') > -1)
      );

      return r.route.indexOf('profile') < 0 && (r.route.indexOf('/en') > -1 || r.route.indexOf('/de') > -1 || r.route.indexOf('/ru') > -1);
    })
  );
});
