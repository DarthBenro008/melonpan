import { RouterEngine } from "./router";
import { Methods, routerHandler, routerHashMap } from "./types";

class Melonpan extends RouterEngine {
  private routerContainer: routerHashMap;

  constructor() {
    super();
    this.routerContainer = new Map<string, RouterEngine>();
  }

  use(path: string, router: RouterEngine) {
    this.routerContainer.set(path, router);
  }
  serve(req: Request): Response {
    const path = this.sanitizeUrl(req.url);
    const method = Methods[req.method];
    let routerHandler: routerHandler;
    if (this.routerContainer.size != 0) {
      for (let [key, router] of this.routerContainer) {
        if (path.includes(key)) {
          const trimmedPath = path.replace(key, "");
          routerHandler = this.findHandlerfromMap(router, trimmedPath, method);
          if (routerHandler) {
            return routerHandler.handler(req);
          }
        }
      }
    }
    routerHandler = this.findHandlerfromMap(this, path, method);
    if (routerHandler) {
      return routerHandler.handler(req);
    }
    return new Response(`cannot find ${path}`);
  }

  private findHandlerfromMap(
    router: RouterEngine,
    path: string,
    method: Methods
  ): routerHandler {
    return router.getRouteFromRouter(method, path);
  }

  private sanitizeUrl(url: string): string {
    return new URL(url).pathname;
  }
}

export { RouterEngine as MelonRouter, Melonpan };
