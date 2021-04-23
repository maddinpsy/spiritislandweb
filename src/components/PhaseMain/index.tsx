import * as React from "react";

import { BoardProps } from "boardgame.io/react";
import { SpiritIslandState } from "game/Game";
import style from "./style.module.scss";

export interface PhaseMainProps {
    G: SpiritIslandState
    moves: Record<string, (...args: any[]) => void>
}

export class PhaseMain extends React.Component<PhaseMainProps> {
    constructor(props: any) {
        super(props)
    }
    componentDidMount() {
        //avoid startup flicker, for one second
        window.setTimeout(() => this.setState({ loading: false }), 1000);
    }
    render() {
        return (
            <div className={style.GameBoard__container}>
               <div>Main Area</div>
            </div>
        );
    }
}
