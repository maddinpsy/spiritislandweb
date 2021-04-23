import { Ctx } from "boardgame.io";
import { INVALID_MOVE } from 'boardgame.io/core';
import { SpiritIslandState } from "./Game";

export type TokenType =
    "Explorer" |
    "Town" |
    "City" |
    "Dahan" |
    "Blight" |
    "Presence1" |
    "Presence2" |
    "Presence3" |
    "Presence4" |
    "Presence5" |
    "Presence6" |
    "Wild" |
    "Beast" |
    "Disease" |
    "Badlands";

export type placedToken =
    {
        tokenType: TokenType,
        count: number
    }
export type Land =
    {
        landNumber: number,
        tokens: placedToken[]
    }

export type BoardToken =
    {
        boardName: string,
        lands: Land[]
    }

export type MainPhaseState =
    {
        //as objects
        //Tokens:{[board:string]:{[land:number]:{[token:TokenType]:number}}}
        //as array
        boardTokens?: BoardToken[]
    }

function phaseSetup() {

}


export const MainMoves = {
    dostuff: function (G: SpiritIslandState, ctx: Ctx, boardName: string) {

    },

}
