import { RouterEngine } from "./router";

export enum Methods {
  GET = "GET",
  POST = "POST",
  DELETE = "DELETE",
  PUT = "PUT",
}

export type melonHandler = (req: Request) => Response;
export type routerHandler = {
  path: string;
  method: Methods;
  handler: melonHandler;
};

export type routeHashMap = Map<string, routerHandler>;
export type routerHashMap = Map<string, RouterEngine>;
