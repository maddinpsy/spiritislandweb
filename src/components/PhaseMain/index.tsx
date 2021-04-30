import * as React from "react";

import { SpiritIslandState } from "game/Game";
import style from "./style.module.scss";
import { Boards } from "./Boards";
import { ModalWindow } from "components/ModalWindow";
import { SpiritPanels } from "./SpiritBoards";
import { BottomRow } from "components/PhaseSetup/BottomRow";

import { PowerCardPile } from "./PowerCardPile";
import { Types } from "spirit-island-card-katalog/types";
import { FilteredMetadata } from "boardgame.io";

import invaderCards from "assets/Invader Deck.jpg"
import { InvaderCard } from "./InvaderCard";

export interface PhaseMainProps {
    G: SpiritIslandState
    moves: Record<string, (...args: any[]) => void>
    playerNames: FilteredMetadata
}

export interface PhaseMainState {
    dialogTitle?: string
    dialogContent?: JSX.Element
    currentSpiritsIdx: number
}

export class PhaseMain extends React.Component<PhaseMainProps, PhaseMainState> {
    constructor(props: any) {
        super(props)
        this.state = { currentSpiritsIdx: 0 }
    }
    render() {
        const popupDialog = (
            <ModalWindow title={this.state.dialogTitle || ""} onClose={() => { this.setState({ dialogContent: undefined }) }}>
                {this.state.dialogContent}
            </ModalWindow>
        );
        const curSpiritName = this.props.G.activeSpirits[this.state.currentSpiritsIdx].name;
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
                    currentSpiritsIdx={this.state.currentSpiritsIdx}
                    setCurrentSpiritIdx={(idx) => this.setState({ currentSpiritsIdx: idx })}
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
                    <div  className={style.PhaseMain__image}>
                        <InvaderCard
                            card={this.props.G.invaderDeck.available[0]}
                            flipped={false}
                            onClick={() => this.props.moves.invadersExplore(0)}
                        />
                        <div>Deck</div>
                    </div>
                    <div  className={style.PhaseMain__image}>
                        <InvaderCard
                            card={this.props.G.invaderDeck.explore[0]}
                            flipped={true}
                            onClick={() => this.props.moves.invadersBuild(0)}
                        />
                        <div>Explore</div>
                    </div>
                    <div  className={style.PhaseMain__image}>
                        <InvaderCard
                            card={this.props.G.invaderDeck.build[0]}
                            flipped={true}
                            onClick={() => this.props.moves.invadersRage(0)}
                        />
                        <div>Build</div>
                    </div>
                    <div  className={style.PhaseMain__image}>
                        <InvaderCard
                            card={this.props.G.invaderDeck.rage[0]}
                            flipped={true}
                            onClick={() => this.props.moves.invadersDiscard(0)}
                        />
                        <div>Rage</div>
                    </div>
                    <PowerCardPile
                        deckType={Types.PowerDeckType.Major}
                        availableCards={this.props.G.majorPowercards.available}
                        discardedCards={this.props.G.majorPowercards.discarded}
                        flippedCards={this.props.G.majorPowercards.flipSets}
                        playerNames={this.props.playerNames}
                        //moves
                        flipOne={() =>
                            this.props.moves.flipOne(Types.PowerDeckType.Major)}
                        flipFour={() =>
                            this.props.moves.flipFour(Types.PowerDeckType.Major)}
                        takeFlipped={(flipSetIdx, cardIdx) =>
                            this.props.moves.takeFlipped(Types.PowerDeckType.Major, flipSetIdx, cardIdx, curSpiritName)}
                        discardFlipSet={(flipSetIdx) =>
                            this.props.moves.discardFlipSet(Types.PowerDeckType.Major, flipSetIdx)}
                        takeDiscarded={(discardedCardIdx) =>
                            this.props.moves.takeDiscarded(Types.PowerDeckType.Major, discardedCardIdx, curSpiritName)}
                    />
                    <PowerCardPile
                        deckType={Types.PowerDeckType.Minor}
                        availableCards={this.props.G.minorPowercards.available}
                        discardedCards={this.props.G.minorPowercards.discarded}
                        flippedCards={this.props.G.minorPowercards.flipSets}
                        playerNames={this.props.playerNames}
                        //moves
                        flipOne={() =>
                            this.props.moves.flipOne(Types.PowerDeckType.Minor)}
                        flipFour={() =>
                            this.props.moves.flipFour(Types.PowerDeckType.Minor)}
                        takeFlipped={(flipSetIdx, cardIdx) =>
                            this.props.moves.takeFlipped(Types.PowerDeckType.Minor, flipSetIdx, cardIdx, curSpiritName)}
                        discardFlipSet={(flipSetIdx) =>
                            this.props.moves.discardFlipSet(Types.PowerDeckType.Minor, flipSetIdx)}
                        takeDiscarded={(discardedCardIdx) =>
                            this.props.moves.takeDiscarded(Types.PowerDeckType.Minor, discardedCardIdx, curSpiritName)}
                    />
                </BottomRow>
                {this.state.dialogContent && popupDialog}
            </div>
        );
    }
}
