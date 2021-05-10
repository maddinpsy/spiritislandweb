import * as React from "react";

import style from "./style.module.scss";

import { Types } from "spirit-island-card-katalog/types";

import { Button } from "components/Button";
import { SelectableDivHOC, SelectableProps } from "components/SelectableDivHOC";



interface CardProps{
    card:Types.PowerCardData
    playCard: () => void
    discardFromHand: () => void
    forgetFromHand: () => void
}
class Card extends React.Component<CardProps & SelectableProps>{
    render() {
        return (
            <div ref={this.props.selRef} className={style.SpiritBoards__handCardContainer}>
                <img
                    key={this.props.card.name}
                    alt={this.props.card.name}
                    src={this.props.card.imageUrl}
                />
                {this.props.isSelected &&
                    <div className={style.SpiritBoards__handCardButtonOverlay}>
                        <Button size="small" onClick={() => { this.props.playCard() }}>Play</Button>
                        <Button size="small" onClick={() => { this.props.discardFromHand() }}>Discard</Button>
                        <Button size="small" onClick={() => { this.props.forgetFromHand() }} >Forget</Button>
                    </div>
                }
            </div>
        )
    }
}
const SelectableCard = SelectableDivHOC(Card)

interface HandCardProps {
    cards: Types.PowerCardData[]
    //moves
    playCard: (handCardIdx: number) => void
    discardFromHand: (handCardIdx: number) => void
    forgetFromHand: (handCardIdx: number) => void
}

export class HandCards extends React.Component<HandCardProps>
{
    render() {
        const cardImages = this.props.cards.map((c, idx) =>
            <SelectableCard
            card={c}
            key={c.imageUrl}
            playCard={()=>this.props.playCard(idx)}
            discardFromHand={()=>this.props.discardFromHand(idx)}
            forgetFromHand={()=>this.props.forgetFromHand(idx)}
            />
        );

        return (<div className={style.SpiritBoards__handCards}>
            <div className={style.SpiritBoards__handCardsTitle}>Hand Cards</div>
            {cardImages}
        </div>)
    }
}




