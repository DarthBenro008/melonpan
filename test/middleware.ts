import { Melonpan, MelonRouter } from "../index";

let counter = 0;
const melonpan = new Melonpan();
melonpan.middleware((req, res, next) => {
  counter++;
  next();
});
melonpan.middleware((req, res, next) => {
  counter++;
  next();
});
melonpan.get("/hello", () => {
  return new Response(`this is a nested Router ${counter}`);
});
melonpan.middleware((req, res, next) => {
  console.log("middlware has been hit 3");
});

melonpan.get("/hi", () => {
  return new Response("3 middlewares have been called");
});

const router = new MelonRouter();
router.middleware((req, res, next) => {
  console.log("router: middleware");
});
router.get("/mid", () => {
  return new Response("Router hit1");
});
melonpan.use("/router", router);
export default {
  port: 3000,
  async fetch(req: Request) {
    return melonpan.serve(req);
  },
};
