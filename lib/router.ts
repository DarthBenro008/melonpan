import {
  MelonHandler,
  MelonMiddleware,
  Methods,
  MiddlewareMap,
  MiddlewareStorage,
  RouteHandler,
  RouteMap,
} from "./types";

class RouterEngine {
  private routerMap: RouteMap;
  key: number;
  protected counter: number;
  middlewareStorage: MiddlewareStorage;
  middlewareMap: MiddlewareMap;
  constructor() {
    this.routerMap = new Map<string, RouteHandler>();
    this.middlewareMap = new Map<number, MelonMiddleware>();
    this.counter = 0;
    this.middlewareStorage = [];
  }
  private createRoute(method: Methods, path: string, handler: MelonHandler) {
    const route: RouteHandler = {
      path,
      method,
      handler,
      key: this.counter,
    };
    this.counter++;
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
  middleware(melonMiddleware: MelonMiddleware) {
    this.middlewareMap.set(this.counter, melonMiddleware);
    this.middlewareStorage.push(this.counter);
    this.counter++;
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
