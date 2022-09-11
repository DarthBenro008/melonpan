import RouterEngine from "./router";
import {
  Methods,
  MiddlewareMap,
  MiddlewareStorage,
  QueryParamMap,
  RouteHandler,
} from "./types";

class RouterInternalUtility extends RouterEngine {
  declare key: number;

  getMiddlewareMap(): MiddlewareMap {
    return this.middlewareMap;
  }

  getQpMap(): QueryParamMap {
    return this.qpMap;
  }

  getMiddlewareStorage(): MiddlewareStorage {
    return this.middlewareStorage;
  }

  getRouteFromRouter(method: Methods, path: string): RouteHandler {
    return this.routerMap.get(RouterInternalUtility.getRouterKey(method, path));
  }
}

export default RouterInternalUtility;
