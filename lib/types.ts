import RouterInternalUtility from "./routerHelper";

// eslint-disable-next-line no-shadow
export enum Methods {
  GET = "GET",
  POST = "POST",
  DELETE = "DELETE",
  PUT = "PUT",
}

export type MelonHandler = (req: Request, res: Response) => Response;
export type MelonMiddleware = (
  req: Request,
  res: Response,
  next: () => void
) => void;

export type RouteHandler = {
  path: string;
  method: Methods;
  handler: MelonHandler;
  key: number;
};

export type RouteMap = Map<string, RouteHandler>;
export type RouterMap = Map<string, RouterInternalUtility>;
export type MiddlewareMap = Map<number, MelonMiddleware>;

export type MiddlewareStorage = number[];
