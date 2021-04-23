import * as React from "react";

import { Board, BoardPlacement, Point, SetupSpirit } from "game/SetupPhase";

import { spiritImages } from "../AlailableSpirits";

import style from "./style.module.scss";
import boardA from "assets/Board A.png"
import boardB from "assets/Board B.png"
import boardC from "assets/Board C.png"
import boardD from "assets/Board D.png"
import boardE from "assets/Board E.png"
import boardF from "assets/Board F.png"


const boardImages: { [key: string]: string } = { "A": boardA, "B": boardB, "C": boardC, "D": boardD, "E": boardE, "F": boardF }

interface UsedSpiritsProps {
    setupSpirits: SetupSpirit[]
    usedBoards: (Board & BoardPlacement)[]
}


export class UsedSpirits extends React.Component<UsedSpiritsProps>
{

    constructor(props: any) {
        super(props);
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

    render() {
        const usedSpirits = this.props.setupSpirits.map((s, idx) => {
            let customStyle: React.CSSProperties = {};
            const board = this.props.usedBoards.find(b => b.name == s.curretBoard);
            if (!board) return;
            const center_abs = this.getBoardCenterAbs(board);

            //image size is hardcoded to 150px in css
            //subtract 75 to center it.
            customStyle.left = center_abs.x - 75;
            customStyle.top = center_abs.y - 75;

            return (
                <div className={style.UsedSpirit__imageContainer} style={customStyle} key={s.name}>
                    <img src={spiritImages[idx]} alt={s.name} className={style.UsedSpirit__image} draggable="false" />
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
