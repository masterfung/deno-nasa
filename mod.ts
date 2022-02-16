import { Application, send } from "https://deno.land/x/oak@v10.2.1/mod.ts";
import router from "./api.ts";

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

app.use(async (ctx, next) => {
  await next();
  console.log(`${ctx.request.method} ${ctx.request.url} ${ctx.response.headers.get("X-Response-Time")}`);
});

app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const delta = Date.now() - start;
  ctx.response.headers.set("X-Response-Time", `${delta}ms`);
});

app.use(async (ctx) => {
  const filePath = ctx.request.url.pathname;
  const fileWhitelist = [
    "/index.html",
    "/javascripts/scripts.js",
    "/images/favicon.png",
    "/stylesheets/style.css"
  ]
  await send(ctx, filePath, {
    root: `${Deno.cwd()}/public`,
  });
});

if (import.meta.main) {
  await app.listen({ port: 8000 });
}