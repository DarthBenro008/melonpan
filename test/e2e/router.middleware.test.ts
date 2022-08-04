import { it, expect } from "bun:test";
import { data, parsedData, httpEndpoint } from "./helper";
import { Melonpan, MelonRouter } from "../../index";

const melonpan = new Melonpan();

it("checks middleware registration", async () => {
  const router = new MelonRouter();
  let counter = 0;
  router.middleware((req, _res, next) => {
    counter += 1;
  });
  router.get("/single", () => new Response(`${counter}`));
  router.middleware((req, _res, next) => {
    counter += 5;
  });
  router.get("/double", () => new Response(`${counter}`));
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
  expect(doubleCounter).toBe("7");
});
