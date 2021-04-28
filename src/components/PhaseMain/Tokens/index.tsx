import * as React from "react";


import style from "./style.module.scss";

import { Board, BoardPlacement } from "game/GamePhaseSetup";
import { BoardToken, TokenType } from "game/GamePhaseMain";
import { LandTokens } from "./LandTokens";


export interface TokensProps {
    boardTokens?: BoardToken[]
    usedBoards: (Board & BoardPlacement)[]
    presenceColors:string[]

    onIncreaseToken: (boardName: string, landNumber: number, tokenType: TokenType) => void;
    onDecreaseToken: (boardName: string, landNumber: number, tokenType: TokenType) => void;
    showDialog: (data?: { title: string, content: JSX.Element }) => void;
}

interface TokensState {
    selectedToken?: {
        board: string,
        land: number,
        token: TokenType
    }
}

export class Tokens extends React.Component<TokensProps, TokensState>
{
    constructor(props: any) {
        super(props);
        this.state = {}
    }

    render() {
        let boardTokens = undefined;
        if (this.props.boardTokens)
            boardTokens = this.props.boardTokens
                .map(bt => {
                    const boardPos = this.props.usedBoards.find(b => b.name === bt.boardName);
                    if (!boardPos) {
                        console.log("Could not find board: " + bt.boardName);
                        return (<div>ERROR</div>);
                    }
                    return <div id={"BoardTokens_" + bt.boardName} key={bt.boardName}>
                        <LandTokens boardTokens={bt} boardPos={boardPos}
                            selectedToken={this.state.selectedToken}
                            presenceColors={this.props.presenceColors}
                            onSelectToken={(s) => { this.setState({ selectedToken: s }) }}
                            onIncreaseToken={this.props.onIncreaseToken}
                            onDecreaseToken={this.props.onDecreaseToken}
                            showDialog={this.props.showDialog}
                        />
                    </div>
                });

        return (
            <div className={style.Tokens__container}>
                {boardTokens}
            </div>
        );
    }

}
