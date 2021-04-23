import * as React from "react";

import { Board, BoardPlacement } from "game/SetupPhase";

import style from "./style.module.scss";


import alignCenterImg from "assets/router.svg"
import boardA from "assets/Board A.png"
import boardB from "assets/Board B.png"
import boardC from "assets/Board C.png"
import boardD from "assets/Board D.png"
import boardE from "assets/Board E.png"
import boardF from "assets/Board F.png"
import createPanZoom, { PanZoom } from "panzoom";
import { BoardToken, placedToken } from "game/MainPhase";


const boardImages: { [key: string]: string } = { "A": boardA, "B": boardB, "C": boardC, "D": boardD, "E": boardE, "F": boardF }

/** Defines the hardcoded sizes for the token containers. These are used to fit the tokens into the land polygons. */

interface TokenSize {
    classname: string
    height: number
    baseSize: number
    extraDigi: number
}
const tokenContainerSizes: TokenSize[] = [
    { //normal
        classname: "tokens_normal",
        height: 30, //px
        baseSize: 30, //px
        extraDigi: 10 //px
    },
    { //small
        classname: "tokens_small",
        height: 20, //px
        baseSize: 20, //px
        extraDigi: 7 //px
    },
    { //tiny
        classname: "tokens_tiny",
        height: 10, //px
        baseSize: 10, //px
        extraDigi: 3 //px
    }
]

interface BoardsProps {
    usedBoards: (Board & BoardPlacement)[]
    boardTokens?: BoardToken[]
}

export class Boards extends React.Component<BoardsProps>
{
    boardAreaRef: React.RefObject<HTMLDivElement>
    panZoomObject: PanZoom | undefined
    boardRefs: { [boardName: string]: React.RefObject<HTMLDivElement> };

    constructor(props: any) {
        super(props);
        this.boardAreaRef = React.createRef();
        this.boardRefs = {};
        Object.keys(boardImages).forEach((key) => { this.boardRefs[key] = React.createRef() });
    }

    componentDidMount() {
        if (this.boardAreaRef.current) {
            this.panZoomObject = createPanZoom(this.boardAreaRef.current)
        }
    }
    resetPanZoom() {
        if (this.panZoomObject && this.boardAreaRef.current?.parentElement) {
            /* Nice Try...
            //get min/max pos of all board cordner
            const boardSize = this.props.usedBoards.reduce((minmax, board) => {
                return BoardDragDrop.absolutCorners(board)
                    .reduce((minmax2, corner) => {
                        if (corner[0] < minmax2.min[0]) {
                            minmax2.min[0] = corner[0];
                        }
                        if (corner[1] < minmax2.min[1]) {
                            minmax2.min[1] = corner[1];
                        }
                        if (corner[0] > minmax2.max[0]) {
                            minmax2.max[0] = corner[0];
                        }
                        if (corner[1] > minmax2.max[1]) {
                            minmax2.max[1] = corner[1];
                        }
                        return minmax2;
                    }, minmax)
            }, { min: [Infinity, Infinity], max: [-Infinity, -Infinity] });

            //zoom and pan that all points are in view 
            const containerRect = this.boardAreaRef.current.parentElement.getBoundingClientRect();
            //zoom is ContainerSize/BoardSize
            const zoom = Math.min(containerRect.width / (boardSize.max[0] - boardSize.min[0]),
                containerRect.height / (boardSize.max[1] - boardSize.min[1]))
            this.panZoomObject.zoomAbs(0, 0, zoom);
            //pan board center on container center
            const containerCenter = [0, 0];//[containerRect.width / 2, containerRect.height / 2];
            const boardCenter = [(boardSize.max[0] - boardSize.min[0]) / 2, (boardSize.max[1] - boardSize.min[1]) / 2]
            this.panZoomObject.moveTo(containerCenter[0] - boardCenter[0], containerCenter[1] - boardCenter[1]);
            */
            this.panZoomObject.zoomAbs(0, 0, 1);
            this.panZoomObject.moveTo(-300, 0);
        }
    }

    getTokenPosition(tokens: placedToken[], polygon: number[][])
        : { tokensize: TokenSize, positions: { top: number, left: number }[] } {
        //Basic Idea:
        //0. start from top of poligon
        //1. set current top
        //2. find first intersection from left
        //3. place tokens until one gose outside of polygon
        //4. increase current top
        //repeat 1..4 until all tokens placed
        //if 2. dosn't find an intersection from the left: 
        //   decreese token size and start again.

        const padding = 10//px;
        const polyTop = polygon.reduce((miny, point) => Math.min(miny, point[1]), Infinity);
        

        return { tokensize: tokenContainerSizes[0], positions: [] }
    }

    render() {
        const usedBoards = this.props.usedBoards.map(b => {
            let customStyle: React.CSSProperties = {};
            customStyle.left = b.position.x;
            customStyle.top = b.position.y;
            customStyle.transform = "rotate(" + b.rotation + "deg)";
            return (
                <div
                    key={b.name}
                    ref={this.boardRefs[b.name]}
                    className={style.Boards__usedBoard}
                    style={customStyle}
                >
                    <img src={boardImages[b.name]} alt={b.name} className={style.Boards__image} draggable="false" />
                </div>
            )
        });

        let boardTokens = undefined;
        if (this.props.boardTokens)
            boardTokens = this.props.boardTokens
                .filter(bt => bt.boardName === "A")
                .map(bt => {
                    const lands = bt.lands.map(l => {
                        const tokens = l.tokens.map(t => {
                            let customStyle: React.CSSProperties = {};
                            customStyle.left = 0;
                            customStyle.top = 0;
                            return <div
                                id={bt.boardName + l.landNumber + t.tokenType}
                                key={bt.boardName + l.landNumber + t.tokenType}
                                className={style.Boards__token}
                                style={customStyle}
                            >
                                {t.count}x{t.tokenType}
                            </div>
                        })
                        return (
                            <div id={"LandTokens_" + bt.boardName + l.landNumber} key={bt.boardName + l.landNumber}>
                                {tokens}
                            </div>
                        )
                    })
                    return <div id={"BoardTokens_" + bt.boardName} key={bt.boardName}>{lands}</div>
                });

        return (
            <div className={style.Boards__container}>
                <div ref={this.boardAreaRef} className={style.Boards__boardArea}>
                    {usedBoards}
                    {boardTokens}
                </div>
                <img className={style.Boards__centerViewButton} src={alignCenterImg} alt="center" onClick={() => this.resetPanZoom()} />
            </div>
        );
    }
}
