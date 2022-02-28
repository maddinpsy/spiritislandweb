import { ModalWindow } from "components/ModalWindow";
import { InvaderCardData } from "game/InvaderCards";
import * as React from "react";
import { InvaderCard } from "../InvaderCard";
import { useDrag, useDrop } from 'react-dnd'

import style from "./style.module.scss";

interface InvaderDeckAndSlotsProps {
    invaderDeck: InvaderCardData[],
    divHeight_px: number,
    //moves
    invadersExplore: (id: number, stage: InvaderCardData["stage"]) => void
    invadersBuild: (id: number, stage: InvaderCardData["stage"]) => void
    invadersRage: (id: number, stage: InvaderCardData["stage"]) => void
    invadersDiscard: (id: number, stage: InvaderCardData["stage"]) => void
}
type DragItemInfo = {
    id: number
    stage: InvaderCardData["stage"]
    curCol: string
}

function TableCell(props: { card: InvaderCardData, curCol: string }) {
    const [{ isDragging }, drag] = useDrag<DragItemInfo, void, { isDragging: boolean }>(() => ({
        // "type" is required. It is used by the "accept" specification of drop targets.
        type: 'InvaderCard',
        // The collect function utilizes a "monitor" instance (see the Overview for what this is)
        // to pull important pieces of state from the DnD system.
        collect: (monitor) => ({
            isDragging: monitor.isDragging()
        }),
        item: { id: props.card.id, stage: props.card.stage, curCol: props.curCol }
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

function TableColumn(props: { title: string, cards: InvaderCardData[], onDrop?: (id: number, stage: InvaderCardData["stage"]) => void }) {
    const [{ isOver, canDrop }, drop] = useDrop<DragItemInfo, void, { isOver: boolean, canDrop: boolean }>(() => ({
        // The type (or types) to accept - strings or symbols
        accept: 'InvaderCard',
        // Props to collect
        collect: (monitor) => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop()
        }),
        canDrop: (item) => {
            if (props.title === "Discarded" && item.curCol === "Rage") return true;
            if (props.title === "Rage" && item.curCol === "Build") return true;
            if (props.title === "Build" && item.curCol === "Explore") return true;
            if (props.title === "Explore" && item.curCol.startsWith("Available")) return true;
            return false;
        },
        drop: (item) => {
            if (props.onDrop) props.onDrop(item.id, item.stage);
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
                <TableCell card={c} key={c.id + c.stage * 10} curCol={props.title} />
            )}
        </div>
    )
}

function InvaderDeckDialog(props: InvaderDeckAndSlotsProps & { hideDialog: () => void }) {
    const avlCards = props.invaderDeck.filter(c => c.stack === "available");
    return (<ModalWindow title="Invader Cards" onClose={props.hideDialog}>
        <div className={style.InvaderDeckAndSlots__CardTable} >
            <TableColumn title="Discarded" cards={props.invaderDeck.filter(c => c.stack === "discard")} onDrop={props.invadersDiscard} />
            <TableColumn title="Rage" cards={props.invaderDeck.filter(c => c.stack === "rage")} onDrop={props.invadersRage} />
            <TableColumn title="Build" cards={props.invaderDeck.filter(c => c.stack === "build")} onDrop={props.invadersBuild} />
            <TableColumn title="Explore" cards={props.invaderDeck.filter(c => c.stack === "explore")} onDrop={props.invadersExplore} />
            <TableColumn title={"Available (" + avlCards.length + ")"} cards={avlCards} />
        </div>
    </ModalWindow>
    );
}

export function InvaderDeckAndSlots(props: InvaderDeckAndSlotsProps) {
    const imgHeight = 2440;
    const imgWidth = 1580;
    const aspectRation = imgWidth / imgHeight;

    const [isDialogShown, setDialogShown] = React.useState(false)
    const availableCards = props.invaderDeck.filter(c => c.stack === "available");
    const exploreCards = props.invaderDeck.filter(c => c.stack === "explore");
    const buildCards = props.invaderDeck.filter(c => c.stack === "build");
    const rageCards = props.invaderDeck.filter(c => c.stack === "rage");
    return (
        <div className={style.InvaderDeckAndSlots__invaderSlotList}>
            <div className={style.InvaderDeckAndSlots__invaderSlot}
                style={{ height: props.divHeight_px, width: props.divHeight_px * aspectRation }}
                onClick={() => setDialogShown(true)}
            >
                {availableCards.length > 0 &&
                    (<InvaderCard
                        card={availableCards[0]}
                        divWidth_percent={1}
                    />)
                }
            </div>
            <div className={style.InvaderDeckAndSlots__invaderSlot}
                style={{ height: props.divHeight_px, width: props.divHeight_px * aspectRation }}
                onClick={() => setDialogShown(true)}
            >
                {exploreCards.map((c, idx) =>
                (<InvaderCard
                    key={c.id + 10 * c.stage}
                    card={c}
                    divWidth_percent={1 / exploreCards.length}
                />)
                )}
            </div>
            <div className={style.InvaderDeckAndSlots__invaderSlot}
                style={{ height: props.divHeight_px, width: props.divHeight_px * aspectRation }}
                onClick={() => setDialogShown(true)}
            >
                {buildCards.map((c, idx) =>
                (<InvaderCard
                    key={c.id + 10 * c.stage}
                    card={c}
                    divWidth_percent={1 / buildCards.length}
                />)
                )}
            </div>
            <div className={style.InvaderDeckAndSlots__invaderSlot}
                style={{ height: props.divHeight_px, width: props.divHeight_px * aspectRation }}
                onClick={() => setDialogShown(true)}
            >
                {rageCards.map((c, idx) =>
                (<InvaderCard
                    key={c.id + 10 * c.stage}
                    card={c}
                    divWidth_percent={1 / rageCards.length}
                />)
                )}
            </div>
            {isDialogShown && <InvaderDeckDialog {...props} hideDialog={() => setDialogShown(false)} />}
        </div>
    );
}