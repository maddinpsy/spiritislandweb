import React from "react";
import { Redirect } from "react-router-dom";
import "./style.scss";
import { Trans } from "react-i18next";
import { ButtonLang } from "components/ButtonLang";
import { Button, ButtonProps } from "components/Button";
import { LobbyPage, SmallLogo } from "components/LobbyPage";

interface CreateGameProps {
  onCreateGameRoom: () => void
  requestChangeNickname: () => void
  nickname: string
  roomID?: string
}

export class CreateGame extends React.Component<CreateGameProps> {

  constructor(props: CreateGameProps) {
    super(props);
    if (props.nickname.trim() === "") {
      props.requestChangeNickname();
    } else {
      props.onCreateGameRoom();
    }
  }

  render() {

    let roomID = this.props.roomID;
    if (roomID) return <Redirect to={`/rooms/${roomID}`} />;

    return (
      <LobbyPage>
        <SmallLogo />
        <ButtonLang />
        <h3 className="CreateGame__title">
          <Trans>Creating new game...</Trans>
        </h3>
      </LobbyPage>
    );
  }

}
