import RouterEngine from "./router";
import {
  Methods,
  MiddlewareMap,
  MiddlewareStorage,
  RouteHandler,
} from "./types";

class RouterInternalUtility extends RouterEngine {
  key: number;

  getMiddlewareMap(): MiddlewareMap {
    return this.middlewareMap;
  }

  getMiddlewareStorage(): MiddlewareStorage {
    return this.middlewareStorage;
  }

  getRouteFromRouter(method: Methods, path: string): RouteHandler {
    return this.routerMap.get(RouterInternalUtility.getRouterKey(method, path));
  }
}

export default RouterInternalUtility;
