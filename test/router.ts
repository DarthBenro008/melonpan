import { Melonpan, MelonRouter } from "../index";

const router = new MelonRouter();
router.get("/hello", () => new Response("Hello from Melonpan"));
const melonpan = new Melonpan();
melonpan.use("/hi", router);
melonpan.get("/hello", () => new Response("this is a nested Router"));

export default {
  port: 3000,
  async fetch(req: Request) {
    return melonpan.serve(req);
  },
};
