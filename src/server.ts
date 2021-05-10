import path from "path";
import serve from "koa-static";
import { Server } from "boardgame.io/server";
import { StorageAPI } from "boardgame.io";
import { PostgresStore } from "bgio-postgres";
import { StorageCache } from 'bgio-storage-cache';
import { customAlphabet,nanoid } from 'nanoid/non-secure'
//relative path is important, because we dont use webpack
import { SpiritIsland } from "./game/Game";

const PORT = Number(process.env.PORT || 8000);

let db:StorageAPI.Async|undefined = undefined;
let dbWithCaching:StorageAPI.Async|undefined=undefined;

if(process.env.DATABASE_URL){
  db = new PostgresStore(process.env.DATABASE_URL);
  dbWithCaching = new StorageCache(db, { cacheSize: 200 });
}

const server = Server({
  games: [SpiritIsland],
  db:dbWithCaching,
  uuid:customAlphabet('123456789ABCDEFGHJKLMNPQRSTUVWXYZ', 6),
  generateCredentials:()=>nanoid(),
});

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