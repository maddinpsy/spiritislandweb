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

import { PresenceImage } from "../Tokens/PresenceImage";
import { PowerCardList } from "../PowerCardPile/PowerCardList";

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
    presenceApearance: {
        presenceTrackPosition: Point[]
        presenceTrackDiameter: number
        presenceBackground: string
    }
    presenceCovered: boolean[]
    onTogglePresence: (idx: number) => void
}

function SpiritPresenceTrack(props: SpiritPresenceTrackProps) {
    const appearance = props.presenceApearance;
    if (appearance.presenceTrackPosition.length !== props.presenceCovered.length) {
        console.log("SpiritPresenceTrack Arrays differ:" + appearance.presenceTrackPosition.length + "!==" + props.presenceCovered.length);
        return <div>ERROR</div>
    }
    const presenceDivs = appearance.presenceTrackPosition.map((pos, idx) => {
        let elStyle: React.CSSProperties = {};
        elStyle.left = (pos.x * 100) + "%";
        elStyle.top = (pos.y * 100) + "%";
        elStyle.width = (appearance.presenceTrackDiameter * 100) + "%";
        //hide if disabled
        if (!props.presenceCovered[idx]) {
            elStyle.opacity = 0;
        }
        return (
            <div
                className={style.SpiritBoards__presence}
                style={elStyle}
                key={pos.x+""+pos.y}
                onClick={() => { props.onTogglePresence(idx); console.log("tk") }}
            >
                <PresenceImage cssBackground={appearance.presenceBackground} />
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
    currentSpiritsIdx: number
    setCurrentSpiritIdx: (idx: number) => void

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
    forgetFromHand: (spiritName: string, handCardIdx: number) => void
    forgetFromPlayed: (spiritName: string, playCardIdx: number) => void
    forgetFromDiscarded: (spiritName: string, discardedCardIdx: number) => void
}


export class SpiritPanels extends React.Component<SpiritPanelProps>
{
    constructor(props: SpiritPanelProps) {
        super(props);
        this.nextSpirit = this.nextSpirit.bind(this);
        this.previousSpirit = this.previousSpirit.bind(this);
    }

    private nextSpirit() {
        this.props.setCurrentSpiritIdx((this.props.currentSpiritsIdx + this.props.spirits.length - 1) % this.props.spirits.length);
    }

    private previousSpirit() {
        this.props.setCurrentSpiritIdx((this.props.currentSpiritsIdx + this.props.spirits.length + 1) % this.props.spirits.length);
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
                    }} 
                    forgetFromDiscarded={(idx) => this.props.forgetFromDiscarded(curSpirit.name, idx)}
                    />
            });
    }

    render() {
        const curSpirit = this.props.spirits[this.props.currentSpiritsIdx];
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
                        presenceApearance={curSpirit.presenceAppearance}
                        presenceCovered={curSpirit.presenceTrackCovered}
                        onTogglePresence={(idx) => { this.props.toggleSpiritPresence(curSpirit.name, idx); console.log("aok") }} />
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
                {/*HandCards
                <PowerCardList
                 cards={curSpirit.handCards}
                 actions={[
                    {title:"Play",onSelect:(idx) => this.props.playCard(curSpirit.name, idx)},
                    {title:"Discard",onSelect:(idx) => this.props.discardFromHand(curSpirit.name, idx)},
                    //{title:"Forget",onSelect:(idx) => this.props.forgetFromHand(curSpirit.name, idx)}
                    {title:"Forget",onSelect:(idx) => alert("TODO2")}
                 ]}
                 />
                 */}
                {/*PlayedCards
                 <PowerCardList
                 cards={curSpirit.playedCards}
                 actions={[
                    {title:"Undo",onSelect:(idx) => this.props.undoPlayCard(curSpirit.name, idx)},
                    {title:"Discard",onSelect:(idx) => this.props.discardPlayed(curSpirit.name, idx)},
                    //{title:"Forget",onSelect:(idx) => this.props.forgetFromHand(curSpirit.name, idx)}
                    {title:"Forget",onSelect:(idx) => alert("TODO2")}
                 ]}
                 />
                 */}
                <HandCards cards={curSpirit.handCards}
                    playCard={(idx) => this.props.playCard(curSpirit.name, idx)}
                    discardFromHand={(idx) => this.props.discardFromHand(curSpirit.name, idx)}
                    forgetFromHand={(idx) => this.props.forgetFromHand(curSpirit.name, idx)}
                />
                <PlayedCards cards={curSpirit.playedCards}
                    discardPlayed={(idx) => this.props.discardPlayed(curSpirit.name, idx)}
                    undoPlayCard={(idx) => this.props.undoPlayCard(curSpirit.name, idx)}
                    forgetFromPlayed={(idx) => this.props.forgetFromPlayed(curSpirit.name, idx)}
                />
            </div>

        );
    }

}



