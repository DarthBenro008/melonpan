/* eslint-disable class-methods-use-this */
interface IMelonResponseOptions {
  statusText: string;
  headers: HeadersInit;
}

interface IMelonContext {
  json(
    message: any,
    statusCode?: number,
    options?: IMelonResponseOptions
  ): Response;
  text(
    message: any,
    statusCode?: number,
    options?: IMelonResponseOptions
  ): Response;
  [index: string]: any;
}

class MelonContext implements IMelonContext {
  [index: string]: any;

  json(
    message: any,
    statusCode?: number,
    options?: IMelonResponseOptions
  ): Response {
    return new Response(JSON.stringify(message), {
      status: statusCode ?? 200,
      ...options,
    });
  }

  text(
    message: any,
    statusCode?: number,
    options?: IMelonResponseOptions
  ): Response {
    return new Response(message, { status: statusCode ?? 200, ...options });
  }
}

export default MelonContext;
