import * as React from "react";


import style from "./style.module.scss";


import { BoardToken, PlacedToken as PlacedToken, TokenNames, TokenType } from "game/MainPhase";
import inside from "point-in-polygon";
import { LandOutline } from "../../Boards/LandOutline";
import { BoardDragDrop } from "helper/BoardDragDrop";
import classnames from "classnames"
import { IncreaseDecreaseButton } from "../../IncreaseDecreaseButton";
import { Board, BoardPlacement } from "game/SetupPhase";
import { TokenOnBoard } from "../TokenOnBoard";
import { AddNewTokenButton } from "../AddNewTokenButton";


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

interface SelectedToken {
    board: string,
    land: number,
    token: TokenType
}

interface LandTokensProps {
    boardTokens: BoardToken
    boardPos: Board & BoardPlacement
    selectedToken?: SelectedToken
    onSelectToken: (s: SelectedToken | undefined) => void
    onIncreaseToken: (boardName: string, landNumber: number, tokenType: TokenType) => void;
    onDecreaseToken: (boardName: string, landNumber: number, tokenType: TokenType) => void;
    showDialog: (data?: { title: string, content: JSX.Element }) => void;
}

export class LandTokens extends React.Component<LandTokensProps>{
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

        const padding = 15;//px;

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
        const bt = this.props.boardTokens;
        //for each land
        return bt.lands.map(l => {
            //get token position
            const polyAbs = LandOutline[bt.boardName][l.landNumber].map(point => {
                const { x, y } = BoardDragDrop.rotateBy({ x: point[0], y: point[1] }, this.props.boardPos.rotation);
                return [x + this.props.boardPos.position.x, y + this.props.boardPos.position.y];
            });
            let tokenSizes = tokenContainerSizes[0];
            let tokensAndNew = Array.from(l.tokens);
            //add one extra token for the newTokenButton
            tokensAndNew.push({ count: 1, tokenType: "Badlands" });
            let tokenPos = this.getTokenPosition(tokensAndNew, polyAbs, tokenSizes);
            // try to fit tokens into the land, with different tokenSizes
            for (let i = 1; i < tokenContainerSizes.length; i++) {
                //break the loop and keet the current tokenSize
                if (tokenPos) {
                    break;
                }
                tokenSizes = tokenContainerSizes[i];
                tokenPos = this.getTokenPosition(tokensAndNew, polyAbs, tokenSizes);
            }
            //if all token sizes have been tried, show an error message.
            if (!tokenPos) {
                console.log("Could not fit tokens (" + tokensAndNew.map(t => t.count + " " + t.tokenType) + ") into land: " + bt.boardName + l.landNumber);
                return (<div style={{ left: polyAbs[0][0], top: polyAbs[0][1], position: "absolute" }}>ERROR</div>);
            }
            //make list constant, to use it in map loop
            const cTokenPos = tokenPos;
            //generate token elements
            const tokens = l.tokens.map((t, idx) => {
                //prepare per element style with absolut position
                let customStyle: React.CSSProperties = {};
                customStyle.left = cTokenPos[idx].left;
                customStyle.top = cTokenPos[idx].top;
                const isSelected = this.props.selectedToken?.board === bt.boardName &&
                    this.props.selectedToken?.land === l.landNumber &&
                    this.props.selectedToken?.token === t.tokenType;
                return <TokenOnBoard token={t} selected={isSelected}
                    id={bt.boardName + l.landNumber + t.tokenType}
                    key={bt.boardName + l.landNumber + t.tokenType}
                    //callbacks for increse and decrease
                    onIncrease={() => this.props.onIncreaseToken(bt.boardName, l.landNumber, t.tokenType)}
                    onDecrease={() => this.props.onDecreaseToken(bt.boardName, l.landNumber, t.tokenType)}
                    //class based on the calculated size
                    className={classnames(style.Tokens__token, tokenSizes.classname)}
                    //width of the increase/decrese buttons
                    buttonWidth={tokenSizes.buttonWidth}
                    //absolut position from calculated positions
                    style={customStyle}
                    //toggle increase/decrease buttons
                    onClick={() => {
                        if (isSelected) {
                            this.props.onSelectToken(undefined);
                        } else {
                            this.props.onSelectToken({ board: bt.boardName, land: l.landNumber, token: t.tokenType });
                        }
                    }} />;
            }); //end for each token
            return (
                <div id={"LandTokens_" + bt.boardName + l.landNumber} key={bt.boardName + l.landNumber}>
                    {tokens}
                    <AddNewTokenButton
                        //use extra added tokenpos
                        position={cTokenPos[cTokenPos.length - 1]}
                        className={tokenSizes.classname}
                        showDialog={this.props.showDialog}
                        availableTokens={TokenNames.filter(token => !l.tokens.some(usedtoken => usedtoken.tokenType === token))}
                        onIncreaseToken={(type) => this.props.onIncreaseToken(bt.boardName, l.landNumber, type)}
                    />
                </div>
            );
        }); //end for each lands
    }
}
