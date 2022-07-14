export enum Methods {
  GET = "GET",
  POST = "POST",
  DELETE = "DELETE",
  PUT = "PUT",
}

export type melonHandler = () => Response;
export type routerHandler = {
  path: string;
  method: Methods;
  handler: melonHandler;
};

export type routerHashMap = Map<string, routerHandler>;
