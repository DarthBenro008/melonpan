import { it, expect } from "bun:test";
import { httpEndpoint } from "./helper";
import { Melonpan, MelonRouter } from "../index";

const melonpan = new Melonpan({ logo: false, logging: false });

it("checks middleware registration", async () => {
  const router = new MelonRouter();
  router.middleware((_, ctx) => {
    ctx.counter = 0;
    ctx.counter += 1;
  });
  router.get("/single", (_, ctx) => new Response(`${ctx.counter}`));
  router.middleware((_req, ctx, _next) => {
    ctx.counter += 5;
  });
  router.get("/double", (_, ctx) => new Response(`${ctx.counter}`));
  melonpan.use("/test/middleware", router);
  const singleResp = melonpan.serve(
    new Request(`${httpEndpoint}test/middleware/single`)
  );
  const doubleResp = melonpan.serve(
    new Request(`${httpEndpoint}test/middleware/double`)
  );
  const singleCounter = await singleResp.text();
  const doubleCounter = await doubleResp.text();
  expect(singleCounter).toBe("1");
  expect(doubleCounter).toBe("6");
});

it("checks huge middlware registration", async () => {
  const router = new MelonRouter();
  router.middleware((_, ctx, next) => {
    ctx.counter = 0;
    next();
  });
  for (let i = 0; i < 6000; i += 1) {
    router.middleware((_, ctx, _next) => {
      ctx.counter += 1;
    });
  }
  router.get("/huge", (_, ctx) => new Response(`${ctx.counter}`));
  melonpan.use("/test/middleware", router);
  const resp = melonpan.serve(
    new Request(`${httpEndpoint}test/middleware/huge`)
  );
  expect(resp.status).toBe(200);
  const respText = await resp.text();
  expect(respText).toBe("6000");
});
