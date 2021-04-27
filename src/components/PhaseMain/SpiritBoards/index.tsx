import * as React from "react";

import style from "./style.module.scss";

import { ActiveSpirit } from "game/GamePhaseMain";
import { SpiritDetails } from "components/SpiritDetails";
import { Types } from "spirit-island-card-katalog/types";

import { EnergyIcon, DiscardedCardsIcon, DestroyedPresencesIcon, ElementList } from "../Icons"

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
        const el = [
            { type: Types.Elements.Air, count: 2 },
            { type: Types.Elements.Earth, count: 1 },
            { type: Types.Elements.Animal, count: 1 },
            { type: Types.Elements.Water, count: 4 },
            { type: Types.Elements.Fire, count: 3 },

        ]
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
                        <EnergyIcon energy={curSpirit.currentEnergy} />
                    </div>
                    <div>
                        <DiscardedCardsIcon count={curSpirit.currentEnergy} />
                    </div>
                    <div>
                        <DestroyedPresencesIcon count={curSpirit.destroyedPresences} />
                    </div>
                    <div>
                        <ElementList elemetCount={el} showDialog={this.props.showDialog}/>
                    </div>
                </div>
                <HandCards cards={curSpirit.startHand} />

            </div>
        );
    }
}



