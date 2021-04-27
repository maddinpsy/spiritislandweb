import * as React from "react";

import style from "./style.module.scss";

import { ActiveSpirit } from "game/GamePhaseMain";
import { SpiritDetails } from "components/SpiritDetails";
import { Types } from "spirit-island-card-katalog/types";

import { EnergyIcon, DiscardedCardsIcon, DestroyedPresencesIcon, ElementList } from "../Icons"
import { Button } from "components/Button";

interface SpiritPanelsHeaderProps {
    spiritName: string
    onNext: () => void;
    onPrev: () => void;
}

function SpiritPanelsHeader(props: SpiritPanelsHeaderProps) {
    return (
        <div className={style.SpiritBoards__header}>
            <div className={style.SpiritBoards__headerButtonPrevious}
                onClick={() => props.onPrev()}
            >
                &lt;
            </div>
            <div className={style.SpiritBoards__headerButtonTitle}>
                {props.spiritName}
            </div>
            <div className={style.SpiritBoards__headerButtonNext}
                onClick={() => props.onNext()}
            >
                &gt;
            </div>
        </div>
    );
}

interface HandCardProps {
    cards: Types.PowerCardData[]
    selectedHandCardIdx?: number
    onSelectCard: (cardIdx?: number) => void
    //moves
    playCard: (handCardIdx: number) => void
    discardFromHand: (handCardIdx: number) => void
}


export class HandCards extends React.Component<HandCardProps>
{
    constructor(props: HandCardProps) {
        super(props);
        this.selectCard = this.selectCard.bind(this);
    }
    selectCard(ev: React.MouseEvent, cardIndex: number) {
        //stop the top level unselect
        ev.stopPropagation();
        this.props.onSelectCard(cardIndex);
    }
    render() {
        const cardImages = this.props.cards.map((c, idx) =>
            <div className={style.SpiritBoards__handCardContainer}>
                <img
                    key={c.name}
                    alt={c.name}
                    src={c.imageUrl}
                    onClick={(ev) => { this.selectCard(ev, idx) }}
                />
                {this.props.selectedHandCardIdx === idx &&
                    <div className={style.SpiritBoards__handCardButtonOverlay}>
                        <Button size="small" onClick={() => this.props.playCard(idx)}>Play</Button>
                        <Button size="small" onClick={() => this.props.discardFromHand(idx)}>Discard</Button>
                        <Button size="small" onClick={() => alert("TODO")} >Forget</Button>
                    </div>
                }
            </div>
        );

        return (<div className={style.SpiritBoards__handCards}>
            <div className={style.SpiritBoards__handCardsTitle}>Hand Cards</div>
            {cardImages}
        </div>)
    }
}

interface DiscardedCardsProps {
    cards: Types.PowerCardData[]
    //moves
    reclaimOne: (cardIdx: number) => void
    reclaimCards: () => void
}


export class DiscardedCards extends React.Component<DiscardedCardsProps, { selectedCard?: number }>
{
    constructor(props: DiscardedCardsProps) {
        super(props);
        this.state = {};

        this.selectCard = this.selectCard.bind(this);
        this.unselectCard = this.unselectCard.bind(this);
    }
    selectCard(ev: React.MouseEvent, cardIndex: number) {
        //stop the top level unselect
        ev.stopPropagation();
        this.setState({ selectedCard: cardIndex })
    }
    unselectCard() {
        this.setState({ selectedCard: undefined })
    }

    render() {
        const cardImages = this.props.cards.map((c, idx) =>
            <div
                className={style.SpiritBoards__discardedCardContainer}>
                <img
                    key={c.name}
                    alt={c.name}
                    src={c.imageUrl}
                    onClick={(ev) => { this.selectCard(ev, idx) }}
                />
                {this.state.selectedCard === idx &&
                    <div className={style.SpiritBoards__discardedCardButtonOverlay}>
                        <Button size="small" onClick={(ev) =>{ev.stopPropagation(); this.props.reclaimOne(idx)}}>Reclaim</Button>
                        <Button size="small" onClick={() => alert("TODO")} >Forget</Button>
                    </div>
                }
            </div>
        );

        return (
            <div onClick={() => this.unselectCard()}>
                <Button size="small" onClick={() => this.props.reclaimCards()}>Reclaim All</Button>
                <div className={style.SpiritBoards__discardedCardList}>
                    {cardImages}
                </div>
            </div>)
    }
}
interface SpiritBoardsProps {
    spirits: ActiveSpirit[]
    showDialog: (data?: { title: string, content: JSX.Element }) => void;

    //moves
    setSpiritEnergy: (spiritName: string, energy: number) => void
    setSpiritDestroyedPresences: (spiritName: string, destroyedPresences: number) => void
    setSpiritElement: (spiritName: string, elementType: Types.Elements, count: number) => void
    playCard: (spiritName: string, handCardIdx: number) => void
    discardFromHand: (spiritName: string, handCardIdx: number) => void
    discardPlayed: (spiritName: string) => void
    reclaimCards: (spiritName: string) => void
    reclaimOne: (spiritName: string, discardedCardIdx: number) => void
}

interface SpiritPanelsState {
    currentSpiritsIdx: number
    selectedHandCardIdx?: number
}

export class SpiritPanels extends React.Component<SpiritBoardsProps, SpiritPanelsState>
{
    constructor(props: SpiritBoardsProps) {
        super(props);
        this.state = { currentSpiritsIdx: 0 }
        this.nextSpirit = this.nextSpirit.bind(this);
        this.previousSpirit = this.previousSpirit.bind(this);
    }

    nextSpirit() {
        this.setState({ currentSpiritsIdx: (this.state.currentSpiritsIdx + this.props.spirits.length - 1) % this.props.spirits.length })
    }

    previousSpirit() {
        this.setState({ currentSpiritsIdx: (this.state.currentSpiritsIdx + 1) % this.props.spirits.length })
    }

    unselectedHandcard() {
        this.setState({ selectedHandCardIdx: undefined });
    }

    render() {
        const curSpirit = this.props.spirits[this.state.currentSpiritsIdx];
        return (
            <div className={style.SpiritBoards__container}
                //click anywere to unselect the handcard
                onClick={() => this.unselectedHandcard()}
                //unselect handcard when loosing focus
                //onBlur={() => this.unselectedHandcard()}
                //onBlur only works if tabIndex is set
                tabIndex={1}
            >
                <SpiritPanelsHeader spiritName={curSpirit.name} onNext={this.nextSpirit} onPrev={this.previousSpirit} />
                <div className={style.SpiritBoards__frontsideBoard}>
                    <img
                        src={curSpirit.frontSideUrl}
                        alt={curSpirit.name}
                        onClick={() => this.props.showDialog({
                            title: curSpirit.name, content: (<SpiritDetails spirit={curSpirit} />)
                        })
                        }
                    />

                </div>
                <div className={style.SpiritBoards__activeSpiritInfo}>
                    <EnergyIcon energy={curSpirit.currentEnergy}
                        setEnergy={(count) => this.props.setSpiritEnergy(curSpirit.name, count)}
                    />
                    <DiscardedCardsIcon
                        count={curSpirit.discardedCards.length}
                        onClick={() => {if(curSpirit.discardedCards.length>0) this.props.showDialog({
                            title: "Discarded Cards", content:
                                <DiscardedCards
                                    cards={curSpirit.discardedCards}
                                    reclaimOne={(idx) => {
                                        this.props.reclaimOne(curSpirit.name, idx);
                                        this.props.showDialog()
                                    }}
                                    reclaimCards={() => {
                                        this.props.reclaimCards(curSpirit.name);
                                        this.props.showDialog()
                                    }}
                                />
                        })}}
                    />
                    <DestroyedPresencesIcon
                        count={curSpirit.destroyedPresences}
                        setDestroyedPresences={(count) => this.props.setSpiritDestroyedPresences(curSpirit.name, count)}
                    />
                    <ElementList
                        elemetCount={curSpirit.currentElements}
                        showDialog={this.props.showDialog}
                        setSpiritElement={(type, count) => this.props.setSpiritElement(curSpirit.name, type, count)}
                    />
                </div>
                <HandCards cards={curSpirit.handCards}
                    playCard={(idx) => this.props.playCard(curSpirit.name, idx)}
                    discardFromHand={(idx) => this.props.discardFromHand(curSpirit.name, idx)}
                    selectedHandCardIdx={this.state.selectedHandCardIdx}
                    onSelectCard={(idx) => this.setState({ selectedHandCardIdx: idx })}
                />

            </div>
        );
    }
}



