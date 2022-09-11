/* eslint-disable class-methods-use-this */
interface IMelonResponseOptions {
  statusText: string;
  headers: HeadersInit;
}

interface IMelonContext {
  json(
    statusCode: number,
    message: any,
    options?: IMelonResponseOptions
  ): Response;
  text(
    statusCode: number,
    message: any,
    options?: IMelonResponseOptions
  ): Response;
  [index: string]: any;
}

class MelonContext implements IMelonContext {
  [index: string]: any;

  json(
    statusCode: number,
    message: any,
    options?: IMelonResponseOptions
  ): Response {
    return new Response(JSON.stringify(message), {
      status: statusCode,
      ...options,
    });
  }

  text(
    statusCode: number,
    message: any,
    options?: IMelonResponseOptions
  ): Response {
    return new Response(message, { status: statusCode, ...options });
  }
}

export default MelonContext;
