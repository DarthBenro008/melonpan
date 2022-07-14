import { RouterEngine } from "./router";
import { Methods, routerHandler } from "./types";

class Melonpan {
  private router: RouterEngine;

  constructor(router: RouterEngine) {
    this.router = router;
  }
  serve(req: Request): Response {
    const path = this.sanitizeUrl(req.url);
    const method = Methods[req.method];
    const routerHandler: routerHandler = this.router.getRouteFromRouter(
      method,
      path
    );
    if (routerHandler) {
      return routerHandler.handler();
    }

    return new Response(`cannot find ${path}`);
  }

  private sanitizeUrl(url: string): string {
    return new URL(url).pathname;
  }
}

export default Melonpan;
