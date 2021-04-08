import * as React from "react";

import { SpiritIslandState } from "game/Game";
import { Board, BoardPlacement } from "game/SetupPhase";

import style from "./style.module.scss";
import boardA from "assets/boardA.png"
import boardB from "assets/boardB.png"
import boardC from "assets/boardC.png"
import boardD from "assets/boardD.png"

const boardImages: { [key: string]: string } = { "A": boardA, "B": boardB, "C": boardC, "D": boardD }

class AvailableBoards extends React.Component<{ availBoards: Board[], removeBoard: (boardName: string) => void }>
{
    constructor(props: any) {
        super(props);
        this.onRemoveBoard = this.onRemoveBoard.bind(this);
    }

    onRemoveBoard(event: React.DragEvent<HTMLDivElement>) {
        event.preventDefault();
        const boardName = event.dataTransfer.getData("text");
        this.props.removeBoard(boardName);
    }

    render() {
        const boards = this.props.availBoards.map(b => {
            return (
                <div key={b.name}
                    className={style.IslandArea__availBoard}
                    draggable="true"
                    onDragStart={(ev) => {
                        ev.dataTransfer.setData("text", b.name)
                    }}
                >
                    <img src={boardImages[b.name]} draggable="false" width="200px" />
                </div>)
        });
        return (
            <div className={style.IslandArea__availArea}
                onDrop={this.onRemoveBoard}
                onDragOver={(event) => event.preventDefault()}>
                {boards}
            </div>
        )
    }
}

class UsedBoards extends React.Component<{ usedBoards: (Board & BoardPlacement)[], placeBoard: (boardName: string, place: BoardPlacement) => void }>
{
    ref: React.RefObject<HTMLDivElement>

    constructor(props: any) {
        super(props);
        this.ref = React.createRef();
        this.onMoveOrAddBoard = this.onMoveOrAddBoard.bind(this);
    }

    onMoveOrAddBoard(event: React.DragEvent<HTMLDivElement>) {
        event.preventDefault();
        const rect = this.ref.current?.getBoundingClientRect();
        if (!rect) {
            console.log("cant drop on unknown element");
            return;
        }
        const boardName = event.dataTransfer.getData("text");
        const left = event.clientX - rect.left;
        const top = event.clientY - rect.top;
        this.props.placeBoard(boardName, { position: { x: left, y: top }, rotation: 0 });
    }

    render() {
        const usedBoards = this.props.usedBoards.map(b => {
            let customStyle: React.CSSProperties = {};
            customStyle.left = b.position.x;
            customStyle.top = b.position.y;
            customStyle.transform = "rotate(" + b.rotation + "deg)";
            return (
                <div className={style.IslandArea__usedBoard} style={customStyle} key={b.name}
                    draggable="true"
                    onDragStart={(ev) => {
                        ev.dataTransfer.setData("text", b.name)
                    }}
                >
                    <img src={boardImages[b.name]} draggable="false" width="250px" />
                </div>
            )
        });


        return (
            <div ref={this.ref} className={style.IslandArea__boardArea}
                onDrop={this.onMoveOrAddBoard}
                onDragOver={(event) => event.preventDefault()}
            >
                {usedBoards}
            </div>
        );
    }
}

export interface IslandAreaProps {
    G: SpiritIslandState
    placeBoard: (boardName: string, place: BoardPlacement) => void
    removeBoard: (boardName: string) => void
}

export class IslandArea extends React.Component<IslandAreaProps> {
    constructor(props: IslandAreaProps) {
        super(props);
    }

    render() {
        return (
            <div className={style.IslandArea__container}>
                <AvailableBoards availBoards={this.props.G.availBoards} removeBoard={this.props.removeBoard} />
                <UsedBoards usedBoards={this.props.G.usedBoards} placeBoard={this.props.placeBoard} />
            </div>
        );
    }
}

