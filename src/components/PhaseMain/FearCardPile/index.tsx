import * as React from "react";

import style from "./style.module.scss";

import backFear from "assets/Back Fear.jpg"
import { Button } from "components/Button";
import { Types } from "spirit-island-card-katalog/types";
import { ModalWindow } from "components/ModalWindow";
import { FearCardPileData } from "game/GamePhaseMain";
import { render } from "react-dom";

export class FearCard extends React.Component<{ card: Types.FearCardData, onFlip: () => void }, { selected: boolean }>{
    timeoutID: number
    constructor(props: any) {
        super(props);
        this.state = { selected: false }
        this.timeoutID = 0;
    }

    select() {
        this.setState({ selected: true })
    }
    unselect() {
        this.timeoutID = window.setTimeout(() => this.setState({ selected: false }))
    }
    stopUnselect() {
        if (this.timeoutID > 0) window.clearTimeout(this.timeoutID)
    }

    render() {
        let image = this.props.card.flipped ? this.props.card.imageUrl : backFear;
        return (
            <div className={style.FearCardPile__imageContainer}
                onClick={() => this.select()}
                onBlur={() => this.unselect()}
                onFocus={() => this.stopUnselect()}
                tabIndex={5}
            >
                <img src={image} alt={this.props.card.name} />
                {this.state.selected && !this.props.card.flipped &&
                    <div className={style.FearCardPile__buttonOverlay}>
                        <Button
                            size="small"
                            onClick={
                                () => {
                                    this.props.onFlip();
                                    this.setState({ selected: false })
                                }
                            }>
                            Flip
                            </Button>
                    </div>
                }
            </div>
        );
    }
}

export interface FearCardPileProps {
    fearCardPile: FearCardPileData

    //moves
    fearCardFlip: (pileNumber: number, cardIdx: number) => void
    fearCardEarn: () => void
    fearCardDiscard: () => void
}

export interface FearCardPileState {
    popupVisible: boolean;
}

export class FearCardPile extends React.Component<FearCardPileProps, FearCardPileState> {
    constructor(props: any) {
        super(props)
        this.state = { popupVisible: false }
        this.hideDialog = this.hideDialog.bind(this)
        this.showMenu = this.showMenu.bind(this)
    }

    hideDialog() {
        this.setState({ popupVisible: false });
    }
    showMenu() {
        this.setState({ popupVisible: true });
    }

    render() {

        //show popup bases on state
        let popup = <ModalWindow title="Fear Cards" onClose={this.hideDialog}>
            <div className={style.FearCardPile__buttonBar}>
                <Button onClick={() => this.props.fearCardEarn()} size="small">Earn</Button>
                <Button onClick={() => this.props.fearCardDiscard()} size="small">Discard</Button>
            </div>
            <div className={style.FearCardPile__fearCardTable} >
                <div className={style.FearCardPile__fearCardColumn} >
                    <div className={style.FearCardPile__ColumnTitle}>Deck</div>
                    {this.props.fearCardPile.deckLeve1.length > 0 && (<div>Level 1</div>)}
                    {this.props.fearCardPile.deckLeve1.map((c, idx) =>
                        <FearCard card={c} onFlip={() => this.props.fearCardFlip(1, idx)} />)
                    }
                    {this.props.fearCardPile.deckLeve2.length > 0 && (<div>Level 2</div>)}
                    {this.props.fearCardPile.deckLeve2.map((c, idx) =>
                        <FearCard card={c} onFlip={() => this.props.fearCardFlip(2, idx)} />)
                    }
                    {this.props.fearCardPile.deckLeve3.length > 0 && (<div>Level 3</div>)}
                    {this.props.fearCardPile.deckLeve3.map((c, idx) =>
                        <FearCard card={c} onFlip={() => this.props.fearCardFlip(3, idx)} />)
                    }
                </div>
                <div className={style.FearCardPile__fearCardColumn} >
                    <div className={style.FearCardPile__ColumnTitle}>Earned</div>
                    {this.props.fearCardPile.earned.map((c, idx) =>
                        <FearCard card={c} onFlip={() => this.props.fearCardFlip(4, idx)} />)
                    }
                </div>
                <div className={style.FearCardPile__fearCardColumn} >
                    <div className={style.FearCardPile__ColumnTitle}>Discarded</div>
                    {this.props.fearCardPile.discarded.map((c, idx) =>
                        <FearCard card={c} onFlip={() => this.props.fearCardFlip(5, idx)} />)
                    }
                </div>
            </div>
        </ModalWindow>


        return (

            <div className={style.FearCardPile__container} >
                <img src={backFear} alt="FEar Carddeck" className={style.FearCardPile__image}
                    onClick={this.showMenu}
                />
                {this.state.popupVisible && popup}
            </div>
        );
    }
}
