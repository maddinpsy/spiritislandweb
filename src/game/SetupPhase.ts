import { Ctx, Game } from "boardgame.io";
import { INVALID_MOVE } from 'boardgame.io/core';
import { SpiritIslandState } from "./Game";

export type Point = { x: number, y: number }
export type Line = { start: Point, end: Point }

export type Board = {
    name: string
    anchors: Line[];
}
export type BoardPlacement = { position: Point, rotation: number }

//"A",{ position: {x:10,y:10}, rotation: 0 }

export type SetupPhaseState =
    {
        availBoards: Board[]
        usedBoards: (Board & BoardPlacement)[]
    }

function gameSetup(): SpiritIslandState {
    //TopLeft 525	116
    //TopRight 1441	122
    //BottomRight 980	914
    //BottomLeft 64	908
    return {
        availBoards:[
            {name:"A",anchors:[{start:{x:22,y:303},end:{x:327,y:305}},{start:{x:327,y:305},end:{x:480,y:41}},{start:{x:480,y:40},end:{x:175,y:38}}]},
            {name:"B",anchors:[{start:{x:22,y:303},end:{x:327,y:305}},{start:{x:327,y:305},end:{x:480,y:41}},{start:{x:480,y:40},end:{x:175,y:38}}]},
            {name:"C",anchors:[{start:{x:22,y:303},end:{x:327,y:305}},{start:{x:327,y:305},end:{x:480,y:41}},{start:{x:480,y:40},end:{x:175,y:38}}]},
            {name:"D",anchors:[{start:{x:22,y:303},end:{x:327,y:305}},{start:{x:327,y:305},end:{x:480,y:41}},{start:{x:480,y:40},end:{x:175,y:38}}]},
            {name:"E",anchors:[{start:{x:22,y:303},end:{x:327,y:305}},{start:{x:327,y:305},end:{x:480,y:41}},{start:{x:480,y:40},end:{x:175,y:38}}]},
            {name:"F",anchors:[{start:{x:22,y:303},end:{x:327,y:305}},{start:{x:327,y:305},end:{x:480,y:41}},{start:{x:480,y:40},end:{x:175,y:38}}]}
        ],
        usedBoards:[]
    };
}

function checkBoardPlacement(usedBoards: (Board & BoardPlacement)[], newBoard: (Board & BoardPlacement)): boolean {
    const noOverlap = usedBoards
        .filter(b => b.name !== newBoard.name)
        .every(curBoad => {
            //TODO exactly one anchor matching newBoard ancher
            //TODO newBoard not inside curBoard
            return true;
        });

    return noOverlap;
}

export const SetupMoves = {
    placeBoard: function (G: SpiritIslandState, ctx: Ctx, boardName: string, place: BoardPlacement) {
        if(!place) return INVALID_MOVE;
        //add new board
        const availBoardIdx = G.availBoards.findIndex(b => b.name === boardName);
        const usedBoardIdx = G.usedBoards.findIndex(b => b.name === boardName);
        if (availBoardIdx === -1 && usedBoardIdx === -1) {
            return INVALID_MOVE
        } else if (availBoardIdx !== -1 && usedBoardIdx !== -1) {
            throw new Error("Internal error: Same Board cant be in used and avail!");
        }
        else if (availBoardIdx !== -1 && usedBoardIdx === -1) {
            const newBoardWithPlace = { ...G.availBoards[availBoardIdx], ...place };
            const validPlace = checkBoardPlacement(G.usedBoards, newBoardWithPlace);
            if (validPlace) {
                //add to used boards
                G.usedBoards.push(newBoardWithPlace);
                //remove from avail boards
                G.availBoards.splice(availBoardIdx,1);
            } else {
                return INVALID_MOVE
            }
        } else {
            //move existing board
            const newBoardWithPlace = { ...G.usedBoards[usedBoardIdx], ...place };
            const validPlace = checkBoardPlacement(G.usedBoards, newBoardWithPlace);
            if (validPlace) {
                //remove old board
                G.usedBoards.splice(usedBoardIdx, 1);
                //add new board
                G.usedBoards.push(newBoardWithPlace);
            } else {
                return INVALID_MOVE
            }
        }
    },
    removeBoard: function (G: SpiritIslandState, ctx: Ctx, boardName: string) {
        const boardIdx = G.usedBoards.findIndex(b => b.name === boardName);
        if (boardIdx === -1) return INVALID_MOVE
        //add to available board
        G.availBoards.push(G.usedBoards[boardIdx]);
        //remove from used boards
        G.usedBoards.splice(boardIdx,1);
    }
}

export const SetupPhase: Game<SpiritIslandState, Ctx> =
{
    setup: gameSetup,
    phases: {
        setup: {
            moves: SetupMoves,
            start: true,
        }
    }
}