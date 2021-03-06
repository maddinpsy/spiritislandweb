//relative path, because we use esm to start
import { Types } from "../spirit-island-card-katalog/types";
import { BoardInfo } from "./BoardInfo";
import { SpiritIslandState } from "./Game";
import { LandTokens, mainPhaseSetup } from "./GamePhaseMain";
import { SpiritInfo } from "./SpiritInfo";

export type Point = { x: number, y: number }
export type Line = { start: Point, end: Point }


export type SetupSpirit = {
    name: string
    logoUrl: string
    frontSideUrl: string
    backSideUrl: string
    startHand: Types.PowerCardData[]
    presenceAppearance: {
        /**position of presence center in percent of width/height*/
        presenceTrackPosition: Point[]
        /**diameter of presence in percent of image width*/
        presenceTrackDiameter: number
        /**this is set as css property of all presence markers*/
        presenceBackground: string
    }
    /** Ether the name of the board, where the spirit is placed. Or undefined if spirit is still available. */
    curretBoard?: String;
}

export type Board = {
    name: string
    anchors: Line[];
    smallBoardUrl: string
    largeBoardUrl: string
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

export const defaultSetupPhaseState: SetupPhaseState =
{
    availBoards: BoardInfo,
    usedBoards: [],
    setupSpirits: SpiritInfo,
}

export type SetupActions =
    | { type: 'placeBoard', boardName: string, place: BoardPlacement }
    | { type: 'removeBoard', boardName: string }
    | { type: 'placeSpirit', spiritIdx: number, boardName: string }
    | { type: 'removeSpirit', spiritIdx: number }
    | { type: 'startGame' }
    ;

export function setupReducer(G: SpiritIslandState, action: SetupActions) {
    switch (action.type) {
        case 'placeBoard': SetupMoves.placeBoard(G, action.boardName, action.place); break;
        case 'removeBoard': SetupMoves.removeBoard(G, action.boardName); break;
        case 'placeSpirit': SetupMoves.placeSpirit(G, action.spiritIdx, action.boardName); break;
        case 'removeSpirit': SetupMoves.removeSpirit(G, action.spiritIdx); break;
        case 'startGame': SetupMoves.startGame(G); break;
    }
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

const SetupMoves = {
    placeBoard: function (G: SpiritIslandState, boardName: string, place: BoardPlacement) {
        if (!place) throw new Error("Board Placement is not defined");
        //add new board
        const availBoardIdx = G.availBoards.findIndex(b => b.name === boardName);
        const usedBoardIdx = G.usedBoards.findIndex(b => b.name === boardName);
        if (availBoardIdx === -1 && usedBoardIdx === -1) {
            throw new Error(`Board not found. boardName=${boardName}`);
        } else if (availBoardIdx !== -1 && usedBoardIdx !== -1) {
            //TODO this can never happen => data structure is not optimal. Use flag instead of two arrays!
            throw new Error("Internal error: Same Board can't be in used and avail!");
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
                throw new Error(`Place is not valid. boardName=${boardName}`);
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
                throw new Error(`Place is not valid. boardName=${boardName}`);
            }
        }
    },
    removeBoard: function (G: SpiritIslandState, boardName: string) {
        const boardIdx = G.usedBoards.findIndex(b => b.name === boardName);
        if (boardIdx === -1) throw new Error(`Board not found. boardName=${boardName}`);
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
    placeSpirit: function (G: SpiritIslandState, spiritIdx: number, boardName: string) {
        const board = G.usedBoards.find(b => b.name === boardName);
        if (!board) throw new Error(`Board not found. boardName=${boardName}`);
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
    removeSpirit: function (G: SpiritIslandState, spiritIdx: number) {
        G.setupSpirits[spiritIdx].curretBoard = undefined;
    },

    startGame: function (G: SpiritIslandState) {
        //we need at least one board
        if (G.usedBoards.length === 0) {
            throw new Error(`we need at least one board`);
        }
        //each board needs a spirit
        if (G.usedBoards.some(b => G.setupSpirits.every(s => s.curretBoard !== b.name))) {
            throw new Error(`each board needs a spirit`);
        }
        //Boards may not overlap
        //TODO
        //no gaps beetween boards alowed
        //TODO

        G.phase = "main";
        mainPhaseSetup(G)
    }
}
