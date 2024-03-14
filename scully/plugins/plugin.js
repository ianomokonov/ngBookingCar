"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const scully_1 = require("@scullyio/scully");
scully_1.registerPlugin('routeProcess', 'filteredRoute', (routes) => {
    return Promise.resolve(routes.filter((r) => {
        console.log(r.route, r.route.indexOf('profile') < 0 && (r.route.indexOf('/en') > -1 || r.route.indexOf('/de') > -1 || r.route.indexOf('/ru') > -1));
        return r.route.indexOf('profile') < 0 && (r.route.indexOf('/en') > -1 || r.route.indexOf('/de') > -1 || r.route.indexOf('/ru') > -1);
    }));
});
//# sourceMappingURL=plugin.js.map