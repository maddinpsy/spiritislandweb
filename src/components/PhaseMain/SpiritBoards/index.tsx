import * as React from "react";

import style from "./style.module.scss";

import { ActiveSpirit } from "game/GamePhaseMain";
import { SpiritDetails } from "components/SpiritDetails";

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
                    <div>Current Energy: {curSpirit.currentEnergy}</div>
                    <div>Discarded Cards: {curSpirit.currentEnergy}</div>
                    <div>Destroyed Presences: {curSpirit.destroyedPresences}</div>
                    <div>Current Elements:</div>
                </div>
                <div className={style.SpiritBoards__handCards}>
                        Hand Cards
                </div>

            </div>
        );
    }
}



