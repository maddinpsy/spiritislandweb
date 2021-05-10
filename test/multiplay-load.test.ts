import fetch from "node-fetch";
import { Client, LobbyClient } from 'boardgame.io/client';
import { _ClientImpl } from 'boardgame.io/dist/types/src/client/client';
import { Local, SocketIO } from 'boardgame.io/multiplayer';
import { SpiritIsland, SpiritIslandState } from "game/Game"
import { TokenNames } from 'game/GamePhaseMain'
import { resolve } from "path";

//minimum time required for test to pass
//these values are from experiments 

//multiplayer with Local:
//const timeBetweenCommands=0;
//const timeBeforeCheck=0;

//multiplayer on Localhost with db:
//const timeBetweenCommands=400;
//const timeBeforeCheck=300;
//or
//const timeBetweenCommands=0;
//const timeBeforeCheck=4000;

//multiplayer on Localhost with memory:
//const timeBetweenCommands=0;
//const timeBeforeCheck=1500;

//multiplayer on Localhost with caching+db:
//const timeBetweenCommands=0;
//const timeBeforeCheck=2500;
const timeBetweenCommands=0;
const timeBeforeCheck=2500;

function doBoardSetup(p: _ClientImpl<SpiritIslandState>) {
  p.moves.placeBoard("B", { position: { x: 0, y: 0 }, rotation: 0 });
  p.moves.placeSpirit(1, "B");
  p.moves.startGame()
}
function verifyBoardSetup(p: _ClientImpl<SpiritIslandState>) {
  expect(p.getState()?.G.activeSpirits.length).toEqual(1);
  expect(p.getState()?.G.usedBoards.length).toEqual(1);
  expect(p.getState()?.ctx.phase).toEqual("main");
}

async function changeAndCheckBoardTokens(p0: _ClientImpl<SpiritIslandState>, p1: _ClientImpl<SpiritIslandState>) {
  for (let i = 0; i < 10; i++) {
    //player0 increases Presence
    p0.moves.increaseToken("B", 1, TokenNames[5]);
    //player1 increases Blight
    p0.moves.increaseToken("B", 1, TokenNames[4]);
    await sleep(timeBetweenCommands)
  }
  await sleep(timeBeforeCheck)
  //check both players have correct number of coins and blight
  expect(p0.getState()?.G.boardTokens?.
    find(b => b.boardName === "B")?.lands.
    find(l => l.landNumber === 1)?.tokens.
    find(t => t.tokenType === TokenNames[5])?.count
  ).toEqual(10);
  expect(p0.getState()?.G.boardTokens?.
    find(b => b.boardName === "B")?.lands.
    find(l => l.landNumber === 1)?.tokens.
    find(t => t.tokenType === TokenNames[4])?.count
  ).toEqual(10);
  expect(p1.getState()?.G.boardTokens?.
    find(b => b.boardName === "B")?.lands.
    find(l => l.landNumber === 1)?.tokens.
    find(t => t.tokenType === TokenNames[5])?.count
  ).toEqual(10);
  expect(p1.getState()?.G.boardTokens?.
    find(b => b.boardName === "B")?.lands.
    find(l => l.landNumber === 1)?.tokens.
    find(t => t.tokenType === TokenNames[4])?.count
  ).toEqual(10);
}

it.skip('local multiplayer test', () => {
  const spec = {
    game: SpiritIsland,
    multiplayer: Local(),
  };

  const p0 = Client({ ...spec, playerID: '0' });
  const p1 = Client({ ...spec, playerID: '1' });

  p0.start();
  p1.start();
  doBoardSetup(p0);
  verifyBoardSetup(p0);
  verifyBoardSetup(p1);

  return changeAndCheckBoardTokens(p0, p1);
},20000);

window.fetch = fetch;

async function createMatchWithTwoPlayers(SERVER_URL: string): Promise<{ matchID: string, player0Credentials: string, player1Credentials: string }> {
  const lobbyClient = new LobbyClient({ server: SERVER_URL });
  const { matchID } = await lobbyClient.createMatch(SpiritIsland.name, { numPlayers: 2 });
  const joinedMatch0 = await lobbyClient.joinMatch(SpiritIsland.name, matchID, { playerID: String("0"), playerName: "player0" });
  const joinedMatch1 = await lobbyClient.joinMatch(SpiritIsland.name, matchID, { playerID: String("1"), playerName: "player1" });

  return {
    matchID: matchID,
    player0Credentials: joinedMatch0.playerCredentials,
    player1Credentials: joinedMatch1.playerCredentials,
  }
}

async function clientReady(...clients: _ClientImpl<SpiritIslandState>[]) {
  const promises = clients.map((p0) => {
    return new Promise<() => void>((res) => {
      const unsub = p0.subscribe((s) => {
        if (s && s.ctx && s.ctx.phase)
          res(unsub)
      })
    }).then((unsub) => {
      unsub()
    })
  });

  return Promise.all(promises)
}

it.skip('tests nested awaiting functions', () => {

  const y = new Promise<string>((resolve) => {
    setTimeout(() => resolve("hallo"), 1000);
  }).then(value => {
    expect(value).toEqual("hallo")
    const x = new Promise<number>((resolve) => {
      setTimeout(() => resolve(123), 1000);
    }).then(value => {
      expect(value).toEqual(123)
    });
    return x;
  });
  return y;
});

async function sleep(ms) {
  return new Promise<void>((res) =>
    setTimeout(() => {
      res();
    }, ms));
}

it.skip('tests client ready', () => {
  const SERVER_URL = "http://127.0.0.1:8000";
  return createMatchWithTwoPlayers(SERVER_URL).then((value) => {
    const spec = {
      game: SpiritIsland,
      multiplayer: SocketIO({ server: SERVER_URL }),
      matchID: value.matchID
    };
    const p0 = Client({ ...spec, playerID: '0', credentials: value.player0Credentials });
    const p1 = Client({ ...spec, playerID: '1', credentials: value.player1Credentials });

    p0.start();
    p1.start();

    return clientReady(p0, p1).then(() => {
      doBoardSetup(p0);
      return new Promise<void>((res) =>
        setTimeout(() => {
          verifyBoardSetup(p0);
          verifyBoardSetup(p1);
          res();
        }, timeBeforeCheck));
    });
  });
})

async function basicLoadTest(SERVER_URL: string) {
  const value = await createMatchWithTwoPlayers(SERVER_URL);
  const spec = {
    game: SpiritIsland,
    multiplayer: SocketIO({ server: SERVER_URL }),
    matchID: value.matchID
  };
  const p0 = Client({ ...spec, playerID: '0', credentials: value.player0Credentials });
  const p1 = Client({ ...spec, playerID: '1', credentials: value.player1Credentials });

  p0.start();
  p1.start();

  await clientReady(p0, p1);

  doBoardSetup(p0);
  await sleep(timeBeforeCheck);
  verifyBoardSetup(p0);
  verifyBoardSetup(p1);

  await changeAndCheckBoardTokens(p0, p1);
}

it.skip('remote multiplayer test', () => {
  //make an anonymous async function, to use the await snytax.
  return (async () => {
    const SERVER_URL = "http://127.0.0.1:8000";

    await basicLoadTest(SERVER_URL);
  })();
}, 15000);


it('remote heroku multiplayer test', () => {
  //make an anonymous async function, to use the await snytax.
  return (async () => {
    const SERVER_URL = "https://spiritislandweb.herokuapp.com";

    await basicLoadTest(SERVER_URL);
  })();
}, 15000);

