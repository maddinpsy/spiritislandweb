import * as React from "react";

import { BoardProps } from "boardgame.io/react";
import { SpiritIslandState } from "game/Game";
import style from "./style.module.scss";
import { Boards } from "./Boards";

export interface PhaseMainProps {
    G: SpiritIslandState
    moves: Record<string, (...args: any[]) => void>
}

export class PhaseMain extends React.Component<PhaseMainProps> {
    constructor(props: any) {
        super(props)
    }
    render() {
        return (
            <div className={style.PhaseMain__container}>
               <Boards usedBoards={this.props.G.usedBoards} boardTokens = {this.props.G.boardTokens}/>
            </div>
        );
    }
}
