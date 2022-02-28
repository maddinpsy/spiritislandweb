//relative path, because we use esm to start
import { SpiritIslandState } from "./Game";
import { InvaderCardData, InvaderCardsStage1, InvaderCardsStage2, InvaderCardsStage3 } from "./InvaderCards";
import { shuffleArray } from "../helper/random"

export type InvaderDeckState =
    {
        invaderDeck: InvaderCardData[]
    }

export type InvaderDeckActions =
    | { type: "invadersExplore", id: number, stage: InvaderCardData["stage"] }
    | { type: "invadersBuild", id: number, stage: InvaderCardData["stage"] }
    | { type: "invadersRage", id: number, stage: InvaderCardData["stage"] }
    | { type: "invadersDiscard", id: number, stage: InvaderCardData["stage"] }
    ;

export function invaderDeckReducer(G: SpiritIslandState, action: InvaderDeckActions) {
    switch (action.type) {
        case "invadersExplore": InvaderDeckMoves.invadersExplore(G, action.id, action.stage); break;
        case "invadersBuild": InvaderDeckMoves.invadersBuild(G, action.id, action.stage); break;
        case "invadersRage": InvaderDeckMoves.invadersRage(G, action.id, action.stage); break;
        case "invadersDiscard": InvaderDeckMoves.invadersDiscard(G, action.id, action.stage); break;
    }
}

export const defaultInvaderDeck = {
    invaderDeck: []
}

export function invaderDeckSetup(G: InvaderDeckState, seed: string = "") {

    //number of cards in each stage
    const invaderDeckLayout = [3, 4, 5];
    //Start with all cards
    let s1 = InvaderCardsStage1;
    //shuffle
    shuffleArray(s1, seed);
    //remove cards to match given number
    s1.splice(0, s1.length - invaderDeckLayout[0]);
    //Start with all cards
    let s2 = InvaderCardsStage2;
    //shuffle
    shuffleArray(s2, seed);
    //remove cards to match given number
    s2.splice(0, s2.length - invaderDeckLayout[1]);
    //Start with all cards
    let s3 = InvaderCardsStage3;
    //shuffle
    shuffleArray(s3, seed);
    //remove cards to match given number
    s3.splice(0, s3.length - invaderDeckLayout[2]);
    G.invaderDeck = [...s1, ...s2, ...s3];
}

const InvaderDeckMoves = {
    invadersExplore: function (G: SpiritIslandState, id: number, stage: InvaderCardData["stage"]) {
        const card = G.invaderDeck.find(c => c.id === id && c.stage === stage);
        if (!card) {
            throw new Error("Move: invaderExplore: card is null");
        }
        card.flipped = true;
        card.stack = "explore";
    },
    invadersBuild: function (G: SpiritIslandState, id: number, stage: InvaderCardData["stage"]) {
        const card = G.invaderDeck.find(c => c.id === id && c.stage === stage);
        if (!card) {
            throw new Error("Move: invaderExplore: card is null");
        }
        card.stack = "build";
    },
    invadersRage: function (G: SpiritIslandState, id: number, stage: InvaderCardData["stage"]) {
        const card = G.invaderDeck.find(c => c.id === id && c.stage === stage);
        if (!card) {
            throw new Error("Move: invaderExplore: card is null");
        }
        card.stack = "rage";
    },
    invadersDiscard: function (G: SpiritIslandState, id: number, stage: InvaderCardData["stage"]) {
        const card = G.invaderDeck.find(c => c.id === id && c.stage === stage);
        if (!card) {
            throw new Error("Move: invaderExplore: card is null");
        }
        card.stack = "discard";
    },
}
