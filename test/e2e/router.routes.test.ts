import { it, expect } from "bun:test";
import { Melonpan, MelonRouter } from "../../index";
import { data, httpEndpoint, parsedData } from "./helper";

const melonpan = new Melonpan();

it("ensure route registration takes place", async () => {
  const router = new MelonRouter();
  router.get("/foo/bar", () => new Response(parsedData));
  melonpan.use("/test", router);
  const resp = melonpan.serve(
    new Request(`${httpEndpoint}test/foo/bar`, { method: "GET" })
  );
  const parsedResult = await resp.json();
  expect(resp.status).toBe(200);
  expect(parsedResult.message).toBe(data.message);
});

it("ensure route exclusivity", async () => {
  const router = new MelonRouter();
  router.get("/foo/bar", () => new Response(parsedData));
  melonpan.use("/test", router);
  const resp = melonpan.serve(
    new Request(`${httpEndpoint}test/bar/foo`, { method: "GET" })
  );
  const parsedResult = await resp.text();
  expect(resp.status).toBe(404);
  expect(parsedResult).toBe(`cannot find /test/bar/foo`);
});

it("ensure route with trailing slashes", async () => {
  const router = new MelonRouter();
  router.get("/foo/bar", () => new Response(parsedData));
  melonpan.use("/test", router);
  const resp = melonpan.serve(
    new Request(`${httpEndpoint}test/bar/foo/`, { method: "GET" })
  );
  const parsedResult = await resp.json();
  expect(resp.status).toBe(200);
  expect(parsedResult.message).toBe(data.message);
});
