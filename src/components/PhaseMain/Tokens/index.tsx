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

import { BoardToken, PlacedToken as PlacedToken, TokenNames, TokenType } from "game/MainPhase";
import inside from "point-in-polygon";
import { LandOutline } from "../Boards/LandOutline";
import { BoardDragDrop } from "helper/BoardDragDrop";
import classnames from "classnames"
import { IncreaseDecreaseButton } from "../IncreaseDecreaseButton";
import { Board, BoardPlacement } from "game/SetupPhase";
import { ModalWindow } from "components/ModalWindow";


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

export function TokenImage(props: { tokenType: TokenType }) {
    let image;
    switch (props.tokenType) {
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
    return <img src={image} alt={props.tokenType} className={style.Tokens__tokensImage} />
}

export interface TokenProps {
    token: PlacedToken
    buttonWidth: number
    selected: boolean

    onIncrease: () => void;
    onDecrease: () => void;
}

export function Token(props: React.HTMLAttributes<HTMLDivElement> & TokenProps) {

    const tokenImgae = props.token.count > 0 && <TokenImage tokenType={props.token.tokenType} />
    const count = props.token.count > 0 && props.token.count;

    return (
        <div {...props}>
            {count}{tokenImgae}
            {props.selected && <IncreaseDecreaseButton onIncrease={props.onIncrease} onDecrease={props.onDecrease} width={props.buttonWidth} />}
        </div>
    );
}

interface AddNewTokenButtonProps {
    position: { left: number, top: number }
    className: string
    availableTokens: TokenType[]
    showDialog: (data?: { title: string, content: JSX.Element }) => void;
    onIncreaseToken: (tokenType: TokenType) => void;
}


class AddNewTokenButton extends React.Component<AddNewTokenButtonProps>{

    render() {
        if (this.props.availableTokens.length === 0) {
            return <div />;
        }
        const popup = (
            <div className={style.Tokens__newTokensContainer}>
                {this.props.availableTokens.map(token => {
                    return (
                        <div
                            className={style.Tokens__newToken}
                            key={token}
                            onClick={() => {
                                this.props.onIncreaseToken(token);
                                this.props.showDialog();
                            }
                            }
                        >
                            <TokenImage tokenType={token} /> {token.toString()}
                        </div>
                    )
                })}
            </div>
        )
        return (
            <div
                className={classnames(this.props.className, style.Tokens__newTokenButton)}
                style={{ ...this.props.position }}
                onClick={() => this.props.showDialog({ title: "Add new Token", content: popup })}
            >
                +
            </div>
        );
    }
}

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

class LandTokens extends React.Component<LandTokensProps>{
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
        return bt.lands.map(l => {
            //get token position
            const polyAbs = LandOutline[bt.boardName][l.landNumber].map(point => {
                const { x, y } = BoardDragDrop.rotateBy({ x: point[0], y: point[1] }, this.props.boardPos.rotation);
                return [x + this.props.boardPos.position.x, y + this.props.boardPos.position.y];
            });
            let tokenSizes = tokenContainerSizes[0];
            let tokensAndNew = Array.from(l.tokens);
            tokensAndNew.push({ count: 1, tokenType: "Badlands" });
            let tokenPos = this.getTokenPosition(tokensAndNew, polyAbs, tokenSizes);
            for (let i = 1; i < tokenContainerSizes.length; i++) {
                if (tokenPos) {
                    break;
                }
                tokenSizes = tokenContainerSizes[i];
                tokenPos = this.getTokenPosition(tokensAndNew, polyAbs, tokenSizes);
            }
            if (!tokenPos) {
                console.log("Could not fit tokens (" + tokensAndNew.map(t => t.count + " " + t.tokenType) + ") into land: " + bt.boardName + l.landNumber);
                return (<div style={{ left: polyAbs[0][0], top: polyAbs[0][1], position: "absolute" }}>ERROR</div>);
            }
            const cTokenPos = tokenPos;
            //generate token elements
            const tokens = l.tokens.map((t, idx) => {
                let customStyle: React.CSSProperties = {};
                customStyle.left = cTokenPos[idx].left;
                customStyle.top = cTokenPos[idx].top;
                const isSelected = this.props.selectedToken?.board === bt.boardName &&
                    this.props.selectedToken?.land === l.landNumber &&
                    this.props.selectedToken?.token === t.tokenType;
                return <Token token={t} selected={isSelected}
                    id={bt.boardName + l.landNumber + t.tokenType}
                    key={bt.boardName + l.landNumber + t.tokenType}
                    onIncrease={() => this.props.onIncreaseToken(bt.boardName, l.landNumber, t.tokenType)}
                    onDecrease={() => this.props.onDecreaseToken(bt.boardName, l.landNumber, t.tokenType)}
                    className={classnames(style.Tokens__token, tokenSizes.classname)}
                    buttonWidth={tokenSizes.buttonWidth}
                    style={customStyle}
                    onClick={() => {
                        if (isSelected) {
                            this.props.onSelectToken(undefined);
                        } else {
                            this.props.onSelectToken({ board: bt.boardName, land: l.landNumber, token: t.tokenType });
                        }
                    }} />;
            });
            return (
                <div id={"LandTokens_" + bt.boardName + l.landNumber} key={bt.boardName + l.landNumber}>
                    {tokens}
                    <AddNewTokenButton
                        position={cTokenPos[cTokenPos.length - 1]}
                        className={tokenSizes.classname}
                        showDialog={this.props.showDialog}
                        availableTokens={TokenNames.filter(token => !l.tokens.some(usedtoken => usedtoken.tokenType === token))}
                        onIncreaseToken={(type) => this.props.onIncreaseToken(bt.boardName, l.landNumber, type)}
                    />
                </div>
            );
        });
    }
}

export interface TokensProps {
    boardTokens?: BoardToken[]
    usedBoards: (Board & BoardPlacement)[]

    onIncreaseToken: (boardName: string, landNumber: number, tokenType: TokenType) => void;
    onDecreaseToken: (boardName: string, landNumber: number, tokenType: TokenType) => void;
    showDialog: (data?: { title: string, content: JSX.Element }) => void;
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
                    return <div id={"BoardTokens_" + bt.boardName} key={bt.boardName}>
                        <LandTokens boardTokens={bt} boardPos={boardPos}
                            selectedToken={this.state.selectedToken}
                            onSelectToken={(s) => { this.setState({ selectedToken: s }) }}
                            onIncreaseToken={this.props.onIncreaseToken}
                            onDecreaseToken={this.props.onDecreaseToken}
                            showDialog={this.props.showDialog}
                        />
                    </div>
                });

        return (
            <div className={style.Tokens__container}>
                {boardTokens}
            </div>
        );
    }

}
