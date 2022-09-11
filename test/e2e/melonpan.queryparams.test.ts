import { it, expect } from "bun:test";
import { Melonpan } from "../../index";
import { httpEndpoint } from "./helper";

const melonpan = new Melonpan();
const qp = "123";
const qpp = "567";

it("checks for query params in simple route", async () => {
  melonpan.get("/foo/:id", (_req, ctx) => ctx.text(200, ctx.params.id));
  const resp = melonpan.serve(
    new Request(`${httpEndpoint}foo/${qp}`, { method: "GET" })
  );
  expect(resp.status).toBe(200);
  const parsedResult = await resp.text();
  expect(parsedResult).toBe(qp);
});

it("checks for query params in complex route", async () => {
  melonpan.get("/foo/:id/bar/:secondary", (_req, ctx) =>
    ctx.json(200, ctx.params)
  );
  const resp = melonpan.serve(
    new Request(`${httpEndpoint}foo/${qp}/bar/${qpp}`, { method: "GET" })
  );
  expect(resp.status).toBe(200);
  const parsedResult = (await resp.json()) as any;
  expect(parsedResult.id).toBe(qp);
  expect(parsedResult.secondary).toBe(qpp);
});

it("checks for query params when multiple routes are present", async () => {
  melonpan.get("/foo/:id", (_req, ctx) => ctx.text(200, ctx.params.id));
  melonpan.get("/bar/:id", (_req, ctx) => ctx.text(200, ctx.params.id));
  const resp = melonpan.serve(
    new Request(`${httpEndpoint}foo/${qp}`, { method: "GET" })
  );
  const resp2 = melonpan.serve(
    new Request(`${httpEndpoint}bar/${qpp}`, { method: "GET" })
  );
  expect(resp.status).toBe(200);
  const parsedResult = await resp.text();
  expect(parsedResult).toBe(qp);
  expect(resp2.status).toBe(200);
  const parsedResult2 = await resp2.text();
  expect(parsedResult2).toBe(qpp);
});
