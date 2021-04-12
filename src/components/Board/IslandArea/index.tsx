import * as React from "react";

import { SpiritIslandState } from "game/Game";
import { Board, BoardPlacement, Line } from "game/SetupPhase";

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
                    <img src={boardImages[b.name]} className={style.IslandArea__image} draggable="false" width="200px" />
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

class UsedBoards extends React.Component<{ availBoards: Board[], usedBoards: (Board & BoardPlacement)[], doPlaceBoard: (boardName: string, place: BoardPlacement) => void }>
{
    ref: React.RefObject<HTMLDivElement>
    markerRef1: React.RefObject<HTMLDivElement>
    markerRef2: React.RefObject<HTMLDivElement>

    constructor(props: any) {
        super(props);
        this.ref = React.createRef();
        this.markerRef1 = React.createRef();
        this.markerRef2 = React.createRef();
        this.onMoveOrAddBoard = this.onMoveOrAddBoard.bind(this);
        this.onDragOver = this.onDragOver.bind(this);
    }

    onMoveOrAddBoard(event: React.DragEvent<HTMLDivElement>) {
        event.preventDefault();
        const rect = this.ref.current?.getBoundingClientRect();
        if (!rect) {
            console.log("cant drop on unknown element");
            return;
        }
        const boardName = event.dataTransfer.getData("text");
        const otherBoards = this.props.usedBoards.filter(b => b.name !== boardName);
        let draggedBoard = this.props.usedBoards.find(b => b.name === boardName);
        const left = event.clientX;
        const top = event.clientY;
        if (!draggedBoard) {
            //this happens when new board is added
            const newBoard = this.props.availBoards.find(b => b.name === boardName);
            if (!newBoard) {
                console.log("Internal Error: DragBoard not found in availBoards");
                return;
            }
            draggedBoard = { ...newBoard, position: { x: 0, y: 0 }, rotation: 0 };
        }
        if (otherBoards.length === 0) {
            //allow drag anywere, when no other board is present
            this.props.doPlaceBoard(boardName, { position: { x: left, y: top }, rotation: 0});
            return;
        }
        let { closestAnchor, closestBoard } = this.getClosestBoardAndAnchor(otherBoards, left, top);
        if (!closestAnchor || !closestBoard) {
            //to far from next ancher
            return;
        }
        let min_anchor = this.getAnchorOfDraggedBoard(draggedBoard, closestBoard, closestAnchor);
        if (!min_anchor) {
            // no snap position found, don't move
            return;
        }
        const placement = this.getSnapPosition(min_anchor, closestBoard, closestAnchor);
        this.props.doPlaceBoard(boardName, placement);

    }

    onDragOver(event: React.DragEvent<HTMLDivElement>) {
        event.preventDefault();
        let marker1 = this.markerRef1.current;
        if (marker1) {
            marker1.style.display = "none"
        }
        let marker2 = this.markerRef2.current;
        if (marker2) {
            marker2.style.display = "none"
        }
        const rect = this.ref.current?.getBoundingClientRect();
        if (!rect) {
            console.log("cant drop on unknown element");
            return;
        }
        const boardName = event.dataTransfer.getData("text");
        const left = event.clientX;
        const top = event.clientY;
        //find ancher closest to mouse pointer
        //for each board go throw each anchor
        //take rotation and absolut position into account
        const otherBoards = this.props.usedBoards.filter(b => b.name !== boardName);
        let draggedBoard = this.props.usedBoards.find(b => b.name === boardName);
        if (!draggedBoard) {
            //this happens when new board is added
            const newBoard = this.props.availBoards.find(b => b.name === boardName);
            if (!newBoard) {
                console.log("Internal Error: DragBoard not found in availBoards");
                return;
            }
            draggedBoard = { ...newBoard, position: { x: 0, y: 0 }, rotation: 0 };
        }
        if (otherBoards.length === 0) {
            //allow drag anywere, when no other board is present
            return;
        }
        let { closestAnchor, closestBoard } = this.getClosestBoardAndAnchor(otherBoards, left, top);
        if (!closestAnchor || !closestBoard) {
            //to far from next ancher
            return;
        }
        // show marker at found anchor
        if (marker1) {
            marker1.style.left = (closestAnchor.start.x + closestAnchor.end.x) / 2 + closestBoard.position.x + "px";
            marker1.style.top = (closestAnchor.start.y + closestAnchor.end.y) / 2 + closestBoard.position.y + "px"
            marker1.style.display = "block"
        }

        //find matching anchor in dragged board: 
        //get anchor with smallest diff rotation 
        //take rotation of both boards into account
        //avoid overlapping with same board by start/end mixup, because anchors are all counter clock wise

        let min_anchor = this.getAnchorOfDraggedBoard(draggedBoard, closestBoard, closestAnchor);
        if (!min_anchor) return;
        // show marker at found anchor
        if (marker2) {
            marker2.style.left = (min_anchor.start.x + min_anchor.end.x) / 2 + draggedBoard.position.x + "px";
            marker2.style.top = (min_anchor.start.y + min_anchor.end.y) / 2 + draggedBoard.position.y + "px"
            marker2.style.display = "block"
        }
    }

    private getSnapPosition(min_anchor: Line, closestBoard: Board & BoardPlacement, closestAnchor: Line): BoardPlacement {
        //first: rotate drag Board correctly
        const otherAncRot = Math.atan2(closestAnchor.start.y - closestAnchor.end.y, closestAnchor.start.x - closestAnchor.end.x) / Math.PI * 180;
        const otherAncRot_abs = (otherAncRot + closestBoard.rotation + 360) % 360;
        const dragAncRot = Math.atan2(min_anchor.end.y - min_anchor.start.y, min_anchor.end.x - min_anchor.start.x) / Math.PI * 180;
        const newrot = (otherAncRot_abs - dragAncRot + 360) % 360;
        //second: align dragEnd with otherStart in rotated space
        const sinPhiDragged = Math.sin(newrot / 180 * Math.PI);
        const cosPhiDragged = Math.cos(newrot / 180 * Math.PI);
        const dargEndRotatedx = min_anchor.end.x * cosPhiDragged - min_anchor.end.y * sinPhiDragged;
        const dargEndRotatedy = min_anchor.end.x * sinPhiDragged + min_anchor.end.y * cosPhiDragged;
        const sinPhiOther = Math.sin(closestBoard.rotation / 180 * Math.PI);
        const cosPhiOther = Math.cos(closestBoard.rotation / 180 * Math.PI);
        const otherStartRotatedx = closestAnchor.start.x * cosPhiOther - closestAnchor.start.y * sinPhiOther;
        const otherStartRotatedy = closestAnchor.start.x * sinPhiOther + closestAnchor.start.y * cosPhiOther;
        const newx = otherStartRotatedx - dargEndRotatedx + closestBoard.position.x;
        const newy = otherStartRotatedy - dargEndRotatedy + closestBoard.position.y;
        return { position: { x: newx, y: newy }, rotation: newrot };
    }

    private getAnchorOfDraggedBoard(draggedBoard: Board & BoardPlacement, closestBoard: Board & BoardPlacement, closestAnchor: Line) {
        let min_rot_diff = Infinity;
        let min_anchor;
        const otherAncRot = Math.atan2(closestAnchor.start.y - closestAnchor.end.y, closestAnchor.start.x - closestAnchor.end.x) / Math.PI * 180;
        const otherAncRot_abs = (otherAncRot + closestBoard.rotation + 360) % 360;
        for (let anc of draggedBoard.anchors) {
            //exchange start and end, to map start-end and end-start
            const dragAncRot = Math.atan2(anc.end.y - anc.start.y, anc.end.x - anc.start.x) / Math.PI * 180;
            const dragAncRot_abs = (dragAncRot + draggedBoard.rotation + 360) % 360;
            let rot_diff = Math.abs(dragAncRot_abs - otherAncRot_abs);
            if (rot_diff > 180) {
                rot_diff = rot_diff - 360;
            }
            if (Math.abs(rot_diff) < Math.abs(min_rot_diff)) {
                min_rot_diff = rot_diff;
                min_anchor = anc;
            }
        };
        if (!min_anchor || Math.abs(min_rot_diff) > 30) {
            //no anchor was closest
            console.log("min_rot_diff:" + min_rot_diff);
            return undefined;
        }
        return min_anchor;
    }

    private getClosestBoardAndAnchor(otherBoards: (Board & BoardPlacement)[], left: number, top: number) {
        const maxAnchorDist = 200;//px
        let minSqDist = maxAnchorDist ** 2;
        let closestAnchor;
        let closestBoard;
        for (let board of otherBoards) {
            const sinPhi = Math.sin(board.rotation / 180 * Math.PI);
            const cosPhi = Math.cos(board.rotation / 180 * Math.PI);
            for (let anc of board.anchors) {
                const x = (anc.start.x + anc.end.x) / 2;
                const y = (anc.start.y + anc.end.y) / 2;
                const x_abs = x * cosPhi - y * sinPhi + board.position.x;
                const y_abs = x * sinPhi + y * cosPhi + board.position.y;
                const sqDist = (x_abs - left) ** 2 + (y_abs - top) ** 2;
                if (sqDist < minSqDist) {
                    minSqDist = sqDist;
                    closestAnchor = anc;
                    closestBoard = board;
                }
            }
        }
        return { closestAnchor, closestBoard };
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
                        console.log(ev.clientX - ev.currentTarget.getBoundingClientRect().x);
                    }}
                >
                    <img src={boardImages[b.name]} className={style.IslandArea__image} draggable="false" />
                </div>
            )
        });


        return (
            <div ref={this.ref} className={style.IslandArea__boardArea}
                onDrop={this.onMoveOrAddBoard}
                onDragOver={this.onDragOver}
            >
                {usedBoards}
                <div ref={this.markerRef1} style={{ position: "absolute" }}>[x]</div>
                <div ref={this.markerRef2} style={{ position: "absolute" }}>[+]</div>
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
                <UsedBoards availBoards={this.props.G.availBoards} usedBoards={this.props.G.usedBoards} doPlaceBoard={this.props.placeBoard} />
            </div>
        );
    }
}

