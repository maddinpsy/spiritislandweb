import { ModalWindow } from "components/ModalWindow";
import { InvaderCardData } from "game/InvaderCards";
import * as React from "react";
import { InvaderCard } from "../InvaderCard";
import { useDrag, useDrop } from 'react-dnd'

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
type DragItemInfo = {
    curCol: string
    curIdx: number
}

function TableCell(props: { card: InvaderCardData, curCol: string, curIdx: number }) {
    const [{ isDragging }, drag] = useDrag<DragItemInfo, void, { isDragging: boolean }>(() => ({
        // "type" is required. It is used by the "accept" specification of drop targets.
        type: 'InvaderCard',
        // The collect function utilizes a "monitor" instance (see the Overview for what this is)
        // to pull important pieces of state from the DnD system.
        collect: (monitor) => ({
            isDragging: monitor.isDragging()
        }),
        item: { curCol: props.curCol, curIdx: props.curIdx }
    }))
    return (
        <div
            className={style.InvaderDeckAndSlots__CardCell}
            ref={drag}
            style={{ opacity: isDragging ? 0.5 : 1 }}
        >
            <InvaderCard card={props.card} />
        </div>
    )
}

function TableColumn(props: { title: string, cards: InvaderCardData[], onDrop?: (idx: number) => void }) {
    const [{ isOver, canDrop }, drop] = useDrop<DragItemInfo, void, { isOver: boolean, canDrop: boolean }>(() => ({
        // The type (or types) to accept - strings or symbols
        accept: 'InvaderCard',
        // Props to collect
        collect: (monitor) => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop()
        }),
        canDrop: (item) => {
            if (!props.onDrop) return false;
            if (props.title === "Discarded" && item.curCol === "Rage") return true;
            if (props.title === "Rage" && item.curCol === "Build") return true;
            if (props.title === "Build" && item.curCol === "Explore") return true;
            if (props.title === "Explore" && item.curCol.startsWith("Available")) return true;
            return false;
        },
        drop: (item) => {
            if (props.onDrop) props.onDrop(item.curIdx);
        }
    }))
    return (
        <div
            className={style.InvaderDeckAndSlots__CardColumn}
            style={{ backgroundColor: (canDrop && isOver) ? '#c58851' : 'inherit' }}
            ref={drop}
        >
            <div className={style.InvaderDeckAndSlots__ColumnTitle}>{props.title}</div>
            {props.cards.map((c, idx) =>
                <TableCell card={c} key={c.id + c.stage * 10} curCol={props.title} curIdx={idx} />
            )}
        </div>
    )
}

function InvaderDeckDialog(props: InvaderDeckAndSlotsProps & { hideDialog: () => void }) {
    return (<ModalWindow title="Invader Cards" onClose={props.hideDialog}>
        <div className={style.InvaderDeckAndSlots__CardTable} >
            <TableColumn title="Discarded" cards={props.invaderDeck.discard} onDrop={props.invadersDiscard} />
            <TableColumn title="Rage" cards={props.invaderDeck.rage} onDrop={props.invadersRage} />
            <TableColumn title="Build" cards={props.invaderDeck.build} onDrop={props.invadersBuild} />
            <TableColumn title="Explore" cards={props.invaderDeck.explore} onDrop={props.invadersExplore} />
            <TableColumn title={"Available (" + props.invaderDeck.available.length + ")"} cards={props.invaderDeck.available} />
        </div>
    </ModalWindow>
    );
}

export function InvaderDeckAndSlots(props: InvaderDeckAndSlotsProps) {
    const imgHeight = 2440;
    const imgWidth = 1580;
    const aspectRation = imgWidth / imgHeight;

    const [isDialogShown, setDialogShown] = React.useState(false)

    return (
        <div className={style.InvaderDeckAndSlots__invaderSlotList}>
            <div className={style.InvaderDeckAndSlots__invaderSlot}
                style={{ height: props.divHeight_px, width: props.divHeight_px * aspectRation }}
                onClick={() => setDialogShown(true)}
            >
                {props.invaderDeck.available.length > 0 &&
                    (<InvaderCard
                        card={props.invaderDeck.available[0]}
                        divWidth_percent={1}
                    />)
                }
            </div>
            <div className={style.InvaderDeckAndSlots__invaderSlot}
                style={{ height: props.divHeight_px, width: props.divHeight_px * aspectRation }}
                onClick={() => setDialogShown(true)}
            >
                {props.invaderDeck.explore.map((c, idx) =>
                (<InvaderCard
                    key={c.id + 10 * c.stage}
                    card={c}
                    divWidth_percent={1 / props.invaderDeck.explore.length}
                />)
                )}
            </div>
            <div className={style.InvaderDeckAndSlots__invaderSlot}
                style={{ height: props.divHeight_px, width: props.divHeight_px * aspectRation }}
                onClick={() => setDialogShown(true)}
            >
                {props.invaderDeck.build.map((c, idx) =>
                (<InvaderCard
                    key={c.id + 10 * c.stage}
                    card={c}
                    divWidth_percent={1 / props.invaderDeck.build.length}
                />)
                )}
            </div>
            <div className={style.InvaderDeckAndSlots__invaderSlot}
                style={{ height: props.divHeight_px, width: props.divHeight_px * aspectRation }}
                onClick={() => setDialogShown(true)}
            >
                {props.invaderDeck.rage.map((c, idx) =>
                (<InvaderCard
                    key={c.id + 10 * c.stage}
                    card={c}
                    divWidth_percent={1 / props.invaderDeck.rage.length}
                />)
                )}
            </div>
            {isDialogShown && <InvaderDeckDialog {...props} hideDialog={() => setDialogShown(false)} />}
        </div>
    );
}