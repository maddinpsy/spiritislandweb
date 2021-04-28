import * as React from "react";

import style from "./style.module.scss";

import backMajor from "assets/Back Major.jpg"
import backMinor from "assets/Back Minor.jpg"
import { Button } from "components/Button";
import { Types } from "spirit-island-card-katalog/types";
import { ModalWindow } from "components/ModalWindow";
import { PowerCardList } from "./PowerCardList";


interface ActionSelectMenuProps {
    availableCount: number
    discardedCount: number
    flippedCount: number
    onShowDeck: () => void
    onShowDiscarded: () => void
    onShowFlipped: () => void
}


function ActionSelectMenu(props: ActionSelectMenuProps) {
    return (
        <div style={{ display: "flex", flexDirection: "column" }}>
            <Button onClick={(ev) => props.onShowDeck()}>
                Deck ({props.availableCount})
            </Button>

            <Button onClick={(ev) => props.onShowDiscarded()}>
                Discarded ({props.discardedCount})
            </Button>
            <Button onClick={(ev) => props.onShowFlipped()}>
                FlippedCards ({props.flippedCount})
            </Button>
        </div>
    )
}

export interface PowerCardPileProps {
    deckType: Types.PowerDeckType
    availableCards: Types.PowerCardData[]
    discardedCards: Types.PowerCardData[]
    flippedCards: { flippedBy: string, cards: Types.PowerCardData[] }[]
}

enum ViewState {
    Nothing,
    ActionSelectionMenu,
    AvailableCards,
    DiscardedCards,
    FlippedCards
}
export interface PowerCardPileState {
    currentView: ViewState;
}

export class PowerCardPile extends React.Component<PowerCardPileProps, PowerCardPileState> {
    constructor(props: any) {
        super(props)
        this.state = { currentView: ViewState.Nothing }
        this.hideDialog = this.hideDialog.bind(this)
        this.showMenu = this.showMenu.bind(this)
    }

    hideDialog() {
        console.log("as123d")
        this.setState({ currentView: ViewState.Nothing });
    }
    showMenu() {
        this.setState({ currentView: ViewState.ActionSelectionMenu });
    }

    render() {
        let image;
        switch (this.props.deckType) {
            case Types.PowerDeckType.Major:
                image = backMajor
                break;
            case Types.PowerDeckType.Minor:
                image = backMinor
                break;
        }

        //show popup bases on state
        let popup = <div>"asfd2"</div>;

        switch (this.state.currentView) {
            case ViewState.ActionSelectionMenu:
                popup = (
                    <ModalWindow
                        title={this.props.deckType + " Cards"}
                        onClose={this.hideDialog}
                    >
                        <ActionSelectMenu
                            discardedCount={this.props.discardedCards.length}
                            availableCount={this.props.availableCards.length}
                            flippedCount={this.props.flippedCards.reduce((sum, flipSet) => sum + flipSet.cards.length, 0)}
                            onShowDeck={() => this.setState({ currentView: ViewState.AvailableCards })}
                            onShowDiscarded={() => this.setState({ currentView: ViewState.DiscardedCards })}
                            onShowFlipped={() => this.setState({ currentView: ViewState.FlippedCards })}
                        />
                    </ModalWindow>
                );
                break;
            case ViewState.AvailableCards:
                popup = (
                    <ModalWindow
                        title={this.props.deckType + " Card Deck"}
                        onClose={this.hideDialog}
                    >
                        <PowerCardList cards={this.props.availableCards} actions={[]}/>
                    </ModalWindow>
                );
                break;
            case ViewState.DiscardedCards:
                popup = (
                    <ModalWindow
                        title={"Discarded " + this.props.deckType + " Cards"}
                        onClose={this.hideDialog}
                    >
                        <PowerCardList cards={this.props.discardedCards} actions={[]}/>
                    </ModalWindow>
                );
                break;
            case ViewState.FlippedCards:
                popup = (
                    <ModalWindow
                        title={"Flipped " + this.props.deckType + " Cards"}
                        onClose={this.hideDialog}
                    >
                        <div>
                            <div style={{ display: "flex", flexDirection: "row" }}>
                                <Button>Flip one card</Button>
                                <Button>Flip four cards</Button>
                            </div>
                            <div>Flipped by maddin</div>
                                Cards...
                        <div>Flipped by fefu</div>
                                Cards...
                    </div>
                    </ModalWindow>
                );
                break;
        }

        return (

            <div className={style.PowerCardPile__container} >
                <img src={image} alt="Major Carddeck" className={style.PowerCardPile__image}
                    onClick={this.showMenu}
                />
                {this.state.currentView !== ViewState.Nothing && popup}
            </div>
        );
    }
}
