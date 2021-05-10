import * as React from "react";

import { Board, BoardPlacement, Point } from "game/GamePhaseSetup";

import style from "./style.module.scss";


import alignCenterImg from "assets/router.svg"

import createPanZoom, { PanZoom } from "panzoom";
import { BoardToken, TokenType } from "game/GamePhaseMain";
import { BoardWithTokens } from "../BoardWithTokens";


/** Defines the hardcoded sizes for the token containers. These are used to fit the tokens into the land polygons. */

interface BoardsProps {
    usedBoards: (Board & BoardPlacement)[]
    boardTokens?: BoardToken[]
    presenceColors: string[]

    onIncreaseToken: (boardName: string, landNumber: number, tokenType: TokenType) => void;
    onDecreaseToken: (boardName: string, landNumber: number, tokenType: TokenType) => void;
    showDialog: (data?: { title: string, content: JSX.Element }) => void;
}

export class Boards extends React.Component<BoardsProps>
{
    boardAreaRef: React.RefObject<HTMLDivElement>
    panZoomObject: PanZoom | undefined

    constructor(props: BoardsProps) {
        super(props);
        this.boardAreaRef = React.createRef();
        this.state = {}
    }

    componentDidMount() {
        if (this.boardAreaRef.current) {
            this.panZoomObject = createPanZoom(this.boardAreaRef.current)
            this.resetPanZoom();
        }
    }
    resetPanZoom() {
        function rotateBy(p: Point, degree: number): Point {
            const sinPhiDragged = Math.sin(degree / 180 * Math.PI);
            const cosPhiDragged = Math.cos(degree / 180 * Math.PI);
            const newx = p.x * cosPhiDragged - p.y * sinPhiDragged;
            const newy = p.x * sinPhiDragged + p.y * cosPhiDragged;
            return { x: newx, y: newy }
        }
        if (this.panZoomObject && this.boardAreaRef.current?.parentElement) {
            const anchorScaling = 3;
            const padding = 200;//px
            //get all corner
            let conrners: number[][] = [];
            this.props.usedBoards.forEach(board => {
                const bottomLeft = rotateBy(board.anchors[0].start, board.rotation);
                const bottomRight = rotateBy(board.anchors[1].start, board.rotation);
                const topRight = rotateBy(board.anchors[2].start, board.rotation);
                const topLeft = rotateBy(board.anchors[2].end, board.rotation);
                conrners.push([bottomLeft.x * anchorScaling + board.position.x, bottomLeft.y * anchorScaling + board.position.y])
                conrners.push([bottomRight.x * anchorScaling + board.position.x, bottomRight.y * anchorScaling + board.position.y])
                conrners.push([topRight.x * anchorScaling + board.position.x, topRight.y * anchorScaling + board.position.y])
                conrners.push([topLeft.x * anchorScaling + board.position.x, topLeft.y * anchorScaling + board.position.y])
            });
            //get min/max pos of all board cordner
            const boardSize = conrners.reduce((minmax, corner) => {
                if (corner[0] < minmax.min[0]) {
                    minmax.min[0] = corner[0]
                }
                if (corner[1] < minmax.min[1]) {
                    minmax.min[1] = corner[1]
                }
                if (corner[0] > minmax.max[0]) {
                    minmax.max[0] = corner[0]
                }
                if (corner[1] > minmax.max[1]) {
                    minmax.max[1] = corner[1]
                }
                return minmax;
            }, { min: [Infinity, Infinity], max: [-Infinity, -Infinity] });
            //add custom padding
            boardSize.min[0] -= padding;
            boardSize.min[1] -= padding;
            boardSize.max[0] += padding;
            boardSize.max[1] += padding;
            //create a rect object for panzoom
            let c = {
                left: boardSize.min[0],
                top: boardSize.min[1],
                width: boardSize.max[0] - boardSize.min[0],
                height: boardSize.max[1] - boardSize.min[1],
                right: 0,
                bottom: 0
            }
            c.right = c.left + c.width;
            c.bottom = c.top + c.height;
            //set panzoom to the rect
            this.panZoomObject.showRectangle(c)
            //update panzoom, to make the changes visible
            this.panZoomObject.pause()
            this.panZoomObject.resume()
        }
    }

    render() {
        const usedBoards = this.props.usedBoards.map(b => (
            <BoardWithTokens
                board={b}
                key={b.name}
                tokens={this.props.boardTokens?.find(t => t.boardName === b.name) || { boardName: b.name, lands: [] }}
                presenceColors={this.props.presenceColors}
                onIncreaseToken={this.props.onIncreaseToken}
                onDecreaseToken={this.props.onDecreaseToken}
                showDialog={this.props.showDialog}
            />
        ));


        return (
            <div className={style.Boards__container}>
                <div ref={this.boardAreaRef} className={style.Boards__boardArea}>
                    {usedBoards}
                </div>
                <img className={style.Boards__centerViewButton} src={alignCenterImg} alt="center" onClick={() => this.resetPanZoom()} />
            </div>
        );
    }
}


