import { RouterEngine } from "./router";
import { MelonMiddleware, Methods, RouteHandler, RouterMap } from "./types";

class Melonpan extends RouterEngine {
  private routerMapping: RouterMap;

  constructor() {
    super();
    this.routerMapping = new Map<string, RouterEngine>();
  }

  use(path: string, router: RouterEngine) {
    router.key = this.counter;
    this.counter++;
    this.routerMapping.set(path, router);
  }
  serve(req: Request): Response {
    const res = new Response();
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
            // Execution of all the global middlwares takes place first
            let { mreq, mres } = this.executeMiddlewares(
              this,
              router.key,
              req,
              res
            );
            // Here the execution of router middleware takes place
            let { mreq: mreq2, mres: mres2 } = this.executeMiddlewares(
              router,
              routeHandler.key,
              mreq,
              mres
            );
            return routeHandler.handler(mreq2, mres2);
          }
        }
      }
    }

    //We check the default router to redirect to handler
    routeHandler = this.findHandlerfromMap(this, path, method);
    if (routeHandler) {
      let { mreq, mres } = this.executeMiddlewares(
        this,
        routeHandler.key,
        req,
        res
      );
      return routeHandler.handler(mreq, mres);
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
    router: RouterEngine,
    key: number,
    req: Request,
    res: Response
  ): { mreq: Request; mres: Response } {
    for (let i = 0; i < router.middlewareStorage.length; i++) {
      if (key <= i) {
        break;
      }
      const handler: MelonMiddleware = router.middlewareMap.get(
        router.middlewareStorage[i]
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
