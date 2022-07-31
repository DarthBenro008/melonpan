import RouterEngine from "./router";
import RouterInternalUtility from "./routerHelper";
import { MelonMiddleware, Methods, RouteHandler, RouterMap } from "./types";

class Melonpan extends RouterEngine {
  private routerMapping: RouterMap;

  constructor() {
    super(null);
    this.routerMapping = new Map<string, RouterInternalUtility>();
  }

  use(path: string, router: RouterEngine) {
    const routerHelper: RouterInternalUtility = new RouterInternalUtility(
      router
    );
    routerHelper.key = this.counter;
    this.counter += 1;
    this.routerMapping.set(path, routerHelper);
  }

  serve(req: Request): Response {
    const res = new Response();
    const path = Melonpan.sanitizeUrl(req.url);
    const method = Methods[req.method];
    let routeHandler: RouteHandler;
    const baseHelper: RouterInternalUtility = new RouterInternalUtility(this);
    // We check for other router that matches the routes
    if (this.routerMapping.size !== 0) {
      // eslint-disable-next-line no-restricted-syntax
      for (const [key, router] of this.routerMapping) {
        if (path.startsWith(key)) {
          const trimmedPath = path.replace(key, "");
          routeHandler = Melonpan.findHandlerfromMap(
            router,
            trimmedPath,
            method
          );
          if (routeHandler) {
            // Execution of all the global middlwares takes place first
            const { mreq, mres } = Melonpan.executeMiddlewares(
              baseHelper,
              router.key,
              req,
              res
            );
            // Here the execution of router middleware takes place
            const { mreq: mreq2, mres: mres2 } = Melonpan.executeMiddlewares(
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

    // We check the default router to redirect to handler
    routeHandler = Melonpan.findHandlerfromMap(baseHelper, path, method);
    if (routeHandler) {
      const { mreq, mres } = Melonpan.executeMiddlewares(
        baseHelper,
        routeHandler.key,
        req,
        res
      );
      return routeHandler.handler(mreq, mres);
    }
    return new Response(`cannot find ${path}`);
  }

  private static findHandlerfromMap(
    router: RouterInternalUtility,
    path: string,
    method: Methods
  ): RouteHandler {
    return router.getRouteFromRouter(method, path);
  }

  private static executeMiddlewares(
    router: RouterInternalUtility,
    key: number,
    req: Request,
    res: Response
  ): { mreq: Request; mres: Response } {
    for (let i = 0; i < router.getMiddlewareStorage().length; i += 1) {
      if (key <= i) {
        break;
      }
      const handler: MelonMiddleware = router
        .getMiddlewareMap()
        .get(router.getMiddlewareStorage()[i]);
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      handler(req, res, () => {});
    }
    return { mreq: req, mres: res };
  }

  private static sanitizeUrl(url: string): string {
    return new URL(url).pathname;
  }
}

export { RouterEngine as MelonRouter, Melonpan };
