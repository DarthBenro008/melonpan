import { Melonpan, MelonRouter } from "../index";

const router = new MelonRouter();
router.get("/hello", () => {
  return new Response("Hello from Melonpan");
});
const melonpan = new Melonpan(router);

export default {
  port: 3000,
  async fetch(req: Request) {
    return melonpan.serve(req);
  },
};
