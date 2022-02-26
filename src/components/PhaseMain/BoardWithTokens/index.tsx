import * as React from "react";

import { Board, BoardPlacement } from "game/GamePhaseSetup";

import style from "./style.module.scss";


import { BoardToken, TokenType } from "game/GamePhaseMain";
import { LandTokens } from "../Tokens/LandTokens";

export type SelectedTokenType = {
    board: string,
    land: number,
    token: TokenType
}

/** Defines the hardcoded sizes for the token containers. These are used to fit the tokens into the land polygons. */

interface BoardWithTokensProps {
    board: (Board & BoardPlacement)
    tokens: BoardToken
    presenceColors: string[]

    onIncreaseToken: (boardName: string, landNumber: number, tokenType: TokenType) => void;
    onDecreaseToken: (boardName: string, landNumber: number, tokenType: TokenType) => void;
    showDialog: (data?: { title: string, content: JSX.Element }) => void;
}

export const BoardWithTokens = (props:BoardWithTokensProps) => 
{
    let customStyle: React.CSSProperties = {};
    customStyle.left = props.board.position.x;
    customStyle.top = props.board.position.y;
    customStyle.transform = "rotate(" + props.board.rotation + "deg)";
    const [selectedToken,setSelectedToken] = React.useState<SelectedTokenType|undefined>({ board: "", land: 0, token: "City" });
    return (
        <div
            key={props.board.name}
            id={"board" + props.board.name}
            className={style.BoardWithTokens__usedBoard}
            style={customStyle}
        >
            <img
                src={props.board.largeBoardUrl}
                alt={props.board.name}
                className={style.BoardWithTokens__image}
                draggable="false" />
            <LandTokens boardTokens={props.tokens} boardPos={props.board}
                selectedToken={selectedToken}
                presenceColors={props.presenceColors}
                onSelectToken={setSelectedToken}
                onIncreaseToken={props.onIncreaseToken}
                onDecreaseToken={props.onDecreaseToken}
                showDialog={props.showDialog}
            />
        </div>
    )
}


