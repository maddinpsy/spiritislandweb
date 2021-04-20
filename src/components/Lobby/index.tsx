import React from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import "./style.scss";
import { Trans } from "react-i18next";
import { LobbyPage, SmallLogo } from "components/LobbyPage";
import { ButtonLang } from "components/ButtonLang";
import { LobbyLink } from "./LobbyLink";

import { Server } from "boardgame.io";
import { SpiritIsland } from 'game/Game';
import { LobbyClient } from "boardgame.io/client";
import { StoredPlayerData } from "components/App";
import { Button } from "components/Button";

interface LobbyStatusProps {
  gameStarted: boolean
  isCreator: boolean
  matchID: string
  lobbyClient: LobbyClient
  playerData?: StoredPlayerData
}

interface GameLobbySetupState {
  startRequested: boolean
}

class LobbyStatus extends React.Component<LobbyStatusProps, GameLobbySetupState>
{
  onRequestStart() {
    if (!SpiritIsland.name) {
      throw new Error("IllegalState game name not set");
    }
    if (!this.props.playerData) {
      throw new Error("playerData is undefined, pleas join the game befor starting.");
    }
    this.setState({ startRequested: true });
    //call server api to cahnge metatdata
    let updatePlayerPromise = this.props.lobbyClient.updatePlayer(
      SpiritIsland.name,
      this.props.matchID,
      {
        playerID: String(this.props.playerData.playerID),
        credentials: this.props.playerData.credential,
        data: { gameStarted: true }
      }
    );
    //log error
    updatePlayerPromise.catch(
      (error) => {
        alert(
          "There was a problem, while starting the game. Please try again."
        );
        console.log("Error starting game:" + error);
        return;
      }
    );
  }
  render() {
    let button = undefined;
    if (this.props.isCreator) {
      button = (
        <Button onClick={() => { this.onRequestStart() }}>
          <Trans>Start Game</Trans>
        </Button>
      )
    }
    return (
      <div className="Lobby__status-message">
        {this.props.gameStarted ? (
          <Trans>Starting Game...</Trans>
        ) : button}
      </div>
    );
  }
}

interface GameLobbySetupBasicProps {
  nickname: string
  requestChangeNickname: () => void
  lobbyClient: LobbyClient
  playerData?: StoredPlayerData
  storePlayerData: (activeRoomPlayer: StoredPlayerData) => void
  startGame: () => void
}

type GameLobbySetupProps = GameLobbySetupBasicProps & RouteComponentProps<{ id: string }>


interface RoomMetaDataProps {
  roomMetadata?: Server.MatchData
}

function RoomMetaDataHOC(Component: React.ComponentType<GameLobbySetupProps & RoomMetaDataProps>) {
  return class extends React.Component<GameLobbySetupProps, RoomMetaDataProps>
  {
    matchID: string;
    timerID?: number;
    constructor(props: GameLobbySetupProps) {
      super(props);
      //force nickname
      this.matchID = props.match.params.id;
      this.state = { roomMetadata: undefined }
      this.loadRoomMetadata = this.loadRoomMetadata.bind(this);
    }

    componentDidMount() {
      this.timerID = window.setInterval(() => this.loadRoomMetadata(), 500);
    }
    componentWillUnmount() {
      if (this.timerID) window.clearInterval(this.timerID);
    }


    loadRoomMetadata(): void {
      if (!this.matchID) {
        throw new Error("IllegalState matchID not set");
      }
      if (!SpiritIsland.name) {
        throw new Error("IllegalState game name not set");
      }
      this.props.lobbyClient.getMatch(SpiritIsland.name, this.matchID).then(
        (matchData) => {
          this.setState({ roomMetadata: matchData })
        }
      ).catch((e) => {
        alert(
          "There was a problem. Make sure you have the right url and try again."
        );
        console.log("Error in loadRoomMetadata: " + e);
        this.props.history.push("/");
        return;
      });
    }

    render() {
      return <Component {...this.props} roomMetadata={this.state.roomMetadata} />;
    }
  }
}

class GameLobbySetupRaw extends React.Component<GameLobbySetupProps & RoomMetaDataProps>
{
  matchID: string;
  gameStarted: boolean = false;

  constructor(props: GameLobbySetupProps) {
    super(props);
    //force nickname
    if (props.nickname.trim() === "") {
      props.requestChangeNickname();
    }
    //get matchID from url
    this.matchID = props.match.params.id;
    this.findSeatAndJoin = this.findSeatAndJoin.bind(this);
    this.join = this.join.bind(this);
  }

  componentDidUpdate(prevProps: GameLobbySetupProps & RoomMetaDataProps) {
    // Typical usage (don't forget to compare props):
    if (this.props.roomMetadata && this.props.roomMetadata !== prevProps.roomMetadata) {
      this.findSeatAndJoin();

      let arPlayerData = Object.entries(this.props.roomMetadata.players).map(([key, value]) => value);
      this.gameStarted = this.props.roomMetadata.players[0].data?.gameStarted || false;
      const alreadyJoined = arPlayerData.find(p => {
        return p.id === this.props.playerData?.playerID && p.name === this.props.nickname;
      });
      if (this.gameStarted) {
        if (alreadyJoined) {
          this.props.startGame();
        } else {
          alert(
            "This game started without you."
          );
          this.props.history.push("/");
          return;
        }
      }
    }
  }

  join(playerID: number) {
    if (!SpiritIsland.name) {
      throw new Error("IllegalState game name not set");
    }
    //call server api to join
    let joinMatchPromise = this.props.lobbyClient.joinMatch(SpiritIsland.name, this.matchID, { playerID: String(playerID), playerName: this.props.nickname });
    //on success: store credentions
    joinMatchPromise.then(
      (joinedRoom) => {
        this.props.storePlayerData({
          playerID: playerID,
          credential: joinedRoom.playerCredentials,
          matchID: this.matchID
        });
      }
    );
    //log error
    joinMatchPromise.catch(
      (error) => {
        alert(
          "There was a problem. Make sure you have the right url and try again."
        );
        console.log("Error joining room:" + error);
        this.props.history.push("/");
        return;
      }
    );
  }


  findSeatAndJoin() {
    if (!this.matchID) {
      throw new Error("IllegalState matchID not set");
    }
    if (!SpiritIsland.name) {
      throw new Error("IllegalState game name not set");
    }
    if (!this.props.roomMetadata) {
      throw new Error("IllegalState roomMetadata not set");
    }

    let arPlayerData = Object.entries(this.props.roomMetadata.players).map(([key, value]) => value);

    const emptySeatID = arPlayerData.find(p => !p.name)?.id;
    const alreadyJoined = arPlayerData.find(p => {
      return p.id === this.props.playerData?.playerID && p.name === this.props.nickname;
    });

    if (!alreadyJoined && emptySeatID !== undefined && this.props.nickname && this.matchID) {
      this.join(emptySeatID);
    }
  }


  render() {
    let arPlayerData: Server.PlayerMetadata[] = [];
    if (this.props.roomMetadata) {
      arPlayerData = Object.entries(this.props.roomMetadata.players).map(([key, value]) => value);
    }

    return (
      <LobbyPage>
        <SmallLogo />
        <ButtonLang />

        <div className="Lobby__title">
          <Trans>Invite Players</Trans>
        </div>
        <div className="Lobby__subtitle">
          <Trans>Send a link to your friends to invite them to your game</Trans>
        </div>
        <LobbyLink />

        <div className="Lobby__players">
          {this.props.roomMetadata ? (
            arPlayerData.filter(player => player.name).map((player) => (
              <div
                key={player.id}
                className="Lobby__player Lobby__player--active"
              >
                {player.name} {player.name === this.props.nickname && "(You)"}
              </div>
            )
            )
          ) : (
              <Trans>Loading...</Trans>
            )}
        </div>
        <LobbyStatus
          gameStarted={this.gameStarted}
          isCreator={this.props.playerData?.playerID === 0 || false}
          matchID={this.matchID}
          playerData={this.props.playerData}
          lobbyClient={this.props.lobbyClient}
        />
      </LobbyPage >
    );
  }
};
export const GameLobbySetup = withRouter(RoomMetaDataHOC(GameLobbySetupRaw))
