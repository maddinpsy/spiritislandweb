import path from "path";
import serve from "koa-static";
import { Server } from "boardgame.io/server";
import { PostgresStore } from "bgio-postgres";

//relative path is important, because we dont use webpack
import { SpiritIsland } from "./game/Game";


const PORT = Number(process.env.PORT || 8000);

let db:PostgresStore|undefined = undefined;
if(process.env.DATABASE_URL){
  db = new PostgresStore(process.env.DATABASE_URL);
}

const server = Server({ games: [SpiritIsland], db:db});

// Build path relative to the server.js file
const frontEndAppBuildPath = path.resolve(__dirname, '.');
server.app.use(serve(frontEndAppBuildPath))

server.run(PORT, () => {
    server.app.use(
      async (ctx, next) => await serve(frontEndAppBuildPath)(
        Object.assign(ctx, { path: 'index.html' }),
        next
      )
    )
  });