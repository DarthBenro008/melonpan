import { it, expect } from "bun:test";
import { Melonpan, MelonRouter } from "../index";
import { Data, data, httpEndpoint, parsedData } from "./helper";

const melonpan = new Melonpan({ logo: false, logging: false });

it("checks route registration takes place", async () => {
  const router = new MelonRouter();
  router.get("/foo/bar", () => new Response(parsedData));
  melonpan.use("/test", router);
  const resp = melonpan.serve(
    new Request(`${httpEndpoint}test/foo/bar`, { method: "GET" })
  );
  expect(resp.status).toBe(200);
  const parsedResult = (await resp.json()) as Data;
  expect(parsedResult.message).toBe(data.message);
});

it("checks route exclusivity", async () => {
  const router = new MelonRouter();
  router.get("/foo/bar", () => new Response(parsedData));
  melonpan.use("/test", router);
  const resp = melonpan.serve(
    new Request(`${httpEndpoint}test/bar/foo`, { method: "GET" })
  );
  expect(resp.status).toBe(404);
  const parsedResult = await resp.text();
  expect(parsedResult).toBe(`cannot find /test/bar/foo`);
});

it("checks route with trailing slashes", async () => {
  const router = new MelonRouter();
  router.get("/foo/bar", () => new Response(parsedData));
  melonpan.use("/test", router);
  const resp = melonpan.serve(
    new Request(`${httpEndpoint}test/foo/bar/`, { method: "GET" })
  );
  expect(resp.status).toBe(200);
  const parsedResult = (await resp.json()) as Data;
  expect(parsedResult.message).toBe(data.message);
});

it("checks similar route registration", async () => {
  const newData = "foof";
  const router = new MelonRouter();
  router.get("/foo/bar", () => new Response(parsedData));
  router.get("/foo/bar/foof", () => new Response(newData));
  melonpan.use("/test", router);
  const resp = melonpan.serve(
    new Request(`${httpEndpoint}test/foo/bar`, { method: "GET" })
  );
  expect(resp.status).toBe(200);
  const parsedResult = (await resp.json()) as Data;
  expect(parsedResult.message).toBe(data.message);
  const secondResp = melonpan.serve(
    new Request(`${httpEndpoint}test/foo/bar/foof`, { method: "GET" })
  );
  expect(secondResp.status).toBe(200);
  const secondParsedResult = await secondResp.text();
  expect(secondParsedResult).toBe(newData);
});
