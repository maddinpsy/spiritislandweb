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
import Badlands from "assets/icons/Badlands.png"
import City from "assets/icons/Citiyicon.png"
import Explorer from "assets/icons/Explorericon.png"
import Town from "assets/icons/Townicon.png"
import Beast from "assets/icons/Beasticon.png"
import Dahan from "assets/icons/Dahanicon.png"
import Presence from "assets/icons/Presenceicon.png"
import Wild from "assets/icons/Wildicon.png"
import Blight from "assets/icons/Blighticon.png"
import Disease from "assets/icons/Diseaseicon.png"

import createPanZoom, { PanZoom } from "panzoom";
import { BoardToken, placedToken as PlacedToken } from "game/MainPhase";
import inside from "point-in-polygon";
import { LandOutline } from "./LandOutline";
import { BoardDragDrop } from "helper/BoardDragDrop";
import classnames from "classnames"

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
        classname: style.Boards__tokensNormal,
        height: 30, //px
        baseSize: 50, //px
        extraDigi: 10 //px
    },
    { //small
        classname: style.Boards__tokensSmall,
        height: 20, //px
        baseSize: 30, //px
        extraDigi: 7 //px
    },
    { //tiny
        classname: style.Boards__tokensTiny,
        height: 10, //px
        baseSize: 20, //px
        extraDigi: 3 //px
    }
]

interface BoardsProps {
    usedBoards: (Board & BoardPlacement)[]
    boardTokens?: BoardToken[]
}

function Token(props: React.HTMLAttributes<HTMLDivElement> & { token: PlacedToken }) {
    let image;
    switch(props.token.tokenType){
            case "Explorer":
                image=Explorer;
                break;
            case "Town":
                image=Town;
                break;
            case "City":
                image=City;
                break;
            case "Dahan":
                image=Dahan;
                break;
            case "Blight":
                image=Blight;
                break;
            case "Presence1":
                image=Presence;
                break;
            case "Presence2":
                image=Presence;
                break;
            case "Presence3":
                image=Presence;
                break;
            case "Presence4":
                image=Presence;
                break;
            case "Presence5":
                image=Presence;
                break;
            case "Presence6":
                image=Presence;
                break;
            case "Wild":
                image=Wild;
                break;
            case "Beast":
                image=Beast;
                break;
            case "Disease":
                image=Disease;
                break;
            case "Badlands":
                image=Badlands;
                break;
    }
    const tokenImgae = <img src={image} alt={props.token.tokenType} className={style.Boards__tokensImage}/>
    return (
        <div {...props}>
            {props.token.count}x{tokenImgae}
        </div>
    );
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

    getLeftMostIntersection(currentTop: number, polygon: number[][]): number {
        let intersectionX = polygon
            //get lines
            .map((point, idx) => [point, polygon[(idx + 1) % polygon.length]])
            //get point at given y-value
            .map(line => {
                //special case- horizontal line
                if (line[0][1] === line[1][1]) {
                    //line at current top
                    if (line[0][1] === currentTop) {
                        return Math.min(line[0][0], line[1][0]);
                    } else {
                        return Infinity;
                    }
                } else {
                    //currentTop = start + lambda*(end-start)
                    const lambda = (currentTop - line[0][1]) / (line[1][1] - line[0][1]);
                    //is point between start and end
                    if (lambda <= 1 && lambda >= 0) {
                        return line[0][0] + lambda * (line[1][0] - line[0][0]);
                    } else {
                        return Infinity
                    }
                }
            })
            .reduce((mostLeft, intersectionXValue) => {
                return Math.min(mostLeft, intersectionXValue);
            }, Infinity)
        return intersectionX;
    }

    /**
     * Calculates the position of the given tokens inside the poligon.
     * @param tokens the tokens: defined by type and count.
     * @param polygon the poligon given as array of points, each point is [x,y].
     * @param tokensize the size of the tokens. It is assumed, all tokens have the same size.
     * @returns array the same size as tokens parameter. 
     */
    getTokenPosition(tokens: PlacedToken[], polygon: number[][], tokeSize: TokenSize)
        : { top: number, left: number }[] | undefined {
        //Basic Idea:
        //0. start from top of poligon
        //1. set current top
        //2. find first intersection from left
        //3. place tokens until one gose outside of polygon
        //4. increase current top
        //repeat 1..4 until all tokens placed
        //if 2. dosn't find an intersection from the left: 
        //   decreese token size and start again.

        const padding = 5;//px;

        let sizeIdx = 0;
        let currentToken = 0;
        let claculatedPositions = tokens.map(_ => { return { left: 0, top: 0 } });
        //find top of polygon (0)
        let currentTop = polygon.reduce((miny, point) => Math.min(miny, point[1]), Infinity);
        currentTop += padding;
        while (currentToken < tokens.length) {
            //find intersection from the left (2)
            let intersectionX = this.getLeftMostIntersection(currentTop, polygon);
            //check intersection found
            if (intersectionX === Infinity) {
                //couldn't find next line
                //tokens did not fit into polygon
                return undefined
            }
            intersectionX += padding;

            //place tokens in this line
            while (currentToken < tokens.length) {
                let tokenWidth = tokeSize.baseSize;
                tokenWidth += tokeSize.extraDigi;
                //check token in polygon
                if ( // top right
                    inside([intersectionX + tokenWidth + padding, currentTop], polygon) &&
                    //top left
                    inside([intersectionX + tokenWidth + padding, currentTop + tokeSize.height], polygon)) {
                    claculatedPositions[currentToken].left = intersectionX;
                    claculatedPositions[currentToken].top = currentTop;
                    intersectionX += tokenWidth
                    currentToken++;
                } else {
                    //token dosn't fit into this line
                    currentTop += tokeSize.height;
                    //break out of inner loop
                    break;
                }
            }
        }
        return claculatedPositions;
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
                    const boardPos = this.props.usedBoards.find(b => b.name === bt.boardName);
                    if (!boardPos) {
                        console.log("Could not find board: " + bt.boardName);
                        return (<div>ERROR</div>);
                    }
                    const lands = bt.lands.map(l => {
                        //get token position
                        const polyAbs = LandOutline[bt.boardName][l.landNumber].map(point => {
                            const { x, y } = BoardDragDrop.rotateBy({ x: point[0], y: point[1] }, boardPos.rotation);
                            return [x + boardPos.position.x, y + boardPos.position.y];
                        })
                        let tokenSizes = tokenContainerSizes[0];
                        let tokenPos = this.getTokenPosition(l.tokens, polyAbs, tokenSizes);
                        for (let i = 1; i < tokenContainerSizes.length; i++) {
                            if (tokenPos) {
                                break;
                            }
                            tokenSizes = tokenContainerSizes[i];
                            tokenPos = this.getTokenPosition(l.tokens, polyAbs, tokenSizes);
                        }
                        if (!tokenPos) {
                            console.log("Could not fit tokens (" + l.tokens.map(t => t.count + " " + t.tokenType) + ") into land: " + bt.boardName + l.landNumber);
                            return (<div style={{ left: polyAbs[0][0], top: polyAbs[0][1], position: "absolute" }}>ERROR</div>);
                        }
                        const cTokenPos = tokenPos;
                        //generate token elements
                        const tokens = l.tokens.map((t, idx) => {
                            let customStyle: React.CSSProperties = {};
                            customStyle.left = cTokenPos[idx].left;
                            customStyle.top = cTokenPos[idx].top;
                            return <Token token={t}
                                id={bt.boardName + l.landNumber + t.tokenType}
                                key={bt.boardName + l.landNumber + t.tokenType}
                                className={classnames(style.Boards__token, tokenSizes.classname)}
                                style={customStyle}
                            />
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
