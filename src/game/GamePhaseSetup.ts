import { Ctx } from "boardgame.io";
import { INVALID_MOVE } from 'boardgame.io/core';
import { BoardInfo } from "./BoardInfo";
import { SpiritIslandState } from "./Game";
import { LandTokens } from "./GamePhaseMain";
import { SpiritInfo } from "./SpiritInfo";

export type Point = { x: number, y: number }
export type Line = { start: Point, end: Point }

export type SetupSpirit = {
    name: string
    logoUrl:string
    frontSideUrl:string
    backSideUrl:string
    //startHand:Cards[]

    /** Ether the name of the board, where the spirit is placed. Or undefined if spirit is still available. */
    curretBoard?: String;
}

export type Board = {
    name: string
    anchors: Line[];
    smallBoardUrl:string
    largeBoardUrl:string
    startTokens: LandTokens[]
}
export type BoardPlacement = { position: Point, rotation: number }

//"A",{ position: {x:10,y:10}, rotation: 0 }

export type SetupPhaseState =
    {
        availBoards: Board[]
        usedBoards: (Board & BoardPlacement)[]
        setupSpirits: SetupSpirit[]
    }

export function gameSetup(): SpiritIslandState {
    //Requirements on anchors:
    //Center of Anchors is Center of Image
    //Anchers create perfect parallelogram
    //All Anchors have the same length
    //Anchor in CountClockwise Direction

    //TopLeft 525	116
    //TopRight 1441	122
    //BottomRight 980	914
    //BottomLeft 64	908
    return {
        availBoards: BoardInfo,
        usedBoards: [],
        setupSpirits: SpiritInfo,
        activeSpirits:[]
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
        if (!place) return INVALID_MOVE;
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
                G.availBoards.splice(availBoardIdx, 1);
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
        G.usedBoards.splice(boardIdx, 1);
        //remove spirit if any
        const placedSpirit = G.setupSpirits.filter(s => s.curretBoard === boardName)
        if (placedSpirit) {
            placedSpirit.forEach(s => {
                s.curretBoard = undefined;
            })
        }
    },
    placeSpirit: function (G: SpiritIslandState, ctx: Ctx, spiritIdx: number, boardName: string) {
        const board = G.usedBoards.find(b => b.name === boardName);
        if (!board) return INVALID_MOVE
        const newSpirit = G.setupSpirits[spiritIdx];
        //if another spirit is on the board, remove it first
        const oldSpirit = G.setupSpirits.find(s => s.curretBoard === board.name);
        if (oldSpirit) {
            //swap boards or remove, if newSpirit.currentBoard was undefined
            oldSpirit.curretBoard = newSpirit.curretBoard;
        }
        //place the new spirit on the board
        newSpirit.curretBoard = board.name;
    },
    removeSpirit: function (G: SpiritIslandState, ctx: Ctx, spiritIdx: number) {
        G.setupSpirits[spiritIdx].curretBoard = undefined;
    },

    startGame: function (G: SpiritIslandState, ctx: Ctx) {
        //we need at least one board
        if (G.usedBoards.length === 0) {
            return INVALID_MOVE;
        }
        //each board needs a spirit
        if (G.usedBoards.some(b => G.setupSpirits.every(s => s.curretBoard !== b.name))) {
            return INVALID_MOVE;
        }
        //Boards may not overlap
        //no gaps beetween boards alowed
        if (ctx.events && ctx.events.endPhase)
            ctx.events?.endPhase();
    }
}
