import {
  MelonHandler,
  MelonMiddleware,
  Methods,
  MiddlewareMap,
  MiddlewareStorage,
  RouteHandler,
  RouteMap,
} from "./types";

interface RouterEngineInterface {
  get(path: string, handler: MelonHandler): void;
  put(path: string, handler: MelonHandler): void;
  delete(path: string, handler: MelonHandler): void;
  middleware(melonMiddleware: MelonMiddleware): void;
}

class RouterEngine implements RouterEngineInterface {
  protected key: number;

  protected routerMap: RouteMap;

  protected counter: number;

  protected middlewareStorage: MiddlewareStorage;

  protected middlewareMap: MiddlewareMap;

  constructor(routerEngine?: RouterEngine) {
    if (routerEngine) {
      this.middlewareMap = routerEngine.middlewareMap;
      this.routerMap = routerEngine.routerMap;
      this.middlewareStorage = routerEngine.middlewareStorage;
      this.counter = routerEngine.counter;
      this.key = routerEngine.key;
    } else {
      this.routerMap = new Map<string, RouteHandler>();
      this.middlewareMap = new Map<number, MelonMiddleware>();
      this.counter = 0;
      this.middlewareStorage = [];
    }
  }

  private createRoute(method: Methods, path: string, handler: MelonHandler) {
    const route: RouteHandler = {
      path,
      method,
      handler,
      key: this.counter,
    };
    this.counter += 1;
    const key: string = RouterEngine.getRouterKey(method, path);
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

  protected static getRouterKey(method: Methods, path: string): string {
    return method + path;
  }

  middleware(melonMiddleware: MelonMiddleware) {
    this.middlewareMap.set(this.counter, melonMiddleware);
    this.middlewareStorage.push(this.counter);
    this.counter += 1;
  }
}

export default RouterEngine;
