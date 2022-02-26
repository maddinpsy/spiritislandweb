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

import { InvaderCard } from "./InvaderCard";
import { InvaderCardData } from "game/InvaderCards";
import { FearCardPile } from "./FearCardPile";
import { IncreaseDecreaseButton } from "./IncreaseDecreaseButton";

import fearIconImage from "assets/fear.png"
import blightIconImage from "assets/tokens/Blighticon.png"
import { MainActions, TokenType } from "game/GamePhaseMain";

interface InvaderDeckAndSlotsProps {
    invaderDeck: {
        available: InvaderCardData[]
        explore: InvaderCardData[]
        build: InvaderCardData[]
        rage: InvaderCardData[]
        discard: InvaderCardData[]
    },
    //moves
    invadersExplore: (idx: number) => void
    invadersBuild: (idx: number) => void
    invadersRage: (idx: number) => void
    invadersDiscard: (idx: number) => void
}
function InvaderDeckAndSlots(props: InvaderDeckAndSlotsProps) {
    return (<div className={style.PhaseMain__invaderSlotList}>
        <div className={style.PhaseMain__invaderSlot}>
            <InvaderCard
                card={props.invaderDeck.available[0]}
                flipped={false}
                onClick={() => props.invadersExplore(0)}
            />
            <div>Deck({props.invaderDeck.available.length})</div>
        </div>
        <div className={style.PhaseMain__invaderSlot}>
            <InvaderCard
                card={props.invaderDeck.explore[0]}
                flipped={true}
                onClick={() => props.invadersBuild(0)}
            />
            <div>Explore({props.invaderDeck.explore.length})</div>
        </div>
        <div className={style.PhaseMain__invaderSlot}>
            <InvaderCard
                card={props.invaderDeck.build[0]}
                flipped={true}
                onClick={() => props.invadersRage(0)}
            />
            <div>Build({props.invaderDeck.build.length})</div>
        </div>
        <div className={style.PhaseMain__invaderSlot}>
            <InvaderCard
                card={props.invaderDeck.rage[0]}
                flipped={true}
                onClick={() => props.invadersDiscard(0)}
            />
            <div>Rage({props.invaderDeck.rage.length})</div>
        </div>
    </div>)
}
interface FearIconProps {
    count: number
    onSetFearCount: (count: number) => void
    maxFear: number
    fearCardEarn: () => void
}
function FearIcon(props: FearIconProps) {
    return <div className={style.PhaseMain__FearIconContainer} >
        <div>
            <img src={fearIconImage} alt="Fear" className={style.PhaseMain__FearIconImage} />
            <div>{props.count}</div>
        </div>
        <IncreaseDecreaseButton
            onIncrease={() => {
                if (props.count + 1 >= props.maxFear) {
                    props.fearCardEarn();
                    props.onSetFearCount(0);
                } else {
                    props.onSetFearCount(props.count + 1)
                }
            }}
            onDecrease={() => { props.onSetFearCount(props.count - 1) }}
        />
    </div>
}


function BlightIcon(props: { count: number, onSetBlightCount: (count: number) => void }) {
    return <div className={style.PhaseMain__FearIconContainer} >
        <div>
            <img src={blightIconImage} alt="Blight" className={style.PhaseMain__FearIconImage} />
            <div>{props.count}</div>
        </div>
        <IncreaseDecreaseButton
            onIncrease={() => { props.onSetBlightCount(props.count + 1) }}
            onDecrease={() => { props.onSetBlightCount(props.count - 1) }}
        />
    </div>
}


export interface PhaseMainProps {
    G: SpiritIslandState
    dispatch: (action: MainActions) => void
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
        this.dispatch_increaseToken = this.dispatch_increaseToken.bind(this);
        this.dispatch_decreaseToken = this.dispatch_decreaseToken.bind(this);
        this.dispatch_setSpiritEnergy = this.dispatch_setSpiritEnergy.bind(this);
        this.dispatch_setSpiritDestroyedPresences = this.dispatch_setSpiritDestroyedPresences.bind(this);
        this.dispatch_setSpiritElement = this.dispatch_setSpiritElement.bind(this);
        this.dispatch_toggleSpiritPanelPresence = this.dispatch_toggleSpiritPanelPresence.bind(this);
        this.dispatch_playCard = this.dispatch_playCard.bind(this);
        this.dispatch_discardFromHand = this.dispatch_discardFromHand.bind(this);
        this.dispatch_forgetFromHand = this.dispatch_forgetFromHand.bind(this);
        this.dispatch_undoPlayCard = this.dispatch_undoPlayCard.bind(this);
        this.dispatch_discardPlayed = this.dispatch_discardPlayed.bind(this);
        this.dispatch_discardAllPlayed = this.dispatch_discardAllPlayed.bind(this);
        this.dispatch_forgetFromPlayed = this.dispatch_forgetFromPlayed.bind(this);
        this.dispatch_reclaimCards = this.dispatch_reclaimCards.bind(this);
        this.dispatch_reclaimOne = this.dispatch_reclaimOne.bind(this);
        this.dispatch_forgetFromDiscarded = this.dispatch_forgetFromDiscarded.bind(this);
        this.dispatch_flipOne = this.dispatch_flipOne.bind(this);
        this.dispatch_flipFour = this.dispatch_flipFour.bind(this);
        this.dispatch_takeFlipped = this.dispatch_takeFlipped.bind(this);
        this.dispatch_discardFlipSet = this.dispatch_discardFlipSet.bind(this);
        this.dispatch_takeDiscarded = this.dispatch_takeDiscarded.bind(this);
        this.dispatch_invadersExplore = this.dispatch_invadersExplore.bind(this);
        this.dispatch_invadersBuild = this.dispatch_invadersBuild.bind(this);
        this.dispatch_invadersRage = this.dispatch_invadersRage.bind(this);
        this.dispatch_invadersDiscard = this.dispatch_invadersDiscard.bind(this);
        this.dispatch_fearCardFlip = this.dispatch_fearCardFlip.bind(this);
        this.dispatch_fearCardEarn = this.dispatch_fearCardEarn.bind(this);
        this.dispatch_fearCardDiscard = this.dispatch_fearCardDiscard.bind(this);
        this.dispatch_setGeneratedFear = this.dispatch_setGeneratedFear.bind(this);
        this.dispatch_setBlightOnCard = this.dispatch_setBlightOnCard.bind(this);
    }

    dispatch_increaseToken(boardName: string, landNumber: number, tokenType: TokenType) {
        this.props.dispatch({ type: "increaseToken", boardName, landNumber, tokenType });
    }
    dispatch_decreaseToken(boardName: string, landNumber: number, tokenType: TokenType) {
        this.props.dispatch({ type: "decreaseToken", boardName, landNumber, tokenType });
    }
    dispatch_setSpiritEnergy(spiritName: string, energy: number) {
        this.props.dispatch({ type: "setSpiritEnergy", spiritName, energy });
    }
    dispatch_setSpiritDestroyedPresences(spiritName: string, destroyedPresences: number) {
        this.props.dispatch({ type: "setSpiritDestroyedPresences", spiritName, destroyedPresences });
    }
    dispatch_setSpiritElement(spiritName: string, elementType: Types.Elements, count: number) {
        this.props.dispatch({ type: "setSpiritElement", spiritName, elementType, count });
    }
    dispatch_toggleSpiritPanelPresence(spiritName: string, presenceIndex: number) {
        this.props.dispatch({ type: "toggleSpiritPanelPresence", spiritName, presenceIndex });
    }
    dispatch_playCard(spiritName: string, handCardIdx: number) {
        this.props.dispatch({ type: "playCard", spiritName, handCardIdx });
    }
    dispatch_discardFromHand(spiritName: string, handCardIdx: number) {
        this.props.dispatch({ type: "discardFromHand", spiritName, handCardIdx });
    }
    dispatch_forgetFromHand(spiritName: string, handCardIdx: number) {
        this.props.dispatch({ type: "forgetFromHand", spiritName, handCardIdx });
    }
    dispatch_undoPlayCard(spiritName: string, playCardIdx: number) {
        this.props.dispatch({ type: "undoPlayCard", spiritName, playCardIdx });
    }
    dispatch_discardPlayed(spiritName: string, playCardIdx: number) {
        this.props.dispatch({ type: "discardPlayed", spiritName, playCardIdx });
    }
    dispatch_discardAllPlayed(spiritName: string) {
        this.props.dispatch({ type: "discardAllPlayed", spiritName });
    }
    dispatch_forgetFromPlayed(spiritName: string, playCardIdx: number) {
        this.props.dispatch({ type: "forgetFromPlayed", spiritName, playCardIdx });
    }
    dispatch_reclaimCards(spiritName: string) {
        this.props.dispatch({ type: "reclaimCards", spiritName });
    }
    dispatch_reclaimOne(spiritName: string, discardedCardIdx: number) {
        this.props.dispatch({ type: "reclaimOne", spiritName, discardedCardIdx });
    }
    dispatch_forgetFromDiscarded(spiritName: string, discardedCardIdx: number) {
        this.props.dispatch({ type: "forgetFromDiscarded", spiritName, discardedCardIdx });
    }
    dispatch_flipOne(deckType: Types.PowerDeckType) {
        this.props.dispatch({ type: "flipOne", deckType });
    }
    dispatch_flipFour(deckType: Types.PowerDeckType) {
        this.props.dispatch({ type: "flipFour", deckType });
    }
    dispatch_takeFlipped(deckType: Types.PowerDeckType, flipSetIdx: number, cardIdx: number, spiritName: string) {
        this.props.dispatch({ type: "takeFlipped", deckType, flipSetIdx, cardIdx, spiritName });
    }
    dispatch_discardFlipSet(deckType: Types.PowerDeckType, flipSetIdx: number) {
        this.props.dispatch({ type: "discardFlipSet", deckType, flipSetIdx });
    }
    dispatch_takeDiscarded(deckType: Types.PowerDeckType, discardedCardIdx: number, spiritName: string) {
        this.props.dispatch({ type: "takeDiscarded", deckType, discardedCardIdx, spiritName });
    }
    dispatch_invadersExplore(idx: number) {
        this.props.dispatch({ type: "invadersExplore", idx });
    }
    dispatch_invadersBuild(idx: number) {
        this.props.dispatch({ type: "invadersBuild", idx });
    }
    dispatch_invadersRage(idx: number) {
        this.props.dispatch({ type: "invadersRage", idx });
    }
    dispatch_invadersDiscard(idx: number) {
        this.props.dispatch({ type: "invadersDiscard", idx });
    }
    dispatch_fearCardFlip(pileNumber: number, idx: number) {
        this.props.dispatch({ type: "fearCardFlip", pileNumber, idx });
    }
    dispatch_fearCardEarn() {
        this.props.dispatch({ type: "fearCardEarn" });
    }
    dispatch_fearCardDiscard() {
        try{
            this.props.dispatch({ type: "fearCardDiscard" });
        }catch(e){
            alert(e);
        }
    }
    dispatch_setGeneratedFear(count: number) {
        this.props.dispatch({ type: "setGeneratedFear", count });
    }
    dispatch_setBlightOnCard(count: number) {
        this.props.dispatch({ type: "setBlightOnCard", count });
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
                    onIncreaseToken={this.dispatch_increaseToken}
                    onDecreaseToken={this.dispatch_decreaseToken}
                    showDialog={(data) => this.setState({ dialogContent: data?.content, dialogTitle: data?.title })}
                    presenceColors={this.props.G.activeSpirits.map(s => s.presenceAppearance.presenceBackground)}
                />
                <SpiritPanels
                    spirits={this.props.G.activeSpirits}
                    showDialog={(data) => this.setState({ dialogContent: data?.content, dialogTitle: data?.title })}
                    currentSpiritsIdx={this.state.currentSpiritsIdx}
                    setCurrentSpiritIdx={(idx) => this.setState({ currentSpiritsIdx: idx })}
                    //moves
                    setSpiritEnergy={this.dispatch_setSpiritEnergy}
                    setSpiritDestroyedPresences={this.dispatch_setSpiritDestroyedPresences}
                    setSpiritElement={this.dispatch_setSpiritElement}
                    toggleSpiritPresence={this.dispatch_toggleSpiritPanelPresence}
                    playCard={this.dispatch_playCard}
                    discardFromHand={this.dispatch_discardFromHand}
                    discardPlayed={this.dispatch_discardPlayed}
                    undoPlayCard={this.dispatch_undoPlayCard}
                    reclaimCards={this.dispatch_reclaimCards}
                    reclaimOne={this.dispatch_reclaimOne}
                    forgetFromHand={this.dispatch_forgetFromHand}
                    forgetFromPlayed={this.dispatch_forgetFromPlayed}
                    forgetFromDiscarded={this.dispatch_forgetFromDiscarded}
                />
                <BottomRow>
                    <InvaderDeckAndSlots
                        invaderDeck={this.props.G.invaderDeck}
                        invadersExplore={this.dispatch_invadersExplore}
                        invadersBuild={this.dispatch_invadersBuild}
                        invadersRage={this.dispatch_invadersRage}
                        invadersDiscard={this.dispatch_invadersDiscard}
                    />
                    <PowerCardPile
                        deckType={Types.PowerDeckType.Major}
                        availableCards={this.props.G.majorPowercards.available}
                        discardedCards={this.props.G.majorPowercards.discarded}
                        flippedCards={this.props.G.majorPowercards.flipSets}
                        playerNames={this.props.playerNames}
                        //moves
                        flipOne={() =>
                            this.dispatch_flipOne(Types.PowerDeckType.Major)}
                        flipFour={() =>
                            this.dispatch_flipFour(Types.PowerDeckType.Major)}
                        takeFlipped={(flipSetIdx, cardIdx) =>
                            this.dispatch_takeFlipped(Types.PowerDeckType.Major, flipSetIdx, cardIdx, curSpiritName)}
                        discardFlipSet={(flipSetIdx) =>
                            this.dispatch_discardFlipSet(Types.PowerDeckType.Major, flipSetIdx)}
                        takeDiscarded={(discardedCardIdx) =>
                            this.dispatch_takeDiscarded(Types.PowerDeckType.Major, discardedCardIdx, curSpiritName)}
                    />
                    <PowerCardPile
                        deckType={Types.PowerDeckType.Minor}
                        availableCards={this.props.G.minorPowercards.available}
                        discardedCards={this.props.G.minorPowercards.discarded}
                        flippedCards={this.props.G.minorPowercards.flipSets}
                        playerNames={this.props.playerNames}
                        //moves
                        flipOne={() =>
                            this.dispatch_flipOne(Types.PowerDeckType.Minor)}
                        flipFour={() =>
                            this.dispatch_flipFour(Types.PowerDeckType.Minor)}
                        takeFlipped={(flipSetIdx, cardIdx) =>
                            this.dispatch_takeFlipped(Types.PowerDeckType.Minor, flipSetIdx, cardIdx, curSpiritName)}
                        discardFlipSet={(flipSetIdx) =>
                            this.dispatch_discardFlipSet(Types.PowerDeckType.Minor, flipSetIdx)}
                        takeDiscarded={(discardedCardIdx) =>
                            this.dispatch_takeDiscarded(Types.PowerDeckType.Minor, discardedCardIdx, curSpiritName)}
                    />
                    <FearCardPile
                        fearCardPile={this.props.G.fearDeck}
                        fearCardFlip={this.dispatch_fearCardFlip}
                        fearCardEarn={this.dispatch_fearCardEarn}
                        fearCardDiscard={this.dispatch_fearCardDiscard}
                    />
                    <FearIcon
                        count={this.props.G.fearGenerated}
                        onSetFearCount={(count: number) => this.dispatch_setGeneratedFear(count)}
                        maxFear={this.props.G.activeSpirits.length * 4}
                        fearCardEarn={this.dispatch_fearCardEarn}
                    />
                    <BlightIcon
                        count={this.props.G.blightOnCard}
                        onSetBlightCount={(count: number) => this.dispatch_setBlightOnCard(count)} />

                </BottomRow>
                {this.state.dialogContent && popupDialog}
            </div>
        );
    }
}
