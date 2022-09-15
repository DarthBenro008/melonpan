import { Melonpan } from "../index";

const ml = new Melonpan();
ml.get("/", (_req, ctx) => ctx.text(200, "hello world"));

export default {
  port: 3001,
  fetch(req: Request) {
    return ml.serve(req);
  },
};
