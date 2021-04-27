import { Board, BoardPlacement, Line, Point } from "game/GamePhaseSetup";
import inside from "point-in-polygon";

export namespace BoardDragDrop {
    export function getNewDropPosition(usedBoards: (Board & BoardPlacement)[], availBoards: Board[], boardName: string, mousePos: number[]): BoardPlacement | undefined {
        const otherBoards = usedBoards.filter(b => b.name !== boardName);
        let draggedBoard = usedBoards.find(b => b.name === boardName);
        const left = mousePos[0];
        const top = mousePos[1];
        if (!draggedBoard) {
            //this happens when new board is added
            const newBoard = availBoards.find(b => b.name === boardName);
            if (!newBoard) {
                console.log("Internal Error: DragBoard not found in availBoards");
                return;
            }
            draggedBoard = { ...newBoard, position: { x: 0, y: 0 }, rotation: 0 };
        }
        if (otherBoards.length === 0) {
            //allow drag anywere, when no other board is present
            return { position: { x: left, y: top }, rotation: draggedBoard.rotation };
        }
        let { closestAnchor, closestBoard } = getClosestBoardAndAnchor(otherBoards, left, top);
        if (!closestAnchor || !closestBoard) {
            //to far from next ancher
            return;
        }
        let min_anchor = getAnchorOfDraggedBoard(draggedBoard, closestBoard, closestAnchor);
        if (!min_anchor) {
            // no snap position found, don't move
            return;
        }
        const placement = getSnapPosition(draggedBoard, min_anchor, closestBoard, closestAnchor);
        return placement;
    }

    export function rotateBoard(usedBoards: (Board & BoardPlacement)[], boardName: string, clockwise: boolean): BoardPlacement | undefined {
        const otherBoards = usedBoards.filter(b => b.name !== boardName);
        const draggedBoard = usedBoards.find(b => b.name === boardName);
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
        const offsetCenterOld = rotateBy({ x: center.x, y: center.y }, draggedBoard.rotation)
        const centerabs = { x: offsetCenterOld.x + draggedBoard.position.x, y: offsetCenterOld.y + draggedBoard.position.y };
        const oldRotation = draggedBoard.rotation;
        if (otherBoards.length === 0) {
            //allow any rotate, when no other board is present
            if (clockwise) {
                draggedBoard.rotation += 60;
            } else {
                draggedBoard.rotation -= 60;
            }
            const offsetCenterNew = rotateBy({ x: -center.x, y: -center.y }, draggedBoard.rotation);
            const abs = {
                x: draggedBoard.position.x + offsetCenterOld.x + offsetCenterNew.x,
                y: draggedBoard.position.y + offsetCenterOld.y + offsetCenterNew.y
            }
            return { position: { x: abs.x, y: abs.y }, rotation: draggedBoard.rotation };
        }
        let { closestAnchor, closestBoard } = getClosestBoardAndAnchor(otherBoards, centerabs.x, centerabs.y);
        if (!closestAnchor || !closestBoard) {
            //to far from next ancher
            console.log("Internal Error: Rotation to far from next ancher");
            return;
        }
        let newPlacement = { position: { x: 0, y: 0 }, rotation: oldRotation };
        let delta = 0;
        do {
            if (clockwise) {
                delta += 30;
            } else {
                delta -= 30;
            }
            draggedBoard.rotation = oldRotation + delta;
            let min_anchor = getAnchorOfDraggedBoard(draggedBoard, closestBoard, closestAnchor);
            draggedBoard.rotation = oldRotation;
            if (!min_anchor) {
                // no snap position found, keep rotationg
                if (Math.abs(oldRotation - draggedBoard.rotation) >= 360) {
                    //no snap found after full rotation
                    console.log("Internal Error: no snap found after full rotation");
                    return;
                }
                continue;
            }
            newPlacement = getSnapPosition(draggedBoard, min_anchor, closestBoard, closestAnchor, clockwise);
        } while (deltaRotAbs(newPlacement.rotation, draggedBoard.rotation) < 30)


        return newPlacement;
    }

    export function getAnchorHint(usedBoards: (Board & BoardPlacement)[], availBoards: Board[], boardName: string, mousePos: number[]): BoardPlacement | undefined {
        //find ancher closest to mouse pointer
        //for each board go throw each anchor
        //take rotation and absolut position into account
        const otherBoards = usedBoards.filter(b => b.name !== boardName);
        let draggedBoard = usedBoards.find(b => b.name === boardName);
        const left = mousePos[0];
        const top = mousePos[1];
        if (!draggedBoard) {
            //this happens when new board is added
            const newBoard = availBoards.find(b => b.name === boardName);
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
        let { closestAnchor, closestBoard } = getClosestBoardAndAnchor(otherBoards, left, top);
        if (!closestAnchor || !closestBoard) {
            //to far from next ancher
            return;
        }

        //find matching anchor in dragged board: 
        //get anchor with smallest diff rotation 
        //take rotation of both boards into account
        //avoid overlapping with same board by start/end mixup, because anchors are all counter clock wise
        let min_anchor = getAnchorOfDraggedBoard(draggedBoard, closestBoard, closestAnchor);
        if (!min_anchor) return;

        //return position and absolut rotation of closest anchor
        const pos = rotateBy(middle(closestAnchor), closestBoard.rotation);
        const pos_abs = { x: pos.x + closestBoard.position.x, y: pos.y + closestBoard.position.y }
        const otherAncRot = Math.atan2(closestAnchor.start.y - closestAnchor.end.y, closestAnchor.start.x - closestAnchor.end.x) / Math.PI * 180;
        const otherAncRot_abs = (otherAncRot + closestBoard.rotation + 360) % 360;
        return { position: pos_abs, rotation: otherAncRot_abs };
    }

    export function insidBoard(x: number, y: number, board: Board & BoardPlacement) {
        //check absolut point is insied board
        return inside([x, y], absolutCorners(board));
    }

    export function absolutCorners(board: Board & BoardPlacement) {
        //get absolute corners of board
        let conrners: number[][] = [];
        const bottomLeft = rotateBy(board.anchors[0].start, board.rotation);
        const bottomRight = rotateBy(board.anchors[1].start, board.rotation);
        const topRight = rotateBy(board.anchors[2].start, board.rotation);
        const topLeft = rotateBy(board.anchors[2].end, board.rotation);
        conrners.push([bottomLeft.x + board.position.x, bottomLeft.y + board.position.y])
        conrners.push([bottomRight.x + board.position.x, bottomRight.y + board.position.y])
        conrners.push([topRight.x + board.position.x, topRight.y + board.position.y])
        conrners.push([topLeft.x + board.position.x, topLeft.y + board.position.y])

        return conrners
    }

    /**
     * returns the smalles angle between two rotations. 
     * this functions accaptes all rotation values negative and greater than 360
     * @param rot1 first rotation in degrees
     * @param rot2 seconds rotation in degrees
     * @returns 0..180
     */
    function deltaRotAbs(rot1: number, rot2: number): number {
        return Math.abs(deltaRot(rot1, rot2))
    }
    /**
     * returns the smalles angle between two rotations. 
     * this functions accaptes all rotation values negative and greater than 360
     * @param rot1 first rotation in degrees
     * @param rot2 seconds rotation in degrees
     * @returns -180..180
     */
    function deltaRot(rot1: number, rot2: number): number {
        let a = rot2 - rot1;
        //make sure it is between 0 and 360
        a = (a % 360 + 360) % 360
        //make sure its between -180 and 180
        if (a > 180) {
            a -= 360;
        }
        //make it 0..180
        return a
    }

    function middle(line: Line): Point {
        const cx = (line.start.x + line.end.x) / 2
        const cy = (line.start.y + line.end.y) / 2;
        return { x: cx, y: cy }
    }
    export function rotateBy(p: Point, degree: number): Point {
        const sinPhiDragged = Math.sin(degree / 180 * Math.PI);
        const cosPhiDragged = Math.cos(degree / 180 * Math.PI);
        const newx = p.x * cosPhiDragged - p.y * sinPhiDragged;
        const newy = p.x * sinPhiDragged + p.y * cosPhiDragged;
        return { x: newx, y: newy }
    }

    function getSnapPosition(
        draggedBoard: Board & BoardPlacement,
        min_anchor: Line,
        closestBoard: Board & BoardPlacement,
        closestAnchor: Line,
        clockwise?: boolean
    ): BoardPlacement {
        //first: rotate drag Board correctly
        const otherAncRot = Math.atan2(closestAnchor.start.y - closestAnchor.end.y, closestAnchor.start.x - closestAnchor.end.x) / Math.PI * 180;
        const otherAncRot_abs = (otherAncRot + closestBoard.rotation + 360) % 360;
        const dragAncRot = Math.atan2(min_anchor.end.y - min_anchor.start.y, min_anchor.end.x - min_anchor.start.x) / Math.PI * 180;
        let newrot = otherAncRot_abs - dragAncRot;
        //correct rotation
        newrot = deltaRot(draggedBoard.rotation, newrot) + draggedBoard.rotation;
        if (newrot > 0 && clockwise === false) {
            newrot -= 360;
        }
        if (newrot < 0 && clockwise === true) {
            newrot += 360;
        }

        //newrot = (otherAncRot_abs - dragAncRot + 360) % 360;

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

    function getAnchorOfDraggedBoard(draggedBoard: Board & BoardPlacement, closestBoard: Board & BoardPlacement, closestAnchor: Line) {
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

    function getClosestBoardAndAnchor(otherBoards: (Board & BoardPlacement)[], left: number, top: number) {
        const maxAnchorDist = 200;//px
        let minSqDist = maxAnchorDist ** 2;
        let closestAnchor;
        let closestBoard;
        for (let board of otherBoards) {
            for (let anc of board.anchors) {
                const rel = rotateBy(middle(anc), board.rotation)
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
}