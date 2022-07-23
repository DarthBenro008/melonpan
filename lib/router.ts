import { MelonHandler, Methods, RouteHandler, RouteMap } from "./types";

class RouterEngine {
  private routerMap: RouteMap;

  constructor() {
    this.routerMap = new Map<string, RouteHandler>();
  }
  private createRoute(method: Methods, path: string, handler: MelonHandler) {
    const route: RouteHandler = {
      path,
      method,
      handler,
    };
    const key: string = this.getRouterKey(method, path);
    this.routerMap.set(key, route);
  }

  get(path: string, handler: MelonHandler) {
    this.createRoute(Methods.GET, path, handler);
  }
  post(path: string, handler: MelonHandler) {
    this.createRoute(Methods.POST, path, handler);
  }

  delete(path: string, handler: MelonHandler) {
    this.createRoute(Methods.DELETE, path, handler);
  }
  put(path: string, handler: MelonHandler) {
    this.createRoute(Methods.PUT, path, handler);
  }
  //TODO: make this function protected by introducing an hirearchy entity
  getRouteFromRouter(method: Methods, path: string): RouteHandler {
    return this.routerMap.get(this.getRouterKey(method, path));
  }

  protected getRouterKey(method: Methods, path: string): string {
    return method + path;
  }
}

export { RouterEngine };
