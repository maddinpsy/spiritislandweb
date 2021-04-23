import * as React from "react";

import { BoardProps } from "boardgame.io/react";
import { SpiritIslandState } from "game/Game";
import { AvailableBoards } from "./AvailableBoards";
import { UsedBoards } from "./UsedBoards";
import { BottomRow, StartButton } from "./BottomRow";
import style from "./style.module.scss";
import { AvailableSpirits } from "./AlailableSpirits";
import { UsedSpirits } from "./UsedSpirits";

export interface PhaseSetupProps {
    G: SpiritIslandState
    moves: Record<string, (...args: any[]) => void>
}

export class PhaseSetup extends React.Component<PhaseSetupProps> {
    constructor(props: any) {
        super(props)
    }
    render() {
        return (
            <div className={style.GameBoard__container}>
                <AvailableBoards availBoards={this.props.G.availBoards} removeBoard={this.props.moves.removeBoard} />
                <UsedBoards
                    availBoards={this.props.G.availBoards}
                    usedBoards={this.props.G.usedBoards}
                    doPlaceBoard={this.props.moves.placeBoard}
                    doPlaceSpirit={this.props.moves.placeSpirit} />
                <UsedSpirits
                    setupSpirits={this.props.G.setupSpirits}
                    usedBoards={this.props.G.usedBoards}
                    doPlaceSpirit={this.props.moves.placeSpirit} />
                <AvailableSpirits availSpirits={this.props.G.setupSpirits} doRemoveSpirit={this.props.moves.removeSpirit} />
                <BottomRow>
                    <StartButton spirits={this.props.G.setupSpirits} usedBoards={this.props.G.usedBoards} onStart={this.props.moves.startGame} />
                </BottomRow>
            </div>
        );
    }
}
