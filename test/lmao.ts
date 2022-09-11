import {Melonpan} from "../index";
const ml = new Melonpan();
ml.get("/nice", (req, ctx) => ctx.text(200, "ggwp"));
ml.get("/", (req, ctx) => ctx.text(200, "default handler"));

export default{
    fetch(request){
        return ml.serve(request)
    }
}
