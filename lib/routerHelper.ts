import { RouterEngine } from "./router";
import {
  Methods,
  MiddlewareMap,
  MiddlewareStorage,
  RouteHandler,
} from "./types";

class RouterInternalUtility extends RouterEngine {
  key: number;
  constructor(routerEngine: RouterEngine) {
    super(routerEngine);
  }

  getMiddlewareMap(): MiddlewareMap {
    return this.middlewareMap;
  }
  getMiddlewareStorage(): MiddlewareStorage {
    return this.middlewareStorage;
  }

  getRouteFromRouter(method: Methods, path: string): RouteHandler {
    return this.routerMap.get(this.getRouterKey(method, path));
  }
}

export { RouterInternalUtility };
