import React from 'react';
import {
  BrowserRouter,
  Route,
  Routes
} from "react-router-dom";

import { LobbyClient } from 'boardgame.io/client';
import { SocketIO } from "boardgame.io/multiplayer";
import { Client } from "boardgame.io/react";

import { isProduction, SERVER_URL } from "config";
import { SpiritIsland } from 'game/Game';
import { PhaseSetup } from 'components/PhaseSetup';

import { CreateGame } from 'components/CreateGame';
import { NicknameProps } from 'components/NicknameOverlay';
import { GameLobbySetup } from "components/Lobby";
import { Welcome } from "components/Welcome";
import "./App.css";
import { Loading } from 'components/Loading';
import { SpiritIslandBoard } from 'components/SpiritIslandBoard';


export interface StoredPlayerData {
  playerID: number;
  credential: string;
  matchID: string;
}
interface AppState {
  matchID?: string
  isRunning: boolean
  playerData?: StoredPlayerData
}
const CREDENTIALS_STORAGE_KEY = "SPIRITISLANDWEB_CLIENT_CREDENTIALS"


export class App extends React.Component<NicknameProps, AppState>
{
  lobbyClient: LobbyClient;
  constructor(props: NicknameProps) {
    super(props);
    this.lobbyClient = new LobbyClient({ server: SERVER_URL });

    //restore saved credentials
    const encodedCredentials = localStorage.getItem(CREDENTIALS_STORAGE_KEY);
    let storedCredentials: StoredPlayerData | undefined;
    if (encodedCredentials) {
      storedCredentials = JSON.parse(encodedCredentials)
    }

    this.state = { playerData: storedCredentials, isRunning: false }

    this.newGame = this.newGame.bind(this);
    this.storePlayerData = this.storePlayerData.bind(this);
    this.startGame = this.startGame.bind(this);
  }

  newGame() {
    if (!SpiritIsland.name) {
      throw new Error("IllegalState game name not set");
    }
    this.lobbyClient.createMatch(SpiritIsland.name, { numPlayers: SpiritIsland.maxPlayers||4 })
      .then((x) => { this.setState({ matchID: x.matchID }) })
      .catch((reason) => {
        alert("There was a problem creating the match. Please try again.");
        console.log("Error creating new Game:" + reason)
        return;
      });
  }

  storePlayerData(activeRoomPlayer: StoredPlayerData) {
    localStorage.setItem(CREDENTIALS_STORAGE_KEY, JSON.stringify(activeRoomPlayer));

    this.setState({
      playerData: activeRoomPlayer
    });
  }

  startGame() {
    this.setState({
      isRunning: true,
    })
  }


  render() {
    let matchID = this.state.matchID;

    let roomPage: JSX.Element;
    if (this.state.isRunning) {
      const GameClient = Client({
        game: SpiritIsland,
        board: SpiritIslandBoard,
        multiplayer: SocketIO({ server: SERVER_URL }),
        loading:Loading
      });

      roomPage = <GameClient
        matchID={this.state.playerData?.matchID}
        playerID={String(this.state.playerData?.playerID)}
        credentials={this.state.playerData?.credential}
        debug={!isProduction}
      />
    } else {
      roomPage = (<GameLobbySetup
        {...this.props}
        lobbyClient={this.lobbyClient}
        storePlayerData={this.storePlayerData}
        playerData={this.state.playerData}
        startGame={this.startGame}
      />);
    }
    return (
      <div className="App" >
        <BrowserRouter>
          <Routes>
            <Route path="/" element={Welcome}/>

            <Route path="/create">
              <CreateGame {...this.props} onCreateGameRoom={this.newGame} roomID={matchID} />
            </Route>

            <Route path="/rooms/:id">
              {roomPage}
            </Route>

            <Route>
              <Redirect to="/" />
            </Route>
          </Routes>
        </BrowserRouter>
      </div>
    );
  }
}
