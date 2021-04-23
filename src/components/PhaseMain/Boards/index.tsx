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


const boardImages: { [key: string]: string } = { "A": boardA, "B": boardB, "C": boardC, "D": boardD, "E": boardE, "F": boardF }

interface BoardsProps {
    usedBoards: (Board & BoardPlacement)[]
}

export class Boards extends React.Component<BoardsProps>
{
    boardAreaRef: React.RefObject<HTMLDivElement>
    panZoomObject:PanZoom | undefined
    boardRefs: { [boardName: string]: React.RefObject<HTMLDivElement> };

    constructor(props: any) {
        super(props);
        this.boardAreaRef = React.createRef();
        this.boardRefs = {};
        Object.keys(boardImages).forEach((key) => { this.boardRefs[key] = React.createRef() });
    }

    componentDidMount()
    {
        if(this.boardAreaRef.current){
                this.panZoomObject = createPanZoom(this.boardAreaRef.current)
        }
    }
    resetPanZoom(){
        if(this.panZoomObject){
            this.panZoomObject.zoomAbs(0,0,1);
            this.panZoomObject.moveTo(0,0);
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
                    <img src={boardImages[b.name]} alt={b.name} className={style.Boards__image} draggable="false" />
                </div>
            )
        });


        return (
            <div className={style.Boards__container}>
            <div ref={this.boardAreaRef} className={style.Boards__boardArea}>
                {usedBoards}
            </div>
            <img className={style.Boards__centerViewButton} src={alignCenterImg} alt="center" onClick={()=>this.resetPanZoom()}/>
            </div>
        );
    }
}
