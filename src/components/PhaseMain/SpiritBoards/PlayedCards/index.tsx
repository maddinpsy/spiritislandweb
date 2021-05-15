import * as React from "react";

import style from "./style.module.scss";

import { Types } from "spirit-island-card-katalog/types";

import { Button } from "components/Button";


interface PlayedCardsProps {
    cards: Types.PowerCardData[]
    //moves
    discardPlayed: (playCardIdx: number) => void
    undoPlayCard: (playCardIdx: number) => void
    forgetFromPlayed: (playCardIdx: number) => void
}
interface PlayedCardsState {
    selectedCard?: number
}

export class PlayedCards extends React.Component<PlayedCardsProps, PlayedCardsState>
{
    timeOutId:number;
    constructor(props: PlayedCardsProps) {
        super(props);
        this.state = {};
        this.timeOutId = -1;

        this.onClickHandler = this.onClickHandler.bind(this);
        this.onBlurHandler = this.onBlurHandler.bind(this);
        this.onFocusHandler = this.onFocusHandler.bind(this);
    }


    onBlurHandler() {
        this.timeOutId = window.setTimeout(() => {
            this.setState({ selectedCard: undefined })
        });
    }

    onClickHandler() {
        this.setState({ selectedCard: undefined })
    }

    onFocusHandler() {
        if(this.timeOutId>=0)
            window.clearTimeout(this.timeOutId);
    }

    // We close the popover on the next tick by using setTimeout.  // This is necessary because we need to first check if  // another child of the element has received focus as  // the blur event fires prior to the new focus event.  onBlurHandler() {    this.timeOutId = setTimeout(() => {      this.setState({        isOpen: false      });    });  }
    // If a child receives focus, do not close the popover.  onFocusHandler() {    clearTimeout(this.timeOutId);  }

    render() {
        const cardImages = this.props.cards.map((c, idx) =>
            <div className={style.PlayedCards__cardContainer}>
                <img
                    key={c.name}
                    alt={c.name}
                    src={c.imageUrl}
                    onClick={(ev) => { this.setState({ selectedCard: idx }); ev.stopPropagation() }}
                />
                {this.state.selectedCard === idx &&
                    <div className={style.PlayedCards__buttonOverlay}>
                        <Button size="small" onClick={() => this.props.undoPlayCard(idx)}>Undo</Button>
                        <Button size="small" onClick={() => this.props.discardPlayed(idx)}>Discard</Button>
                        <Button size="small" onClick={() => this.props.forgetFromPlayed(idx)}>Forget</Button>
                    </div>
                }
            </div>
        );

        return (<div className={style.PlayedCards__cards}
            onClick={(ev) => {this.onClickHandler()}}
            onBlur={(ev) => {this.onBlurHandler()}}
            onFocus={()=>this.onFocusHandler()}
            tabIndex={4}
        >
            {cardImages}
        </div>)
    }
}




