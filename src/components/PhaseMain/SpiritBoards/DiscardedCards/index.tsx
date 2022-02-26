import * as React from "react";

import style from "./style.module.scss";

import { Types } from "spirit-island-card-katalog/types";

import { Button } from "components/Button";


interface DiscardedCardsProps {
    cards: Types.PowerCardData[]
    //moves
    reclaimOne: (cardIdx: number) => void
    reclaimCards: () => void
    forgetFromDiscarded: (idx: number) => void
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
                className={style.SpiritBoards__discardedCardContainer}
                key={c.name}
            >
                <img
                    alt={c.name}
                    src={c.imageUrl}
                    onClick={(ev) => { this.selectCard(ev, idx) }}
                />
                {this.state.selectedCard === idx &&
                    <div className={style.SpiritBoards__discardedCardButtonOverlay}>
                        <Button size="small" onClick={(ev) => { ev.stopPropagation(); this.props.reclaimOne(idx) }}>Reclaim</Button>
                        <Button size="small" onClick={() => this.props.forgetFromDiscarded(idx)} >Forget</Button>
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