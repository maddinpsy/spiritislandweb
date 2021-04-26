import * as React from "react";

import { Board, BoardPlacement } from "game/SetupPhase";

import style from "./style.module.scss";


import alignCenterImg from "assets/router.svg"

import createPanZoom, { PanZoom } from "panzoom";
import { BoardToken, TokenType } from "game/MainPhase";
import { Tokens } from "../Tokens";
import { S3_PREFIX } from "config";


/** Defines the hardcoded sizes for the token containers. These are used to fit the tokens into the land polygons. */

interface BoardsProps {
    usedBoards: (Board & BoardPlacement)[]
    boardTokens?: BoardToken[]

    onIncreaseToken: (boardName: string, landNumber: number, tokenType: TokenType) => void;
    onDecreaseToken: (boardName: string, landNumber: number, tokenType: TokenType) => void;
    showDialog: (data?:{title:string, content: JSX.Element}) => void;
}

export class Boards extends React.Component<BoardsProps>
{
    boardAreaRef: React.RefObject<HTMLDivElement>
    panZoomObject: PanZoom | undefined
    boardRefs: { [boardName: string]: React.RefObject<HTMLDivElement> };

    constructor(props: BoardsProps) {
        super(props);
        this.boardAreaRef = React.createRef();
        this.boardRefs = {};
        this.state = {}
        props.usedBoards.forEach((key) => { this.boardRefs[key.name] = React.createRef() });
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
                    <img src={S3_PREFIX + b.largeBoardUrl} alt={b.name} className={style.Boards__image} draggable="false" />
                </div>
            )
        });


        return (
            <div className={style.Boards__container}>
                <div ref={this.boardAreaRef} className={style.Boards__boardArea}>
                    {usedBoards}
                    <Tokens
                        boardTokens={this.props.boardTokens}
                        usedBoards={this.props.usedBoards}
                        onIncreaseToken={this.props.onIncreaseToken}
                        onDecreaseToken={this.props.onDecreaseToken}
                        showDialog={this.props.showDialog}
                    />
                </div>
                <img className={style.Boards__centerViewButton} src={alignCenterImg} alt="center" onClick={() => this.resetPanZoom()} />
            </div>
        );
    }
}
