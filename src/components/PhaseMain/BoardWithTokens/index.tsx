import * as React from "react";

import { Board, BoardPlacement, Point } from "game/GamePhaseSetup";

import style from "./style.module.scss";


import { BoardToken, TokenType } from "game/GamePhaseMain";
import { LandTokens } from "../Tokens/LandTokens";


/** Defines the hardcoded sizes for the token containers. These are used to fit the tokens into the land polygons. */

interface BoardWithTokensProps {
    board: (Board & BoardPlacement)
    tokens: BoardToken
    presenceColors: string[]

    onIncreaseToken: (boardName: string, landNumber: number, tokenType: TokenType) => void;
    onDecreaseToken: (boardName: string, landNumber: number, tokenType: TokenType) => void;
    showDialog: (data?: { title: string, content: JSX.Element }) => void;
}

export class BoardWithTokens extends React.Component<BoardWithTokensProps>
{
    render() {
        let customStyle: React.CSSProperties = {};
        customStyle.left = this.props.board.position.x;
        customStyle.top = this.props.board.position.y;
        customStyle.transform = "rotate(" + this.props.board.rotation + "deg)";

        return (
            <div
                key={this.props.board.name}
                id={"board" + this.props.board.name}
                className={style.BoardWithTokens__usedBoard}
                style={customStyle}
            >
                <img
                    src={this.props.board.largeBoardUrl}
                    alt={this.props.board.name}
                    className={style.BoardWithTokens__image}
                    draggable="false" />
                <LandTokens boardTokens={this.props.tokens} boardPos={this.props.board}
                    presenceColors={this.props.presenceColors}
                    onIncreaseToken={this.props.onIncreaseToken}
                    onDecreaseToken={this.props.onDecreaseToken}
                    showDialog={this.props.showDialog}
                />
            </div>
        )
    }
}


