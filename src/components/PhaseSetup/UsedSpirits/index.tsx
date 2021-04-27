import * as React from "react";

import { Board, BoardPlacement, Point, SetupSpirit } from "game/GamePhaseSetup";

import { SpiritDragData } from "../AlailableSpirits";

import style from "./style.module.scss";
import { GeneralDragData } from "../UsedBoards";
import { BoardDragDrop } from "helper/BoardDragDrop";


interface UsedSpiritsProps {
    setupSpirits: SetupSpirit[]
    usedBoards: (Board & BoardPlacement)[]
    doPlaceSpirit: (spiritIdx: number, boardName: string) => void
}


export class UsedSpirits extends React.Component<UsedSpiritsProps>
{

    constructor(props: any) {
        super(props);
        this.onDragOver = this.onDragOver.bind(this);
        this.onDrop = this.onDrop.bind(this);
    }

    /** returns the absolut center of the rotated board.*/
    getBoardCenterAbs(board: Board & BoardPlacement): Point {
        const center_x = (board.anchors[0].start.x + board.anchors[1].start.x + board.anchors[2].start.x + board.anchors[2].end.x) / 4;
        const center_y = (board.anchors[0].start.y + board.anchors[1].start.y + board.anchors[2].start.y + board.anchors[2].end.y) / 4;
        const sinPhiDragged = Math.sin(board.rotation / 180 * Math.PI);
        const cosPhiDragged = Math.cos(board.rotation / 180 * Math.PI);
        const rotx = center_x * cosPhiDragged - center_y * sinPhiDragged;
        const roty = center_x * sinPhiDragged + center_y * cosPhiDragged;
        return { x: rotx + board.position.x, y: roty + board.position.y }
    }

    onDrop(event: React.DragEvent<HTMLDivElement>) {
        event.preventDefault();

        const jsonData = event.dataTransfer.getData("text");
        const transferData = JSON.parse(jsonData) as GeneralDragData;
        if (transferData.type === "spirit") {
            //excahnge spirits when dropped on each other.
            const onBoard = this.props.usedBoards.find(b => BoardDragDrop.insidBoard(event.clientX, event.clientY, b));
            if (onBoard) {
                this.props.doPlaceSpirit(transferData.spiritId, onBoard.name);
            }
        }
    }
    onDragOver(event: React.DragEvent<HTMLDivElement>) {
        event.preventDefault();
    }
    render() {
        const usedSpirits = this.props.setupSpirits.map((s, idx) => {
            let customStyle: React.CSSProperties = {};
            const board = this.props.usedBoards.find(b => b.name == s.curretBoard);
            if (!board) {
                //spirit not on a board, move to the right
                //this is a hack, to make the remove and add spirit animation
                //it only works with css of UsedSpirit__imageContainer 
                customStyle.left = "110%";
                customStyle.top = "30%";
            } else {
                //spirit is on a board
                const center_abs = this.getBoardCenterAbs(board);

                //image size is hardcoded to 150px in css
                //subtract 75 to center it.
                customStyle.left = center_abs.x - 75;
                customStyle.top = center_abs.y - 75;
            }
            return (
                <div className={style.UsedSpirit__imageContainer} style={customStyle} key={s.name}
                    draggable="true"
                    onDragStart={(ev) => {
                        let data: SpiritDragData =
                        {
                            type: "spirit",
                            spiritId: idx
                        }
                        ev.dataTransfer.setData("text", JSON.stringify(data))
                    }}
                    onDrop={this.onDrop}
                    onDragOver={this.onDragOver}
                >
                    <img src={s.logoUrl} alt={s.name} className={style.UsedSpirit__image} draggable="false" />
                </div>
            )
        });

        return (
            <div className={style.UsedSpirit__boardArea}>
                {usedSpirits}
            </div>
        );
    }
}
