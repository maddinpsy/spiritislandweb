import * as React from "react";

import style from "./style.module.scss";

import { Types } from "spirit-island-card-katalog/types";

import { Button } from "components/Button";


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




