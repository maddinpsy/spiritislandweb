import * as React from "react";
import "./style.scss";
import { Trans, withTranslation, WithTranslation } from "react-i18next";
import { Button } from "components/Button";
import { LobbyPage, SmallLogo } from "components/LobbyPage";
import { ButtonLang } from "components/ButtonLang";
import { Input } from "components/Input";

interface SetupNicknameProps {
  nickname: string,
  onSubmit: (newNickname: string) => void
  onBack: () => void
}

interface SetupNicknameState {
  nickname: string
}

class SetupNicknameRaw extends React.Component<WithTranslation & SetupNicknameProps, SetupNicknameState>
{
  constructor(props: any) {
    super(props);
    this.state = { nickname: this.props.nickname || ""};
    this.handleChanged = this.handleChanged.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChanged(nickname: string) {
    this.setState({ nickname: nickname });
  }

  handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    this.props.onSubmit && this.props.onSubmit(this.state.nickname);
  };
  render() {
    return (
      <LobbyPage>
        <ButtonLang />
        <SmallLogo />

        <h3 className="SetupNickname__title">
          <Trans>Set your nickname</Trans>
        </h3>

        <form onSubmit={this.handleSubmit} className="SetupNickname__form">
          <Input
            placeholder={this.props.t("Type in something cool...")}
            className="SetupNickname__input"
            onChange={(e) => this.handleChanged(e.target.value)}
            value={this.state.nickname}
          />

          <Button type="submit">
            <Trans>Save</Trans>
          </Button>
          <Button onClick={() => { this.props.onBack() }}> 
          <Trans>Back</Trans>
          </Button>
        </form>
      </LobbyPage>
    );
  }

};

export const SetupNickname = withTranslation()(SetupNicknameRaw)