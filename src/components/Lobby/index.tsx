import React from "react";
import "./style.scss";
import { Trans } from "react-i18next";
import { LobbyPage, SmallLogo } from "components/LobbyPage";
import { ButtonLang } from "components/ButtonLang";
import { LobbyLink } from "./LobbyLink";

import { StoredPlayerData } from "components/App";
import { Button } from "components/Button";
import { useParams } from "react-router-dom";

interface LobbyStatusProps {
  gameStarted: boolean
  isCreator: boolean
  matchID?: string
  playerData?: StoredPlayerData
}

const LobbyStatus = (props: LobbyStatusProps) => {
  return (
    <div className="Lobby__status-message">
      {props.gameStarted ? (
        <Trans>Starting Game...</Trans>
      ) :
        props.isCreator ? (
          <Button onClick={() => { alert("TODO") }}>
            <Trans>Start Game</Trans>
          </Button>)
          : 
          (<Trans>Waiting for host to start the game...</Trans>)
      }
    </div>
  );
}

type GameLobbySetupBasicProps = {
  nickname: string
  requestChangeNickname: () => void
  playerData?: StoredPlayerData
  storePlayerData: (activeRoomPlayer: StoredPlayerData) => void
  startGame: () => void
}


export const GameLobbySetup = (props: GameLobbySetupBasicProps) => {

  //force nickname
  if (props.nickname.trim() === "") {
    props.requestChangeNickname();
  }
  //get matchID from url
  const { id } = useParams<string>();

  //get list of players
  let arPlayerData: { name: string, id: number }[] = [];

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
        {arPlayerData.filter(player => player.name).map((player) => (
          <div
            key={player.id}
            className="Lobby__player Lobby__player--active"
          >
            {player.name} {player.name === props.nickname && "(You)"}
          </div>
        ))
        }
      </div>
      <LobbyStatus
        gameStarted={false}
        isCreator={props.playerData?.playerID === 0 || false}
        matchID={id}
        playerData={props.playerData}
      />
    </LobbyPage >
  );
};
