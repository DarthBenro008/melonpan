import { RouterEngine } from "./router";
import { Methods, RouteHandler, RouterMap } from "./types";

class Melonpan extends RouterEngine {
  private routerMapping: RouterMap;

  constructor() {
    super();
    this.routerMapping = new Map<string, RouterEngine>();
  }

  use(path: string, router: RouterEngine) {
    this.routerMapping.set(path, router);
  }
  serve(req: Request): Response {
    const path = this.sanitizeUrl(req.url);
    const method = Methods[req.method];
    let routeHandler: RouteHandler;
    if (this.routerMapping.size != 0) {
      for (let [key, router] of this.routerMapping) {
        if (path.includes(key)) {
          const trimmedPath = path.replace(key, "");
          routeHandler = this.findHandlerfromMap(router, trimmedPath, method);
          if (routeHandler) {
            return routeHandler.handler(req);
          }
        }
      }
    }
    routeHandler = this.findHandlerfromMap(this, path, method);
    if (routeHandler) {
      return routeHandler.handler(req);
    }
    return new Response(`cannot find ${path}`);
  }

  private findHandlerfromMap(
    router: RouterEngine,
    path: string,
    method: Methods
  ): RouteHandler {
    return router.getRouteFromRouter(method, path);
  }

  private sanitizeUrl(url: string): string {
    return new URL(url).pathname;
  }
}

export { RouterEngine as MelonRouter, Melonpan };
