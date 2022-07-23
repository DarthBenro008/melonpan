import { RouterEngine } from "./router";
import { MelonMiddleware, Methods, RouteHandler, RouterMap } from "./types";

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
    //We check for other router that matches the routes
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
    //We check the default router to redirect to handler
    routeHandler = this.findHandlerfromMap(this, path, method);
    if (routeHandler) {
      let { mreq, mres } = this.executeMiddlewares(routeHandler.key, req);
      return routeHandler.handler(mreq);
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

  private executeMiddlewares(
    key: number,
    req: Request
  ): { mreq: Request; mres: Response } {
    let res: Response = new Response();
    for (let i = 0; i < this.middlewareStorage.length; i++) {
      if (key <= i) {
        break;
      }
      const handler: MelonMiddleware = this.middlewareMap.get(
        this.middlewareStorage[i]
      );
      handler(req, res, () => {
        return;
      });
    }
    return { mreq: req, mres: res };
  }
  private sanitizeUrl(url: string): string {
    return new URL(url).pathname;
  }
}

export { RouterEngine as MelonRouter, Melonpan };
