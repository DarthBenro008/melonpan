import Melonpan from "../lib/melopan";
import { RouterEngine } from "../lib/router";

const router = new RouterEngine();
router.get("/hello", () => {
  return new Response("Hello from Melonpan");
});
const melonpan = new Melonpan(router);

export default {
  port: 3000,
  async fetch(req: Request) {
    melonpan.serve(req);
  },
};
