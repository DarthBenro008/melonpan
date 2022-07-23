import { RouterEngine } from "./router";

export enum Methods {
  GET = "GET",
  POST = "POST",
  DELETE = "DELETE",
  PUT = "PUT",
}

export type MelonHandler = (req: Request) => Response;
export type RouteHandler = {
  path: string;
  method: Methods;
  handler: MelonHandler;
};

export type RouteMap = Map<string, RouteHandler>;
export type RouterMap = Map<string, RouterEngine>;
