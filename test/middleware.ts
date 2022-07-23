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

export default {
  port: 3000,
  async fetch(req: Request) {
    return melonpan.serve(req);
  },
};
