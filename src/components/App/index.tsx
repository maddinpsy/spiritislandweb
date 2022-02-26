import React from 'react';
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes
} from "react-router-dom";


import { NicknameProps } from 'components/NicknameOverlay';
import { Welcome } from "components/Welcome";
import "./App.css";
import { SpiritIslandBoard } from 'components/SpiritIslandBoard';
import { CreateGame } from 'components/CreateGame';


export interface StoredPlayerData {
  playerID: number;
  matchID: string;
}
interface AppState {
  playerData?: StoredPlayerData
}
const CREDENTIALS_STORAGE_KEY = "SPIRITISLANDWEB_CLIENT_CREDENTIALS"


export class App extends React.Component<NicknameProps, AppState>
{
  constructor(props: NicknameProps) {
    super(props);

    //restore saved credentials
    const encodedCredentials = localStorage.getItem(CREDENTIALS_STORAGE_KEY);
    let storedCredentials: StoredPlayerData | undefined;
    if (encodedCredentials) {
      storedCredentials = JSON.parse(encodedCredentials)
    }

    this.state = { playerData: storedCredentials }

    this.storePlayerData = this.storePlayerData.bind(this);
  }

  storePlayerData(activeRoomPlayer: StoredPlayerData) {
    localStorage.setItem(CREDENTIALS_STORAGE_KEY, JSON.stringify(activeRoomPlayer));

    this.setState({
      playerData: activeRoomPlayer
    });
  }


  render() {
    return (
      <div className="App" >
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Welcome/>} />
{/*
            <Route path="/create">
              <CreateGame {...this.props} />
            </Route>

            <Route path="/join/:id">
              <GameLobbySetup
                {...this.props}
                lobbyClient={this.lobbyClient}
                storePlayerData={this.storePlayerData}
                playerData={this.state.playerData}
                startGame={this.startGame}
              />
            </Route>
*/}
            <Route path="/rooms/:id" element={<SpiritIslandBoard />} />

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </BrowserRouter>
      </div>
    );
  }
}
