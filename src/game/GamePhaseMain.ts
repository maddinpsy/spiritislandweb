import { Ctx } from "boardgame.io";
import { INVALID_MOVE } from 'boardgame.io/core';
//relative path, because we use esm to start
import { Types } from "../spirit-island-card-katalog/types";
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
    handCards: Types.PowerCardData[];
    playedCards: Types.PowerCardData[];
    discardedCards: Types.PowerCardData[];
    currentElements: { type: Types.Elements, count: number }[]
    /** true if precenes is still on the track
     * array is same size as presenceTrackPosition */
    presenceTrackCovered:boolean[]
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
                handCards: setupSpirit.startHand,
                discardedCards: [],
                playedCards: [],
                currentElements: [],
                presenceTrackCovered:setupSpirit.presenceAppearance.presenceTrackPosition.map(_=>true),
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

    setSpiritEnergy: function (G: SpiritIslandState, ctx: Ctx, spiritName: string, energy: number) {
        if (energy < 0) return INVALID_MOVE;
        const spirit = G.activeSpirits.find(s => s.name === spiritName);
        if (!spirit) return INVALID_MOVE;
        spirit.currentEnergy = energy;
    },

    setSpiritDestroyedPresences: function (G: SpiritIslandState, ctx: Ctx, spiritName: string, destroyedPresences: number) {
        if (destroyedPresences < 0) return INVALID_MOVE;
        const spirit = G.activeSpirits.find(s => s.name === spiritName);
        if (!spirit) return INVALID_MOVE;
        spirit.destroyedPresences = destroyedPresences;
    },


    setSpiritElement: function (G: SpiritIslandState, ctx: Ctx, spiritName: string, elementType: Types.Elements, count: number) {
        const spirit = G.activeSpirits.find(s => s.name === spiritName);
        if (!spirit) return INVALID_MOVE;
        const elIdx = spirit.currentElements.findIndex(e => e.type === elementType);
        if (elIdx === -1) {
            //add new element to the list
            spirit.currentElements.push({ type: elementType, count: count });
        } else {
            //update list
            if (count === 0) {
                //remove
                spirit.currentElements.splice(elIdx, 1);
            } else {
                //adjust
                spirit.currentElements[elIdx].count = count;
            }
        }
    },

    toggleSpiritPanelPresence: function (G: SpiritIslandState, ctx: Ctx, spiritName: string, presenceIndex: number) {
        const spirit = G.activeSpirits.find(s => s.name === spiritName);
        if (!spirit) return INVALID_MOVE;
        spirit.presenceTrackCovered[presenceIndex] = !spirit.presenceTrackCovered[presenceIndex];
    },

    //play cards
    playCard: function (G: SpiritIslandState, ctx: Ctx, spiritName: string, handCardIdx: number) {
        const spirit = G.activeSpirits.find(s => s.name === spiritName);
        if (!spirit) return INVALID_MOVE;
        if (!spirit.handCards[handCardIdx]) return INVALID_MOVE;

        const card = spirit.handCards.splice(handCardIdx, 1);
        spirit.playedCards.push(card[0]);
    },
    discardFromHand: function (G: SpiritIslandState, ctx: Ctx, spiritName: string, handCardIdx: number) {
        const spirit = G.activeSpirits.find(s => s.name === spiritName);
        if (!spirit) return INVALID_MOVE;
        if (!spirit.handCards[handCardIdx]) return INVALID_MOVE;

        const card = spirit.handCards.splice(handCardIdx, 1);
        spirit.discardedCards.push(card[0]);
    },
    undoPlayCard: function (G: SpiritIslandState, ctx: Ctx, spiritName: string, playCardIdx: number) {
        const spirit = G.activeSpirits.find(s => s.name === spiritName);
        if (!spirit) return INVALID_MOVE;
        if (!spirit.playedCards[playCardIdx]) return INVALID_MOVE;

        const card = spirit.playedCards.splice(playCardIdx, 1);
        spirit.handCards.push(card[0]);
    },
    discardPlayed: function (G: SpiritIslandState, ctx: Ctx, spiritName: string, playCardIdx: number) {
        const spirit = G.activeSpirits.find(s => s.name === spiritName);
        if (!spirit) return INVALID_MOVE;
        if (!spirit.playedCards[playCardIdx]) return INVALID_MOVE;

        const card = spirit.playedCards.splice(playCardIdx, 1);
        spirit.discardedCards.push(card[0]);
    },
    discardAllPlayed: function (G: SpiritIslandState, ctx: Ctx, spiritName: string) {
        const spirit = G.activeSpirits.find(s => s.name === spiritName);
        if (!spirit) return INVALID_MOVE;

        const card = spirit.playedCards.forEach(card=>
            spirit.discardedCards.push(card)
        );
        spirit.playedCards=[];
    },
    reclaimCards: function (G: SpiritIslandState, ctx: Ctx, spiritName: string) {
        const spirit = G.activeSpirits.find(s => s.name === spiritName);
        if (!spirit) return INVALID_MOVE;

        const card = spirit.discardedCards.forEach(card=>
            spirit.handCards.push(card)
        );
        spirit.discardedCards=[];
    },
    reclaimOne: function (G: SpiritIslandState, ctx: Ctx, spiritName: string, discardedCardIdx: number) {
        const spirit = G.activeSpirits.find(s => s.name === spiritName);
        if (!spirit) return INVALID_MOVE;
        if (!spirit.discardedCards[discardedCardIdx]) return INVALID_MOVE;

        const card = spirit.discardedCards.splice(discardedCardIdx, 1);
        spirit.handCards.push(card[0]);
    },


}
