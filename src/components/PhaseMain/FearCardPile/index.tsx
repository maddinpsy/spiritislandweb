import * as React from "react";

import style from "./style.module.scss";

import backFear from "assets/Back Fear.jpg"
import { Button } from "components/Button";
import { Types } from "spirit-island-card-katalog/types";
import { ModalWindow } from "components/ModalWindow";
import { FearCardPileData } from "game/GamePhaseMain";

export function FearCard(props: { card: Types.FearCardData }) {
    let image = props.card.flipped?props.card.imageUrl:backFear;
    return (
        <div className={style.FearCardPile__imageContainer} >
            <img src={image} alt={props.card.name} />
        </div>
    );
}

export interface FearCardPileProps {
    fearCardPile: FearCardPileData
    /*
    //moves
    flipOne: () => void
    flipFour: () => void
    takeFlipped: (flipSetIdx: number, cardIdx: number) => void
    discardFlipSet: (flipSetIdx: number,) => void
    takeDiscarded: (discardedCardIdx: number) => void
    */
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
            <div className={style.FearCardPile__fearCardTable} >
                <div className={style.FearCardPile__fearCardColumn} >
                    <div className={style.FearCardPile__ColumnTitle}>Deck</div>
                    {this.props.fearCardPile.deckLeve1.length > 0 && (<div>Level 1</div>)}
                    {this.props.fearCardPile.deckLeve1.map(c => <FearCard card={c} />)}
                    {this.props.fearCardPile.deckLeve2.length > 0 && (<div>Level 2</div>)}
                    {this.props.fearCardPile.deckLeve2.map(c => <FearCard card={c} />)}
                    {this.props.fearCardPile.deckLeve3.length > 0 && (<div>Level 3</div>)}
                    {this.props.fearCardPile.deckLeve3.map(c => <FearCard card={c} />)}
                </div>
                <div className={style.FearCardPile__fearCardColumn} >
                    <div className={style.FearCardPile__ColumnTitle}>Earned</div>
                    {this.props.fearCardPile.earned.map(c => <FearCard card={c} />)}
                </div>
                <div className={style.FearCardPile__fearCardColumn} >
                    <div className={style.FearCardPile__ColumnTitle}>Discarded</div>
                    {this.props.fearCardPile.discarded.map(c => <FearCard card={c} />)}
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
