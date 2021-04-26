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
    increaseToken: function (G: SpiritIslandState, ctx: Ctx, boardName: string, landNumber: number, tokenType: TokenType) {
        const tokens = G.boardTokens?.find(b => b.boardName === boardName)?.lands.find(l => l.landNumber === landNumber)?.tokens;
        if (!tokens) {
            return INVALID_MOVE;
        }
        const token = tokens.find(t => t.tokenType === tokenType);
        if (token) {
            //increase existing token
            token.count++;
        } else {
            //add new token
            tokens.push({
                tokenType: tokenType,
                count: 1
            })
        }
    },
    decreaseToken: function (G: SpiritIslandState, ctx: Ctx, boardName: string, landNumber: number, tokenType: TokenType) {
        const tokens = G.boardTokens?.find(b => b.boardName === boardName)?.lands.find(l => l.landNumber === landNumber)?.tokens;
        if (!tokens) {
            return INVALID_MOVE;
        }
        const tokenIdx = tokens.findIndex(t => t.tokenType === tokenType);
        if (tokenIdx === -1) {
            return INVALID_MOVE;
        } else {
            //decrease existing token
            if (tokens[tokenIdx].count <= 1) {
                //delete token
                tokens.splice(tokenIdx,1);
            } else {
                tokens[tokenIdx].count--;
            }
        }
    },

}
