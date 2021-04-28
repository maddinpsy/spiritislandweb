import * as React from "react";

import style from "./style.module.scss";

import { ActiveSpirit } from "game/GamePhaseMain";
import { SpiritDetails } from "components/SpiritDetails";
import { Types } from "spirit-island-card-katalog/types";

import { EnergyIcon, DiscardedCardsIcon, DestroyedPresencesIcon, ElementList } from "../Icons"
import { DiscardedCards } from "./DiscardedCards";
import { HandCards } from "./HandCards";
import { PlayedCards } from "./PlayedCards";
import { Point } from "../../../game/GamePhaseSetup";

import presenceIcon from "assets/tokens/Presenceicon.png"

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

interface SpiritPresenceTrackProps {
    presencePosition: Point[]
    presenceDiameter: number
    presenceCovered: boolean[]
    presenceBackground: string
    onTogglePresence: (idx: number) => void
}

function SpiritPresenceTrack(props: SpiritPresenceTrackProps) {
    if (props.presencePosition.length !== props.presenceCovered.length) {
        console.log("SpiritPresenceTrack Arrays differ:" + props.presencePosition.length + "!==" + props.presenceCovered.length);
        return <div>ERROR</div>
    }
    const presenceDivs = props.presencePosition.map((pos, idx) => {
        let elStyle: React.CSSProperties = {};
        elStyle.left = (pos.x * 100) + "%";
        elStyle.top = (pos.y * 100) + "%";
        elStyle.width = (props.presenceDiameter * 100) + "%";
        elStyle.background = props.presenceBackground;
        return (
            <div
                className={style.SpiritBoards__presence}
                style={elStyle}
                onClick={() => props.onTogglePresence(idx)}
            >
                <img src={presenceIcon} alt="" />
            </div>
        );
    })
    return (
        <div className={style.SpiritBoards__presenceContainer}>
            {presenceDivs}
        </div>
    )
}

interface SpiritPanelProps {
    spirits: ActiveSpirit[]
    showDialog: (data?: { title: string, content: JSX.Element }) => void;

    //moves
    setSpiritEnergy: (spiritName: string, energy: number) => void
    setSpiritDestroyedPresences: (spiritName: string, destroyedPresences: number) => void
    setSpiritElement: (spiritName: string, elementType: Types.Elements, count: number) => void
    toggleSpiritPresence: (spiritName: string, presenceIndex: number) => void
    playCard: (spiritName: string, handCardIdx: number) => void
    discardFromHand: (spiritName: string, handCardIdx: number) => void
    discardPlayed: (spiritName: string, playCardIdx: number) => void
    undoPlayCard: (spiritName: string, playCardIdx: number) => void
    reclaimCards: (spiritName: string) => void
    reclaimOne: (spiritName: string, discardedCardIdx: number) => void
}

interface SpiritPanelsState {
    currentSpiritsIdx: number
}

export class SpiritPanels extends React.Component<SpiritPanelProps, SpiritPanelsState>
{
    constructor(props: SpiritPanelProps) {
        super(props);
        this.state = { currentSpiritsIdx: 0 }
        this.nextSpirit = this.nextSpirit.bind(this);
        this.previousSpirit = this.previousSpirit.bind(this);
    }

    private nextSpirit() {
        this.setState({ currentSpiritsIdx: (this.state.currentSpiritsIdx + this.props.spirits.length - 1) % this.props.spirits.length })
    }

    private previousSpirit() {
        this.setState({ currentSpiritsIdx: (this.state.currentSpiritsIdx + 1) % this.props.spirits.length })
    }

    private showDiscardedCardsDialog(curSpirit: ActiveSpirit) {
        if (curSpirit.discardedCards.length > 0)
            this.props.showDialog({
                title: "Discarded Cards", content: <DiscardedCards
                    cards={curSpirit.discardedCards}
                    reclaimOne={(idx) => {
                        this.props.reclaimOne(curSpirit.name, idx);
                        this.props.showDialog();
                    }}
                    reclaimCards={() => {
                        this.props.reclaimCards(curSpirit.name);
                        this.props.showDialog();
                    }} />
            });
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
                    <SpiritPresenceTrack
                        presencePosition={curSpirit.presenceTrackPosition}
                        presenceDiameter={curSpirit.presenceTrackDiameter}
                        presenceCovered={curSpirit.presenceTrackCovered}
                        presenceBackground={curSpirit.presenceBackground}
                        onTogglePresence={(idx) => { this.props.toggleSpiritPresence(curSpirit.name, idx) }} />
                </div>
                <div className={style.SpiritBoards__activeSpiritInfo}>
                    <EnergyIcon energy={curSpirit.currentEnergy}
                        setEnergy={(count) => this.props.setSpiritEnergy(curSpirit.name, count)}
                    />
                    <DiscardedCardsIcon
                        count={curSpirit.discardedCards.length}
                        onClick={() => this.showDiscardedCardsDialog(curSpirit)}
                    />
                    <DestroyedPresencesIcon
                        count={curSpirit.destroyedPresences}
                        setDestroyedPresences={(count) => this.props.setSpiritDestroyedPresences(curSpirit.name, count)}
                    />
                    <ElementList
                        elemetCount={curSpirit.currentElements}
                        showDialog={this.props.showDialog}
                        setSpiritElement={(type, count) => this.props.setSpiritElement(curSpirit.name, type, count)}
                    />
                </div>
                <HandCards cards={curSpirit.handCards}
                    playCard={(idx) => this.props.playCard(curSpirit.name, idx)}
                    discardFromHand={(idx) => this.props.discardFromHand(curSpirit.name, idx)}
                />
                <PlayedCards cards={curSpirit.playedCards}
                    discardPlayed={(idx) => this.props.discardPlayed(curSpirit.name, idx)}
                    undoPlayCard={(idx) => this.props.undoPlayCard(curSpirit.name, idx)}
                />
            </div>

        );
    }

}



