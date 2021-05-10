import * as React from "react";

import style from "./style.module.scss";

import { Types } from "spirit-island-card-katalog/types";

import { Button } from "components/Button";
import { SelectableDivHOC, SelectableProps } from "components/SelectableDivHOC";


interface PlayedCardsProps {
    cards: Types.PowerCardData[]
    //moves
    discardPlayed: (playCardIdx: number) => void
    undoPlayCard: (playCardIdx: number) => void
    forgetFromPlayed: (playCardIdx: number) => void
}


interface CardProps {
    card: Types.PowerCardData
    discardPlayed: () => void
    undoPlayCard: () => void
    forgetFromPlayed: () => void
}
function Card(props: CardProps & SelectableProps) {
    return (
        <div ref={props.selRef} className={style.PlayedCards__cardContainer}>
            <img
                key={props.card.name}
                alt={props.card.name}
                src={props.card.imageUrl}
            />
            {props.isSelected &&
                <div className={style.PlayedCards__buttonOverlay}>
                    <Button size="small" onClick={() => props.undoPlayCard()}>Undo</Button>
                    <Button size="small" onClick={() => props.discardPlayed()}>Discard</Button>
                    <Button size="small" onClick={() => props.forgetFromPlayed()}>Forget</Button>
                </div>
            }
        </div>
    )
}

const SelectableCard = SelectableDivHOC(Card)

export class PlayedCards extends React.Component<PlayedCardsProps>
{
    render() {
        const cardImages = this.props.cards.map((c, idx) =>
            <SelectableCard
                card={c}
                key={c.imageUrl}
                undoPlayCard={() => this.props.undoPlayCard(idx)}
                discardPlayed={() => this.props.discardPlayed(idx)}
                forgetFromPlayed={() => this.props.forgetFromPlayed(idx)}
            />
        );

        return (<div className={style.PlayedCards__cards}>
            {cardImages}
        </div>)
    }
}




