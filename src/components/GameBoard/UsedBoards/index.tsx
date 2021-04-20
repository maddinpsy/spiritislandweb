import * as React from "react";

import inside from "point-in-polygon"
import { SpiritIslandState } from "game/Game";
import { Board, BoardPlacement, Line, Point } from "game/SetupPhase";

import style from "./style.module.scss";
import boardA from "assets/Board A.png"
import boardB from "assets/Board B.png"
import boardC from "assets/Board C.png"
import boardD from "assets/Board D.png"
import boardE from "assets/Board E.png"
import boardF from "assets/Board F.png"


const boardImages: { [key: string]: string } = { "A": boardA, "B": boardB, "C": boardC, "D": boardD, "E": boardE, "F": boardF }

interface UsedBoardsProps {
    availBoards: Board[]
    usedBoards: (Board & BoardPlacement)[]
    doPlaceBoard: (boardName: string, place: BoardPlacement) => void
}

export class UsedBoards extends React.Component<UsedBoardsProps>
{
    ref: React.RefObject<HTMLDivElement>
    markerRef1: React.RefObject<HTMLDivElement>
    boardRefs: { [boardName: string]: React.RefObject<HTMLDivElement> };

    constructor(props: any) {
        super(props);
        this.ref = React.createRef();
        this.markerRef1 = React.createRef();
        this.boardRefs = {};
        Object.keys(boardImages).forEach((key) => { this.boardRefs[key] = React.createRef() });
        this.onMoveOrAddBoard = this.onMoveOrAddBoard.bind(this);
        this.onDragOver = this.onDragOver.bind(this);
    }

    onMoveOrAddBoard(event: React.DragEvent<HTMLDivElement>) {
        event.preventDefault();
        //Always hide marker
        const marker1 = this.markerRef1.current;
        if (marker1) {
            marker1.style.display = "none"
        }
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
            this.props.doPlaceBoard(boardName, { position: { x: left, y: top }, rotation: draggedBoard.rotation });
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

        //find matching anchor in dragged board: 
        //get anchor with smallest diff rotation 
        //take rotation of both boards into account
        //avoid overlapping with same board by start/end mixup, because anchors are all counter clock wise
        let min_anchor = this.getAnchorOfDraggedBoard(draggedBoard, closestBoard, closestAnchor);
        if (!min_anchor) return;
        // show marker at found anchor
        if (marker1) {
            const pos = this.rotateBy(this.middle(closestAnchor), closestBoard.rotation);
            const otherAncRot = Math.atan2(closestAnchor.start.y - closestAnchor.end.y, closestAnchor.start.x - closestAnchor.end.x) / Math.PI * 180;
            const otherAncRot_abs = (otherAncRot + closestBoard.rotation + 360) % 360;
            marker1.style.left = pos.x + closestBoard.position.x + "px";
            marker1.style.top = pos.y + closestBoard.position.y + "px"
            marker1.style.transform = "rotate(" + otherAncRot_abs + "deg)";
            marker1.style.display = "block"
        }
    }
    private middle(line: Line): Point {
        const cx = (line.start.x + line.end.x) / 2
        const cy = (line.start.y + line.end.y) / 2;
        return { x: cx, y: cy }
    }
    private rotateBy(p: Point, degree: number): Point {
        const sinPhiDragged = Math.sin(degree / 180 * Math.PI);
        const cosPhiDragged = Math.cos(degree / 180 * Math.PI);
        const newx = p.x * cosPhiDragged - p.y * sinPhiDragged;
        const newy = p.x * sinPhiDragged + p.y * cosPhiDragged;
        return { x: newx, y: newy }
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
        if (!min_anchor || Math.abs(min_rot_diff) > 90) {
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
            for (let anc of board.anchors) {
                const rel = this.rotateBy(this.middle(anc), board.rotation)
                const x_abs = rel.x + board.position.x;
                const y_abs = rel.y + board.position.y;
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

    private rotateBoard(boardName: string, clockwise: boolean) {
        const otherBoards = this.props.usedBoards.filter(b => b.name !== boardName);
        const draggedBoard = this.props.usedBoards.find(b => b.name === boardName);
        if (!draggedBoard) {
            console.log("Internal Error: DragBoard not found in availBoards");
            return;
        }
        const uniqePoints = draggedBoard.anchors
            .reduce((uniqePoints: Point[], line) => {
                uniqePoints.push(line.start);
                return uniqePoints;
            }, []);
        const center = uniqePoints.reduce(({ x, y }, point) => {
            return { x: y + point.x / uniqePoints.length, y: x + point.y / uniqePoints.length };
        }, { x: 0, y: 0 })
        const offsetCenterOld = this.rotateBy({ x: center.x, y: center.y }, draggedBoard.rotation)
        const centerabs = { x: offsetCenterOld.x + draggedBoard.position.x, y: offsetCenterOld.y + draggedBoard.position.y };
        const oldRotation = draggedBoard.rotation;
        if (otherBoards.length === 0) {
            //allow any rotate, when no other board is present
            if (clockwise) {
                draggedBoard.rotation += 60;
            } else {
                draggedBoard.rotation -= 60;
            }
            const offsetCenterNew = this.rotateBy({ x: -center.x, y: -center.y }, draggedBoard.rotation);
            const abs = {
                x: draggedBoard.position.x + offsetCenterOld.x + offsetCenterNew.x,
                y: draggedBoard.position.y + offsetCenterOld.y + offsetCenterNew.y
            }
            this.props.doPlaceBoard(boardName, { position: { x: abs.x, y: abs.y }, rotation: draggedBoard.rotation });
            return;
        }
        let { closestAnchor, closestBoard } = this.getClosestBoardAndAnchor(otherBoards, centerabs.x, centerabs.y);
        if (!closestAnchor || !closestBoard) {
            //to far from next ancher
            return;
        }
        let newPlacement = { position: { x: 0, y: 0 }, rotation: oldRotation };
        let deltaRot = 0;
        do {
            if (clockwise) {
                deltaRot += 30;
            } else {
                deltaRot -= 30;
            }
            draggedBoard.rotation = oldRotation + deltaRot;
            let min_anchor = this.getAnchorOfDraggedBoard(draggedBoard, closestBoard, closestAnchor);
            draggedBoard.rotation = oldRotation;
            if (!min_anchor) {
                // no snap position found, keep rotationg
                if (Math.abs(oldRotation - draggedBoard.rotation) >= 360) {
                    //no snap found after full rotation
                    return;
                }
                continue;
            }
            newPlacement = this.getSnapPosition(min_anchor, closestBoard, closestAnchor);
        } while (this.deltaRot(newPlacement.rotation, draggedBoard.rotation) < 30)
        this.props.doPlaceBoard(boardName, newPlacement);

    }
    /**
     * returns the smalles angle between two rotations. 
     * this functions accaptes all rotation values negative and greater than 360
     * @param rot1 first rotation in degrees
     * @param rot2 seconds rotation in degrees
     * @returns 0..180
     */
    deltaRot(rot1: number, rot2: number): number {
        let a = rot2 - rot1;
        //make sure it is between 0 and 360
        a = (a % 360 + 360) % 360
        //make sure its between -180 and 180
        if (a > 180) {
            a -= 360;
        }
        //make it 0..180
        return Math.abs(a)
    }
    /**
     * moves board at curser position in top layer. takes board anchors into account.
     * @param x clientX of mouseDown event
     * @param y clientY of mouseDown event
     */
    correctZIndex(x: number, y: number) {
        this.props.usedBoards.forEach(board => {
            //get html ref of board
            const ref = this.boardRefs[board.name]?.current;
            if (!ref) return

            //get absolute corners of board
            let conrners: number[][] = [];
            const bottomLeft = this.rotateBy(board.anchors[0].start, board.rotation);
            const bottomRight = this.rotateBy(board.anchors[1].start, board.rotation);
            const topRight = this.rotateBy(board.anchors[2].start, board.rotation);
            const topLeft = this.rotateBy(board.anchors[2].end, board.rotation);
            conrners.push([bottomLeft.x + board.position.x, bottomLeft.y + board.position.y])
            conrners.push([bottomRight.x + board.position.x, bottomRight.y + board.position.y])
            conrners.push([topRight.x + board.position.x, topRight.y + board.position.y])
            conrners.push([topLeft.x + board.position.x, topLeft.y + board.position.y])

            //check absolut point is insied board
            if (inside([x, y], conrners)) {
                ref.style.zIndex = "100";
            } else {
                ref.style.zIndex = "0";
            }
        });
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
                    onDragEnd={(ev) => {
                        const marker1 = this.markerRef1.current;
                        if (marker1) {
                            marker1.style.display = "none"
                        }
                    }}
                    ref={this.boardRefs[b.name]}
                >
                    <div className={style.IslandArea__onBoardButton} style={{ right: "60px" }} onClick={() => this.rotateBoard(b.name, false)}>&#x2b6f;</div>
                    <div className={style.IslandArea__onBoardButton} style={{ right: "100px" }} onClick={() => this.rotateBoard(b.name, true)}>&#x2b6e;</div>
                    <img src={boardImages[b.name]} className={style.IslandArea__image} draggable="false" />
                </div>
            )
        });


        return (
            <div ref={this.ref} className={style.IslandArea__boardArea}
                onDrop={this.onMoveOrAddBoard}
                onMouseDown={(ev) => this.correctZIndex(ev.clientX, ev.clientY)}
                onDragOver={this.onDragOver}
            >
                {usedBoards}
                <div ref={this.markerRef1} className={style.IslandArea__marker}>[x]</div>
            </div>
        );
    }
}
