import { LobbyPage } from "components/LobbyPage";
import React, { HTMLAttributes } from "react";
import style from "./style.module.scss";

export const Loading: React.FC<HTMLAttributes<HTMLDivElement>> = () => {
  return (
    <LobbyPage>
      <div className={style.loading}>
        Loading...
        </div>
    </LobbyPage>
  );
};

