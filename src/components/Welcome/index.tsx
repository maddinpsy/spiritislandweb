import React from "react";
import { LobbyPage } from "components/LobbyPage";
import { Logo } from "components/Logo";
import { ButtonLink } from "components/Button";
import { Trans } from "react-i18next";
import style from "./style.module.scss";

export const Welcome = () => {
  return (
    <LobbyPage>
      <Logo className={style.logo} size="large" />
      <p className={style.text}>
        <Trans>
        Spirit Island is a cooperative, settler-destruction strategy game for 1 to 4 players designed by R. Eric Reuss and set in an alternate-history world around A.D. 1700. 
        </Trans>
      </p>
      <ButtonLink to="/rooms/as" theme="orange">
        <Trans>Go!</Trans>
      </ButtonLink>
    </LobbyPage>
  );
};
