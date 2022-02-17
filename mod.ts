import { Application, send } from "https://deno.land/x/oak@v10.2.1/mod.ts";
import router from "./api.ts";
import * as log from "https://deno.land/std@0.125.0/log/mod.ts";

let logger = log.getLogger();
const app = new Application();
const PORT = 8000;
app.use(router.routes());
app.use(router.allowedMethods());

app.addEventListener("error", (event) => {
  log.error(event.error);
});

app.use(async (ctx, next) => {
  try {
    await next();
  } catch (error) {
    logger.error(`An error has occurred with output of: ${error}!`);
    ctx.response.body = "Internal Server Error.";
    throw error;
  }
});

app.use(async (ctx, next) => {
  await next();
  logger.info(`${ctx.request.method} ${ctx.request.url} ${ctx.response.headers.get("X-Response-Time")}`);
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
  ];
  await send(ctx, filePath, {
    root: `${Deno.cwd()}/public`,
  });
});

if (import.meta.main) {
  logger.info(`Starting app server at port ${PORT}...`)
  await app.listen({ port: PORT });
}