import * as React from "react";

import { SpiritIslandState } from "game/Game";
import style from "./style.module.scss";
import { Boards } from "./Boards";
import { ModalWindow } from "components/ModalWindow";
import { SpiritPanels } from "./SpiritBoards";
import { BottomRow } from "components/PhaseSetup/BottomRow";

import backMajor from "assets/Back Major.jpg"
import backMinor from "assets/Back Minor.jpg"
import { Button } from "components/Button";
import { PowerCardPile } from "./PowerCardPile";
import { Types } from "spirit-island-card-katalog/types";

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
                    presenceColors={this.props.G.activeSpirits.map(s => s.presenceAppearance.presenceBackground)}
                />
                <SpiritPanels
                    spirits={this.props.G.activeSpirits}
                    showDialog={(data) => this.setState({ dialogContent: data?.content, dialogTitle: data?.title })}
                    //moves
                    setSpiritEnergy={this.props.moves.setSpiritEnergy}
                    setSpiritDestroyedPresences={this.props.moves.setSpiritDestroyedPresences}
                    setSpiritElement={this.props.moves.setSpiritElement}
                    toggleSpiritPresence={this.props.moves.toggleSpiritPanelPresence}
                    playCard={this.props.moves.playCard}
                    discardFromHand={this.props.moves.discardFromHand}
                    discardPlayed={this.props.moves.discardPlayed}
                    undoPlayCard={this.props.moves.undoPlayCard}
                    reclaimCards={this.props.moves.reclaimCards}
                    reclaimOne={this.props.moves.reclaimOne}
                />
                <BottomRow>
                    <PowerCardPile 
                    deckType={Types.PowerDeckType.Major}
                    availableCards={this.props.G.majorPowercards.available} 
                    discardedCards={this.props.G.majorPowercards.discarded} 
                    flippedCards={this.props.G.majorPowercards.flipSets} 
                    />
                    <PowerCardPile 
                    deckType={Types.PowerDeckType.Minor}
                    availableCards={this.props.G.minorPowercards.available} 
                    discardedCards={this.props.G.minorPowercards.discarded} 
                    flippedCards={this.props.G.minorPowercards.flipSets} 
                    />
                </BottomRow>
                {this.state.dialogContent && popupDialog}
            </div>
        );
    }
}
