import { Ctx } from "boardgame.io";
import { INVALID_MOVE } from 'boardgame.io/core';
import { SpiritIslandState } from "./Game";
import { SetupSpirit } from "./GamePhaseSetup";

export const TokenNames = [
    "Explorer",
    "Town",
    "City",
    "Dahan",
    "Blight",
    "Presence1",
    "Presence2",
    "Presence3",
    "Presence4",
    "Presence5",
    "Presence6",
    "Wild",
    "Beast",
    "Disease",
    "Badlands"
] as const;

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


export type PlacedToken =
    {
        tokenType: TokenType,
        count: number
    }
export type LandTokens =
    {
        landNumber: number,
        tokens: PlacedToken[]
    }

export type BoardToken =
    {
        boardName: string,
        lands: LandTokens[]
    }


export type ActiveSpirit = SetupSpirit &
{
    currentEnergy: number;
    destroyedPresences: number;
    //handCards:Cards[];
    //playedCards:Cards[];
    //discardedCards:Cards[];
    //currentElements:Elements[]
}

export type MainPhaseState =
    {
        //as objects
        //Tokens:{[board:string]:{[land:number]:{[token:TokenType]:number}}}
        //as array
        boardTokens?: BoardToken[]
        activeSpirits: ActiveSpirit[]
    }

export function mainPhaseSetup(G: SpiritIslandState) {
    //init tokens
    G.boardTokens = G.usedBoards.map(b => { return { boardName: b.name, lands: b.startTokens } });

    //adjust board layout
    //TOTO make board adjustment better, this is a bit hacky.
    G.usedBoards.forEach(b => {
        b.position.x *= 3;
        b.position.y *= 3;
    })

    //init spirits
    G.activeSpirits = G.setupSpirits
        .filter(setupSpirit => setupSpirit.curretBoard !== undefined)
        .map(setupSpirit => {
            return {
                currentEnergy: 0,
                destroyedPresences: 0,
                ...setupSpirit
            }
        });
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
                tokens.splice(tokenIdx, 1);
            } else {
                tokens[tokenIdx].count--;
            }
        }
    },

}
