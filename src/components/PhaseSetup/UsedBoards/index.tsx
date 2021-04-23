import * as React from "react";

import { Board, BoardPlacement, Line, Point } from "game/SetupPhase";

import { AvailBoardDragData } from "../AvailableBoards";
import { SpiritDragData } from "../AlailableSpirits";

import style from "./style.module.scss";
import boardA from "assets/Board A.png"
import boardB from "assets/Board B.png"
import boardC from "assets/Board C.png"
import boardD from "assets/Board D.png"
import boardE from "assets/Board E.png"
import boardF from "assets/Board F.png"
import { BoardDragDrop } from "helper/BoardDragDrop";


const boardImages: { [key: string]: string } = { "A": boardA, "B": boardB, "C": boardC, "D": boardD, "E": boardE, "F": boardF }

export interface UsedBoardDragData {
    type: "usedBoard"
    boardName: string
}

export type GeneralDragData = UsedBoardDragData | AvailBoardDragData | SpiritDragData

interface UsedBoardsProps {
    availBoards: Board[]
    usedBoards: (Board & BoardPlacement)[]
    doPlaceBoard: (boardName: string, place: BoardPlacement) => void
    doPlaceSpirit: (spiritIdx: number, boardName: string) => void
}

export class UsedBoards extends React.Component<UsedBoardsProps>
{
    divContainerRef: React.RefObject<HTMLDivElement>
    markerRef1: React.RefObject<HTMLDivElement>
    boardRefs: { [boardName: string]: React.RefObject<HTMLDivElement> };

    constructor(props: any) {
        super(props);
        this.divContainerRef = React.createRef();
        this.markerRef1 = React.createRef();
        this.boardRefs = {};
        Object.keys(boardImages).forEach((key) => { this.boardRefs[key] = React.createRef() });
        this.onDrop = this.onDrop.bind(this);
        this.onDragOver = this.onDragOver.bind(this);
    }

    onDrop(event: React.DragEvent<HTMLDivElement>) {
        event.preventDefault();
        //Always hide marker
        const marker1 = this.markerRef1.current;
        if (marker1) {
            marker1.style.display = "none"
        }

        const jsonData = event.dataTransfer.getData("text");
        const transferData = JSON.parse(jsonData) as GeneralDragData;
        if (transferData.type === "spirit") {
            //drop spirit, if mouse is insied of board
            const onBoard = this.props.usedBoards.find(b => BoardDragDrop.insidBoard(event.clientX, event.clientY, b));
            if (onBoard) {
                this.props.doPlaceSpirit(transferData.spiritId, onBoard.name);
            }
        } else {
            //drop board
            const boardName = transferData.boardName;
            const placement = BoardDragDrop.getNewDropPosition(this.props.usedBoards, this.props.availBoards, boardName, [event.clientX, event.clientY]);
            if (placement) {
                this.props.doPlaceBoard(boardName, placement);
            }
        }
    }

    onDragOver(event: React.DragEvent<HTMLDivElement>) {
        event.preventDefault();
        let marker1 = this.markerRef1.current;
        if (marker1) {
            marker1.style.display = "none"
        } else {
            //marker ref not found
            return;
        }

        const jsonData = event.dataTransfer.getData("text");
        const transferData = JSON.parse(jsonData) as GeneralDragData;
        if (transferData.type === "spirit") return;
        const boardName = transferData.boardName;

        // show marker at found anchor
        const hintPlace = BoardDragDrop.getAnchorHint(this.props.usedBoards, this.props.availBoards, boardName, [event.clientX, event.clientY]);
        if (hintPlace) {
            marker1.style.left = hintPlace.position.x + "px";
            marker1.style.top = hintPlace.position.y + "px"
            marker1.style.transform = "rotate(" + hintPlace.rotation + "deg)";
            marker1.style.display = "block"
        }
    }

    private rotateBoard(boardName: string, clockwise: boolean) {
        const newPlacement = BoardDragDrop.rotateBoard(this.props.usedBoards, boardName, clockwise);
        if (newPlacement) {
            this.props.doPlaceBoard(boardName, newPlacement);
        }
    }

    render() {
        const usedBoards = this.props.usedBoards.map(b => {
            let customStyle: React.CSSProperties = {};
            customStyle.left = b.position.x;
            customStyle.top = b.position.y;
            customStyle.transform = "rotate(" + b.rotation + "deg)";
            return (
                <div className={style.IslandArea__usedBoard} style={customStyle} key={b.name}
                    draggable="true"
                    onDragStart={(ev) => {
                        const data: UsedBoardDragData = {
                            type: "usedBoard",
                            boardName: b.name
                        }
                        ev.dataTransfer.setData("text", JSON.stringify(data))
                    }}
                    onDragEnd={(ev) => {
                        const marker1 = this.markerRef1.current;
                        if (marker1) {
                            marker1.style.display = "none"
                        }
                    }}
                    ref={this.boardRefs[b.name]}
                >
                    <div className={style.IslandArea__onBoardButton} style={{ right: "60px" }} onClick={() => this.rotateBoard(b.name, false)}>&#x2b6f;</div>
                    <div className={style.IslandArea__onBoardButton} style={{ right: "100px" }} onClick={() => this.rotateBoard(b.name, true)}>&#x2b6e;</div>
                    <img src={boardImages[b.name]} alt={b.name} className={style.IslandArea__image} draggable="false" />
                </div>
            )
        });


        return (
            <div ref={this.divContainerRef} className={style.IslandArea__boardArea}
                onDrop={this.onDrop}
                onDragOver={this.onDragOver}
            >
                {usedBoards}
                <div ref={this.markerRef1} className={style.IslandArea__marker}>[x]</div>
            </div>
        );
    }
}