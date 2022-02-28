import { InvaderCardData } from "game/InvaderCards";
import * as React from "react";
import { InvaderCard } from "../InvaderCard";

import style from "./style.module.scss";

interface InvaderDeckAndSlotsProps {
    invaderDeck: {
        available: InvaderCardData[]
        explore: InvaderCardData[]
        build: InvaderCardData[]
        rage: InvaderCardData[]
        discard: InvaderCardData[]
    },
    divHeight_px: number,
    //moves
    invadersExplore: (idx: number) => void
    invadersBuild: (idx: number) => void
    invadersRage: (idx: number) => void
    invadersDiscard: (idx: number) => void
}
export function InvaderDeckAndSlots(props: InvaderDeckAndSlotsProps) {
    const imgHeight = 2440;
        const imgWidth = 1580;
        const aspectRation = imgWidth / imgHeight;

    return (<div className={style.InvaderDeckAndSlots__invaderSlotList}>
        <div className={style.InvaderDeckAndSlots__invaderSlot} onClick={()=>props.invadersExplore(0)}
        style={{ height: props.divHeight_px, width: props.divHeight_px * aspectRation}}
        >
            {props.invaderDeck.available.length > 0 &&
            (<InvaderCard
                card={props.invaderDeck.available[0]}
                flipped={false}
                divWidth_percent={1}
            />)
            }
        </div>
        <div className={style.InvaderDeckAndSlots__invaderSlot} 
        onClick={()=>props.invadersBuild(0)}
        style={{ height: props.divHeight_px, width: props.divHeight_px * aspectRation}}
        >
            {props.invaderDeck.explore.map((c, idx) =>
            (<InvaderCard
                key={c.id + 10 * c.stage}
                card={c}
                flipped={true}
                divWidth_percent={1/props.invaderDeck.explore.length}
            />)
            )}
        </div>
        <div className={style.InvaderDeckAndSlots__invaderSlot} onClick={()=>props.invadersRage(0)}
        style={{ height: props.divHeight_px, width: props.divHeight_px * aspectRation}}
        >
            {props.invaderDeck.build.map((c, idx) =>
            (<InvaderCard
                key={c.id + 10 * c.stage}
                card={c}
                flipped={true}
                divWidth_percent={1/props.invaderDeck.build.length}
            />)
            )}
        </div>
        <div className={style.InvaderDeckAndSlots__invaderSlot}
        style={{ height: props.divHeight_px, width: props.divHeight_px * aspectRation}}
        >
            {props.invaderDeck.rage.map((c, idx) =>
            (<InvaderCard
                key={c.id + 10 * c.stage}
                card={c}
                flipped={true}
                divWidth_percent={1/props.invaderDeck.rage.length}
            />)
            )}
            
        </div>
    </div>)
}