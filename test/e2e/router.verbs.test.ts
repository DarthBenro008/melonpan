import { it, expect } from "bun:test";
import { data, parsedData, httpEndpoint } from "./helper";
import { Melonpan, MelonRouter } from "../../index";

const melonpan = new Melonpan();

it("ensures GET Verb registers", async () => {
  const router = new MelonRouter();
  router.get("/test", () => new Response(parsedData));
  melonpan.use("/get", router);
  const resp = melonpan.serve(
    new Request(`${httpEndpoint}get/test`, { method: "GET" })
  );
  const parsedResult = await resp.json();
  expect(resp.status).toBe(200);
  expect(parsedResult.message).toBe(data.message);
});

it("ensures GET exclusivity", async () => {
  const router = new MelonRouter();
  router.get("/test", () => new Response(parsedData));
  melonpan.use("/get", router);
  const resp = melonpan.serve(
    new Request(`${httpEndpoint}get/test`, { method: "POST" })
  );
  const parsedResult = await resp.text();
  expect(resp.status).toBe(404);
  expect(parsedResult).toBe(`cannot find /get/test`);
});

it("ensures POST Verb registers", async () => {
  const router = new MelonRouter();
  router.post("/test", () => new Response(parsedData));
  melonpan.use("/post", router);
  const resp = melonpan.serve(
    new Request(`${httpEndpoint}post/test`, { method: "POST" })
  );
  const parsedResult = await resp.json();
  expect(resp.status).toBe(200);
  expect(parsedResult.message).toBe(data.message);
});

it("ensures POST exclusivity", async () => {
  const router = new MelonRouter();
  router.post("/test", () => new Response(parsedData));
  melonpan.use("/post", router);
  const resp = melonpan.serve(
    new Request(`${httpEndpoint}post/test`, { method: "GET" })
  );
  const parsedResult = await resp.text();
  expect(resp.status).toBe(404);
  expect(parsedResult).toBe(`cannot find /post/test`);
});

it("ensures PUT Verb registers", async () => {
  const router = new MelonRouter();
  router.put("/test", () => new Response(parsedData));
  melonpan.use("/put", router);
  const resp = melonpan.serve(
    new Request(`${httpEndpoint}put/test`, { method: "PUT" })
  );
  const parsedResult = await resp.json();
  expect(resp.status).toBe(200);
  expect(parsedResult.message).toBe(data.message);
});

it("ensures PUT exclusivity", async () => {
  const router = new MelonRouter();
  router.put("/test", () => new Response(parsedData));
  melonpan.use("/put", router);
  const resp = melonpan.serve(
    new Request(`${httpEndpoint}put/test`, { method: "GET" })
  );
  const parsedResult = await resp.text();
  expect(resp.status).toBe(404);
  expect(parsedResult).toBe(`cannot find /put/test`);
});

it("ensures DELETE Verb registers", async () => {
  const router = new MelonRouter();
  router.delete("/test", () => new Response(parsedData));
  melonpan.use("/delete", router);
  const resp = melonpan.serve(
    new Request(`${httpEndpoint}delete/test`, { method: "DELETE" })
  );
  const parsedResult = await resp.json();
  expect(resp.status).toBe(200);
  expect(parsedResult.message).toBe(data.message);
});

it("ensures DELETE exclusivity", async () => {
  const router = new MelonRouter();
  router.delete("/test", () => new Response(parsedData));
  melonpan.use("/delete", router);
  const resp = melonpan.serve(
    new Request(`${httpEndpoint}delete/test`, { method: "GET" })
  );
  const parsedResult = await resp.text();
  expect(resp.status).toBe(404);
  expect(parsedResult).toBe(`cannot find /delete/test`);
});
