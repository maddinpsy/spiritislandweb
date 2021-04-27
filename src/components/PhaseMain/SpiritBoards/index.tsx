import * as React from "react";

import style from "./style.module.scss";

import { ActiveSpirit } from "game/GamePhaseMain";
import { SpiritDetails } from "components/SpiritDetails";
import { Types } from "spirit-island-card-katalog/types";

import { EnergyIcon, DiscardedCardsIcon, DestroyedPresencesIcon, ElementList } from "../Icons"
import { cursorTo } from "readline";

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

interface PowerCardProps {
    cards: Types.PowerCardData[]
}


export class HandCards extends React.Component<PowerCardProps>
{
    render() {
        const cardImages = this.props.cards.map(c =>
            <div className={style.SpiritBoards__handCardContainer}>
                <img
                    key={c.name}
                    alt={c.name}
                    src={c.imageUrl}
                />
            </div>
        );

        return (<div className={style.SpiritBoards__handCards}>
            <div className={style.SpiritBoards__handCardsTitle}>Hand Cards</div>
            {cardImages}
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

    render() {
        const curSpirit = this.props.spirits[this.state.currentSpiritsIdx];
        return (
            <div className={style.SpiritBoards__container}>
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
                    <div>
                        <EnergyIcon energy={curSpirit.currentEnergy}
                            setEnergy={(count) => this.props.setSpiritEnergy(curSpirit.name, count)}
                        />
                    </div>
                    <div>
                        <DiscardedCardsIcon count={curSpirit.discardedCards.length} />
                    </div>
                    <div>
                        <DestroyedPresencesIcon count={curSpirit.destroyedPresences}
                            setDestroyedPresences={(count) => this.props.setSpiritDestroyedPresences(curSpirit.name, count)} />
                    </div>
                    <div>
                        <ElementList elemetCount={curSpirit.currentElements} showDialog={this.props.showDialog}
                            setSpiritElement={(type, count) => this.props.setSpiritElement(curSpirit.name, type, count)} />
                    </div>
                </div>
                <HandCards cards={curSpirit.handCards} />

            </div>
        );
    }
}



