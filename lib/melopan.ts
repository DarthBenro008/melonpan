import RouterEngine from "./router";
import RouterInternalUtility from "./routerHelper";
import MelonContext from "./context";
import { MelonMiddleware, Methods, RouteHandler, RouterMap, MelonHandler } from "./types";
import PathUtilities, { MelonQueryParams } from "./path_utilities";
import Logger from "./logger";

interface MelonpanOptions {
  logging: boolean;
  logo: boolean;
}

class Melonpan extends RouterEngine {
  private routerMapping: RouterMap;

  private loggerEnabled: boolean;

  private logger: Logger;

  private parseOptions(options: MelonpanOptions) {
    if (options.logging) {
      this.loggerEnabled = true;
      this.logger = new Logger();
    }
    if (options.logo) {
      Logger.logo();
    }
  }

  private log(req: Request): void {
    this.logger.routeLogger(req);
  }

  constructor(options?: MelonpanOptions) {
    super(null);
    const defaultOpts: MelonpanOptions = {
      logo: true,
      logging: true,
    };
    if (!options) {
      this.parseOptions(defaultOpts);
    } else {
      this.parseOptions(options);
    }
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
    if (this.loggerEnabled) {
      this.log(req);
    }
    const ctx: MelonContext = new MelonContext();
    let path = Melonpan.sanitizeUrl(req.url);
    const method = Methods[req.method];
    if (this.qpMap.size !== 0) {
      const [qp, newPath] = this.checkQueryParams(path);
      if (newPath !== "") {
        path = newPath;
      }
      ctx.params = qp;
    }
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
            const { mreq, mctx } = Melonpan.executeMiddlewares(
              baseHelper,
              router.key,
              req,
              ctx
            );
            // Here the execution of router middleware takes place
            const { mreq: mreq2, mctx: mctx2 } = Melonpan.executeMiddlewares(
              router,
              routeHandler.key,
              mreq,
              mctx
            );
            return routeHandler.handler(mreq2, mctx2);
          }
        }
      }
    }

    // We check the default router to redirect to handler
    routeHandler = Melonpan.findHandlerfromMap(baseHelper, path, method);
    if (routeHandler) {
      const { mreq, mctx } = Melonpan.executeMiddlewares(
        baseHelper,
        routeHandler.key,
        req,
        ctx
      );
      return routeHandler.handler(mreq, mctx);
    }
    // Look for default handler
    const defaultHandler = Melonpan.findHandlerfromMap(baseHelper, "*", method);
    if (defaultHandler) {
      const { mreq, mctx } = Melonpan.executeMiddlewares(
        baseHelper,
        defaultHandler.key,
        req,
        ctx
      );
      return defaultHandler.handler(mreq, mctx);
    }
    // If default handler is not found
    return new Response(`cannot find ${path}`, { status: 404 });
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
    ctx: MelonContext
  ): { mreq: Request; mctx: MelonContext } {
    for (let i = 0; i < router.getMiddlewareStorage().length; i += 1) {
      if (key <= i) {
        break;
      }
      const handler: MelonMiddleware = router
        .getMiddlewareMap()
        .get(router.getMiddlewareStorage()[i]);
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      handler(req, ctx, () => {});
    }
    return { mreq: req, mctx: ctx };
  }

  private static sanitizeUrl(url: string): string {
    const parsedUrl = new URL(url).pathname;
    if (parsedUrl.slice(-1) === "/" && parsedUrl.length !== 1) {
      return parsedUrl.slice(0, -1);
    }
    return parsedUrl;
  }

  private checkQueryParams(path: string): [MelonQueryParams, string] {
    const pathSlicer = path.split("/");
    if (this.qpMap.has(pathSlicer.length)) {
      const data = this.qpMap.get(pathSlicer.length);
      // eslint-disable-next-line no-restricted-syntax
      for (const paths of data) {
        if (PathUtilities.verifyPathForQueryParams(path, paths)) {
          return [
            PathUtilities.extractQueryParamsFromPath(path, paths),
            paths.route,
          ];
        }
      }
    }
    return [{}, ""];
  }
}

export { 
  RouterEngine as MelonRouter, 
  Melonpan, 
  MelonContext, 
  MelonMiddleware, 
  MelonHandler,
  Methods as MelonMethods, 
  RouteHandler as MelonRouteHandler
};
