import * as React from "react";

import style from "./style.module.scss";

import { Types } from "spirit-island-card-katalog/types";

import { Button } from "components/Button";


interface HandCardProps {
    cards: Types.PowerCardData[]
    //moves
    playCard: (handCardIdx: number) => void
    discardFromHand: (handCardIdx: number) => void
    forgetFromHand: (handCardIdx: number) => void
}

interface HandCardState {
    selectedHandCardIdx?: number;
}


export class HandCards extends React.Component<HandCardProps, HandCardState>
{
    timeOutId: number
    constructor(props: HandCardProps) {
        super(props);
        this.state = {}
        this.timeOutId = -1;
        this.selectCard = this.selectCard.bind(this);
    }
    selectCard(ev: React.MouseEvent, cardIndex: number) {
        this.setState({ selectedHandCardIdx: cardIndex });
    }
    unselectedCard() {
        this.timeOutId = window.setTimeout(() => {
            this.setState({ selectedHandCardIdx: undefined })
        });
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
                {this.state.selectedHandCardIdx === idx &&
                    <div className={style.SpiritBoards__handCardButtonOverlay}>
                        <Button size="small" onClick={() => {this.props.playCard(idx);this.unselectedCard()}}>Play</Button>
                        <Button size="small" onClick={() => {this.props.discardFromHand(idx);this.unselectedCard()}}>Discard</Button>
                        <Button size="small" onClick={() => {this.props.forgetFromHand(idx);this.unselectedCard()}} >Forget</Button>
                    </div>
                }
            </div>
        );

        return (<div className={style.SpiritBoards__handCards}
            //unselect handcard when loosing focus
            onBlur={() => this.unselectedCard()}
            //but not if child has still the focus, onBlur is called first
            onFocus={() => { if (this.timeOutId >= 0) window.clearTimeout(this.timeOutId) }}
            //onBlur only works if tabIndex is set
            tabIndex={1}
        >
            <div className={style.SpiritBoards__handCardsTitle}>Hand Cards</div>
            {cardImages}
        </div>)
    }
}




