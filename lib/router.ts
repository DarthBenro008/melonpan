import { melonHandler, Methods, routerHandler, routerHashMap } from "./types";

class RouterEngine {
  routerMap: routerHashMap;

  constructor() {
    this.routerMap = new Map<string, routerHandler>();
  }
  createRoute(method: Methods, path: string, handler: melonHandler) {
    const route: routerHandler = {
      path,
      method,
      handler,
    };
    const key: string = this.getRouterKey(method, path);
    this.routerMap.set(key, route);
  }

  get(path: string, handler: melonHandler) {
    this.createRoute(Methods.GET, path, handler);
  }
  post(path: string, handler: melonHandler) {
    this.createRoute(Methods.POST, path, handler);
  }

  delete(path: string, handler: melonHandler) {
    this.createRoute(Methods.DELETE, path, handler);
  }
  put(path: string, handler: melonHandler) {
    this.createRoute(Methods.PUT, path, handler);
  }
  getRouteFromRouter(method: Methods, path: string): routerHandler {
    return this.routerMap.get(this.getRouterKey(method, path));
  }

  getRouterKey(method: Methods, path: string): string {
    return method + path;
  }
}

export { RouterEngine };
