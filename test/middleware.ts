/* eslint-disable no-console */
import { Melonpan, MelonRouter } from "../index";

let counter = 0;
const melonpan = new Melonpan();
melonpan.middleware((_req, _res, next) => {
  counter += 1;
  next();
});
melonpan.middleware((_req, _res, next) => {
  counter += 1;
  next();
});
melonpan.get(
  "/hello",
  () => new Response(`this is a nested Router ${counter}`)
);
melonpan.middleware(() => {
  counter += 4;
});

melonpan.get("/hi", () => new Response("3 middlewares have been called"));

const router = new MelonRouter();
router.middleware(() => {
  counter += 2;
});
router.get("/mid", () => new Response(`Router has been hit ${counter}`));
melonpan.use("/router", router);
export default {
  port: 3000,
  async fetch(req: Request) {
    return melonpan.serve(req);
  },
};
