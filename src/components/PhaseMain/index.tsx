import * as React from "react";

import { BoardProps } from "boardgame.io/react";
import { SpiritIslandState } from "game/Game";
import style from "./style.module.scss";
import { Boards } from "./Boards";
import { ModalWindow } from "components/ModalWindow";
import { SpiritPanels } from "./SpiritBoards";
import { BottomRow } from "components/PhaseSetup/BottomRow";

export interface PhaseMainProps {
    G: SpiritIslandState
    moves: Record<string, (...args: any[]) => void>
}

export interface PhaseMainState {
    dialogTitle?: string
    dialogContent?: JSX.Element
}

export class PhaseMain extends React.Component<PhaseMainProps, PhaseMainState> {
    constructor(props: any) {
        super(props)
        this.state = {}
    }
    render() {
        const popupDialog = (
            <ModalWindow title={this.state.dialogTitle || ""} onClose={() => { this.setState({ dialogContent: undefined }) }}>
                {this.state.dialogContent}
            </ModalWindow>
        );
        return (
            <div className={style.PhaseMain__container}>
                <Boards
                    usedBoards={this.props.G.usedBoards}
                    boardTokens={this.props.G.boardTokens}
                    onIncreaseToken={this.props.moves.increaseToken}
                    onDecreaseToken={this.props.moves.decreaseToken}
                    showDialog={(data) => this.setState({ dialogContent: data?.content, dialogTitle: data?.title })}
                />
                <SpiritPanels
                    spirits={this.props.G.activeSpirits}
                    showDialog={(data) => this.setState({ dialogContent: data?.content, dialogTitle: data?.title })}
                    setSpiritEnergy={this.props.moves.setSpiritEnergy}
                    setSpiritDestroyedPresences={this.props.moves.setSpiritDestroyedPresences}
                    setSpiritElement={this.props.moves.setSpiritElement}
                    playCard={this.props.moves.playCard}
                    discardFromHand={this.props.moves.discardFromHand}
                    discardPlayed={this.props.moves.discardPlayed}
                    reclaimCards={this.props.moves.reclaimCards}
                    reclaimOne={this.props.moves.reclaimOne}
                />
                <BottomRow></BottomRow>
                {this.state.dialogContent && popupDialog}
            </div>
        );
    }
}
