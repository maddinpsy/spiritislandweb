import * as React from "react";


import style from "./style.module.scss";

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

import { BoardToken, PlacedToken as PlacedToken, TokenType } from "game/MainPhase";
import inside from "point-in-polygon";
import { LandOutline } from "../Boards/LandOutline";
import { BoardDragDrop } from "helper/BoardDragDrop";
import classnames from "classnames"
import { IncreaseDecreaseButton } from "../IncreaseDecreaseButton";
import { Board, BoardPlacement } from "game/SetupPhase";


/** Defines the hardcoded sizes for the token containers. These are used to fit the tokens into the land polygons. */

interface TokenSize {
    classname: string
    height: number
    baseSize: number
    buttonWidth: number
    extraDigi: number
}
const tokenContainerSizes: TokenSize[] = [
    { //normal
        classname: style.Tokens__tokensNormal,
        height: 66, //px
        baseSize: 66, //px
        buttonWidth: 18, //px
        extraDigi: 42 //px
    },
    { //small
        classname: style.Tokens__tokensSmall,
        height: 48, //px
        baseSize: 48, //px
        buttonWidth: 15, //px
        extraDigi: 33 //px
    },
    { //tiny
        classname: style.Tokens__tokensTiny,
        height: 33, //px
        baseSize: 33, //px
        buttonWidth: 12, //px
        extraDigi: 21 //px
    }
]
export interface TokenProps{
    token: PlacedToken
    buttonWidth: number
    selected: boolean

    onIncrease: () => void;
    onDecrease: () => void;
}

export function Token(props: React.HTMLAttributes<HTMLDivElement> & TokenProps) {
    let image;
    switch (props.token.tokenType) {
        case "Explorer":
            image = Explorer;
            break;
        case "Town":
            image = Town;
            break;
        case "City":
            image = City;
            break;
        case "Dahan":
            image = Dahan;
            break;
        case "Blight":
            image = Blight;
            break;
        case "Presence1":
            image = Presence;
            break;
        case "Presence2":
            image = Presence;
            break;
        case "Presence3":
            image = Presence;
            break;
        case "Presence4":
            image = Presence;
            break;
        case "Presence5":
            image = Presence;
            break;
        case "Presence6":
            image = Presence;
            break;
        case "Wild":
            image = Wild;
            break;
        case "Beast":
            image = Beast;
            break;
        case "Disease":
            image = Disease;
            break;
        case "Badlands":
            image = Badlands;
            break;
    }
    const tokenImgae = props.token.count > 0 && <img src={image} alt={props.token.tokenType} className={style.Tokens__tokensImage} />
    const count = props.token.count > 0 && props.token.count;

    return (
        <div {...props}>
            {count}{tokenImgae}
            {props.selected && <IncreaseDecreaseButton onIncrease={props.onIncrease} onDecrease={props.onDecrease} width={props.buttonWidth} />}
        </div>
    );
}

export interface TokensProps {
    boardTokens?: BoardToken[]
    usedBoards: (Board & BoardPlacement)[]

    onIncreaseToken: (boardName:string, landNumber:number, tokenType:TokenType) => void;
    onDecreaseToken: (boardName:string, landNumber:number, tokenType:TokenType) => void;
}

interface TokensState {
    selectedToken?: {
        board: string,
        land: number,
        token: TokenType
    }
}

export class Tokens extends React.Component<TokensProps, TokensState>
{

    constructor(props: any) {
        super(props);
        this.state = {}
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
                let tokenWidth = 0;
                if (tokens[currentToken].count > 0) {
                    tokenWidth += tokeSize.baseSize;
                    tokenWidth += tokeSize.extraDigi;
                    tokenWidth += tokeSize.buttonWidth;
                }
                if (tokens[currentToken].count > 9) {
                    tokenWidth += tokeSize.extraDigi;
                }
                //check token in polygon
                while (//bottom left is not insied
                    !inside([intersectionX - padding, currentTop + tokeSize.height], polygon) &&
                    //bottom right is insied
                    inside([intersectionX + tokenWidth + padding, currentTop + tokeSize.height], polygon)
                ) {
                    //move to the left
                    intersectionX += padding;

                }
                if ( // top right
                    inside([intersectionX + tokenWidth + padding, currentTop], polygon) &&
                    //bottom right
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

        let boardTokens = undefined;
        if (this.props.boardTokens)
            boardTokens = this.props.boardTokens
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
                            const isSelected = this.state.selectedToken?.board === bt.boardName &&
                                this.state.selectedToken?.land === l.landNumber &&
                                this.state.selectedToken?.token === t.tokenType;
                            return <Token token={t} selected={isSelected}
                                id={bt.boardName + l.landNumber + t.tokenType}
                                key={bt.boardName + l.landNumber + t.tokenType}
                                onIncrease={()=>this.props.onIncreaseToken(bt.boardName,l.landNumber,t.tokenType)}
                                onDecrease={()=>this.props.onDecreaseToken(bt.boardName,l.landNumber,t.tokenType)}
                                className={classnames(style.Tokens__token, tokenSizes.classname)}
                                buttonWidth={tokenSizes.buttonWidth}
                                style={customStyle}
                                onClick={() => {
                                    if (isSelected) {
                                        this.setState({ selectedToken: undefined })
                                    } else {
                                        this.setState({ selectedToken: { board: bt.boardName, land: l.landNumber, token: t.tokenType } })
                                    }
                                }
                                }
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
            <div className={style.Tokens__container}>
                {boardTokens}
            </div>
        );
    }
}
