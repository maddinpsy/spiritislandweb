import { Ctx } from "boardgame.io";
import { INVALID_MOVE } from 'boardgame.io/core';
//relative path, because we use esm to start
import { Types } from "../spirit-island-card-katalog/types";
import { DB } from "../spirit-island-card-katalog/db";
import { SpiritIslandState } from "./Game";
import { SetupSpirit } from "./GamePhaseSetup";
import { InvaderCardData, InvaderCardsStage1, InvaderCardsStage2, InvaderCardsStage3 } from "./InvaderCards";

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
    presenceTrackCovered: boolean[]
}

export type PowerCardPileData = {
    available: Types.PowerCardData[]
    discarded: Types.PowerCardData[]
    flipSets: {
        flippedBy: string,
        cards: Types.PowerCardData[]
    }[]
}

export type FearCardPileData = {
    deckLeve1: Types.FearCardData[]
    deckLeve2: Types.FearCardData[]
    deckLeve3: Types.FearCardData[]
    earned: Types.FearCardData[]
    discarded: Types.FearCardData[]
}

export type MainPhaseState =
    {
        //Tokens on the boards, as array
        boardTokens?: BoardToken[]
        activeSpirits: ActiveSpirit[]

        //power cards
        minorPowercards: PowerCardPileData
        majorPowercards: PowerCardPileData

        //Invader Deck
        invaderDeck: {
            available: InvaderCardData[]
            explore: InvaderCardData[]
            build: InvaderCardData[]
            rage: InvaderCardData[]
            discard: InvaderCardData[]
        }
        //Fear
        fearDeck: FearCardPileData,
        fearGenerated: number,

        blightOnCard: number,
        //healthyIsland:boolean,
    }

export const defaultMainPhaseState: MainPhaseState =
{
    boardTokens: undefined,
    activeSpirits: [],
    minorPowercards: {
        available: [],
        discarded: [],
        flipSets: []
    },
    majorPowercards: {
        available: [],
        discarded: [],
        flipSets: []
    },
    invaderDeck: {
        available: [],
        explore: [],
        build: [],
        rage: [],
        discard: []
    },
    fearDeck: {
        deckLeve1: [],
        deckLeve2: [],
        deckLeve3: [],
        earned: [],
        discarded: [],
    },
    fearGenerated: 0,
    blightOnCard: 0
}

export function mainPhaseSetup(G: SpiritIslandState, ctx: Ctx) {
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
                presenceTrackCovered: setupSpirit.presenceAppearance.presenceTrackPosition.map(_ => true),
                ...setupSpirit
            }
        });

    //init powercard decks
    G.minorPowercards.available = DB.PowerCards.
        filter(c => c.type === Types.PowerDeckType.Minor).
        filter(c => c.set === Types.ProductSet.Basegame).
        map(c => c.toPureData());
    G.majorPowercards.available = DB.PowerCards.
        filter(c => c.type === Types.PowerDeckType.Major).
        filter(c => c.set === Types.ProductSet.Basegame).
        map(c => c.toPureData());

    //init invader deck
    if (!ctx.random) {
        throw new Error("Cant setup Invader Deck, random is missing.");
    }
    //number of cards in each stage
    const invaderDeckLayout = [3, 4, 5];
    //Start with all cards
    let s1 = InvaderCardsStage1;
    //shuffle
    s1 = ctx.random.Shuffle(s1);
    //remove cards to match given number
    s1.splice(0, s1.length - invaderDeckLayout[0]);
    //Start with all cards
    let s2 = InvaderCardsStage2;
    //shuffle
    s2 = ctx.random.Shuffle(s2);
    //remove cards to match given number
    s2.splice(0, s2.length - invaderDeckLayout[1]);
    //Start with all cards
    let s3 = InvaderCardsStage3;
    //shuffle
    s3 = ctx.random.Shuffle(s3);
    //remove cards to match given number
    s3.splice(0, s3.length - invaderDeckLayout[2]);
    G.invaderDeck.available = [...s1, ...s2, ...s3];

    //init fear deck
    const fearDeckLayout = [3, 3, 3];
    let allFearCards = DB.FearCards
        .filter(c => c.set === Types.ProductSet.Basegame)
        .map(c => c.toPureData());
    allFearCards = ctx.random.Shuffle(allFearCards);
    G.fearDeck.deckLeve1 = allFearCards.splice(0, fearDeckLayout[0])
    G.fearDeck.deckLeve2 = allFearCards.splice(0, fearDeckLayout[1])
    G.fearDeck.deckLeve3 = allFearCards.splice(0, fearDeckLayout[2])

    //blight 
    G.blightOnCard = G.activeSpirits.length * 2;
}


export const MainMoves = {
    //change of board status
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

    //change of spirit status
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
        if (!card) {
            console.log("Move: playCard card is null");
            return INVALID_MOVE;
        }
        spirit.playedCards.push(card[0]);
    },
    discardFromHand: function (G: SpiritIslandState, ctx: Ctx, spiritName: string, handCardIdx: number) {
        const spirit = G.activeSpirits.find(s => s.name === spiritName);
        if (!spirit) return INVALID_MOVE;
        if (!spirit.handCards[handCardIdx]) return INVALID_MOVE;

        const card = spirit.handCards.splice(handCardIdx, 1);
        if (!card) {
            console.log("Move: playCard card is null");
            return INVALID_MOVE;
        }
        spirit.discardedCards.push(card[0]);
    },
    forgetFromHand: function (G: SpiritIslandState, ctx: Ctx, spiritName: string, handCardIdx: number) {
        const spirit = G.activeSpirits.find(s => s.name === spiritName);
        if (!spirit) return INVALID_MOVE;
        if (!spirit.handCards[handCardIdx]) return INVALID_MOVE;

        const card = spirit.handCards.splice(handCardIdx, 1);
        if (!card || card.length !== 1) {
            console.log("Move: playCard card is null");
            return INVALID_MOVE;
        }
        if (card[0].type === Types.PowerDeckType.Minor) {
            G.minorPowercards.discarded.push(card[0]);
        }
        if (card[0].type === Types.PowerDeckType.Major) {
            G.majorPowercards.discarded.push(card[0]);
        }
    },
    undoPlayCard: function (G: SpiritIslandState, ctx: Ctx, spiritName: string, playCardIdx: number) {
        const spirit = G.activeSpirits.find(s => s.name === spiritName);
        if (!spirit) return INVALID_MOVE;
        if (!spirit.playedCards[playCardIdx]) return INVALID_MOVE;

        const card = spirit.playedCards.splice(playCardIdx, 1);
        if (!card) {
            console.log("Move: undoPlayCard: card is null");
            return INVALID_MOVE;
        }
        spirit.handCards.push(card[0]);
    },
    discardPlayed: function (G: SpiritIslandState, ctx: Ctx, spiritName: string, playCardIdx: number) {
        const spirit = G.activeSpirits.find(s => s.name === spiritName);
        if (!spirit) return INVALID_MOVE;
        if (!spirit.playedCards[playCardIdx]) return INVALID_MOVE;

        const card = spirit.playedCards.splice(playCardIdx, 1);
        if (!card) {
            console.log("Move: discardPlayed: card is null");
            return INVALID_MOVE;
        }
        spirit.discardedCards.push(card[0]);
    },
    discardAllPlayed: function (G: SpiritIslandState, ctx: Ctx, spiritName: string) {
        const spirit = G.activeSpirits.find(s => s.name === spiritName);
        if (!spirit) return INVALID_MOVE;

        spirit.playedCards.forEach(card =>
            spirit.discardedCards.push(card)
        );
        spirit.playedCards = [];
    },
    forgetFromPlayed: function (G: SpiritIslandState, ctx: Ctx, spiritName: string, playCardIdx: number) {
        const spirit = G.activeSpirits.find(s => s.name === spiritName);
        if (!spirit) return INVALID_MOVE;
        if (!spirit.playedCards[playCardIdx]) return INVALID_MOVE;

        const card = spirit.playedCards.splice(playCardIdx, 1);
        if (!card || card.length !== 1) {
            console.log("Move: forgetFromPlayed: card is null");
            return INVALID_MOVE;
        }
        if (card[0].type === Types.PowerDeckType.Minor) {
            G.minorPowercards.discarded.push(card[0]);
        }
        if (card[0].type === Types.PowerDeckType.Major) {
            G.majorPowercards.discarded.push(card[0]);
        }
    },
    reclaimCards: function (G: SpiritIslandState, ctx: Ctx, spiritName: string) {
        const spirit = G.activeSpirits.find(s => s.name === spiritName);
        if (!spirit) return INVALID_MOVE;

        spirit.discardedCards.forEach(card =>
            spirit.handCards.push(card)
        );
        spirit.discardedCards = [];
    },
    reclaimOne: function (G: SpiritIslandState, ctx: Ctx, spiritName: string, discardedCardIdx: number) {
        const spirit = G.activeSpirits.find(s => s.name === spiritName);
        if (!spirit) return INVALID_MOVE;
        if (!spirit.discardedCards[discardedCardIdx]) return INVALID_MOVE;

        const card = spirit.discardedCards.splice(discardedCardIdx, 1);
        if (!card || card.length !== 1) {
            console.log("Move: reclaimOne: card is null");
            return INVALID_MOVE;
        }
        spirit.handCards.push(card[0]);
    },
    forgetFromDiscarded: function (G: SpiritIslandState, ctx: Ctx, spiritName: string, discardedCardIdx: number) {
        const spirit = G.activeSpirits.find(s => s.name === spiritName);
        if (!spirit) return INVALID_MOVE;
        if (!spirit.discardedCards[discardedCardIdx]) return INVALID_MOVE;

        const card = spirit.discardedCards.splice(discardedCardIdx, 1);
        if (!card || card.length !== 1) {
            console.log("Move: forgetFromDiscarded: card is null");
            return INVALID_MOVE;
        }
        if (card[0].type === Types.PowerDeckType.Minor) {
            G.minorPowercards.discarded.push(card[0]);
        }
        if (card[0].type === Types.PowerDeckType.Major) {
            G.majorPowercards.discarded.push(card[0]);
        }
    },

    //card decks
    flipOne: function (G: SpiritIslandState, ctx: Ctx, deckType: Types.PowerDeckType) {
        if (!ctx.playerID) {
            console.log("Move flipOne was made, but playerID is not set.")
            return INVALID_MOVE;
        }
        if (!ctx.random) {
            throw new Error("Can't flipOne without random")
        }
        let deck = deckType === Types.PowerDeckType.Major ? G.majorPowercards : G.minorPowercards;
        //make sure we have enoght cards
        if (deck.available.length + deck.discarded.length < 1) {
            return INVALID_MOVE;
        }
        //refill if empty
        if (deck.available.length === 0) {
            deck.available = deck.discarded;
            deck.discarded = [];
        }
        //flip a random card
        const idx = ctx.random.Die(deck.available.length) - 1;
        //remove from available
        const card = deck.available.splice(idx, 1);
        if (!card || card.length !== 1) {
            console.log("Move: flipOne: card is null");
            return INVALID_MOVE;
        }
        //add as flipset
        deck.flipSets.push(
            {
                flippedBy: ctx.playerID,
                cards: [card[0]]
            }
        )
    },
    flipFour: function (G: SpiritIslandState, ctx: Ctx, deckType: Types.PowerDeckType) {
        if (!ctx.playerID) {
            console.log("Move flipOne was made, but playerID is not set.")
            return INVALID_MOVE;
        }
        if (!ctx.random) {
            throw new Error("Can't flipOne without random")
        }
        let deck = deckType === Types.PowerDeckType.Major ? G.majorPowercards : G.minorPowercards;
        //make sure we have enoght cards
        if (deck.available.length + deck.discarded.length < 4) {
            return INVALID_MOVE;
        }
        let flippedCards: Types.PowerCardData[] = [];
        for (let i = 0; i < 4; i++) {
            //refill if empty
            if (deck.available.length === 0) {
                deck.available = deck.discarded;
                deck.discarded = [];
            }
            //flip a random card
            const idx = ctx.random.Die(deck.available.length) - 1;
            //remove from available
            const card = deck.available.splice(idx, 1);
            if (!card || card.length !== 1) {
                console.log("Move: flipFour: card is null");
                return INVALID_MOVE;
            }
            flippedCards.push(card[0]);
        }
        //add as flipset
        deck.flipSets.push(
            {
                flippedBy: ctx.playerID,
                cards: flippedCards
            }
        )
    },
    takeFlipped: function (G: SpiritIslandState,
        ctx: Ctx,
        deckType: Types.PowerDeckType,
        flipSetIdx: number,
        cardIdx: number,
        spiritName: string
    ) {
        let deck = deckType === Types.PowerDeckType.Major ? G.majorPowercards : G.minorPowercards;
        const spirit = G.activeSpirits.find(s => s.name === spiritName);
        if (!spirit) return INVALID_MOVE;
        const card = deck.flipSets[flipSetIdx].cards.splice(cardIdx, 1);
        if (!card || card.length !== 1) {
            console.log("Move: takeFlipped: card is null");
            return INVALID_MOVE;
        }
        spirit.handCards.push(card[0]);
    },
    discardFlipSet(G: SpiritIslandState,
        ctx: Ctx,
        deckType: Types.PowerDeckType,
        flipSetIdx: number,
    ) {
        let deck = deckType === Types.PowerDeckType.Major ? G.majorPowercards : G.minorPowercards;
        const flipset = deck.flipSets.splice(flipSetIdx, 1);
        if (!flipset || flipset.length !== 1) {
            console.log("Move: discardFlipSet: flipset is null");
            return INVALID_MOVE;
        }
        flipset[0].cards.forEach(card => deck.discarded.push(card));
    },
    takeDiscarded: function (G: SpiritIslandState,
        ctx: Ctx,
        deckType: Types.PowerDeckType,
        discardedCardIdx: number,
        spiritName: string
    ) {
        let deck = deckType === Types.PowerDeckType.Major ? G.majorPowercards : G.minorPowercards;
        const spirit = G.activeSpirits.find(s => s.name === spiritName);
        if (!spirit) return INVALID_MOVE;
        let card = deck.discarded.splice(discardedCardIdx, 1);
        if (!card || card.length !== 1) {
            console.log("Move: takeDiscarded: card is null");
            return INVALID_MOVE;
        }
        spirit.handCards.push(card[0]);
    },

    //Invader Deck
    invadersExplore: function (G: SpiritIslandState, ctx: Ctx, idx: number) {
        const card = G.invaderDeck.available.splice(idx, 1);
        if (!card || card.length !== 1) {
            console.log("Move: invaderExplore: card is null");
            return INVALID_MOVE;
        }
        G.invaderDeck.explore.push(card[0]);
    },
    invadersBuild: function (G: SpiritIslandState, ctx: Ctx, idx: number) {
        const card = G.invaderDeck.explore.splice(idx, 1);
        if (!card || card.length !== 1) {
            console.log("Move: invaderBuild: card is null");
            return INVALID_MOVE;
        }
        G.invaderDeck.build.push(card[0]);
    },
    invadersRage: function (G: SpiritIslandState, ctx: Ctx, idx: number) {
        const card = G.invaderDeck.build.splice(idx, 1);
        if (!card || card.length !== 1) {
            console.log("Move: invaderRage: card is null");
            return INVALID_MOVE;
        }
        G.invaderDeck.rage.push(card[0]);
    },
    invadersDiscard: function (G: SpiritIslandState, ctx: Ctx, idx: number) {
        const card = G.invaderDeck.rage.splice(idx, 1);
        if (!card || card.length !== 1) {
            console.log("Move: invaderDiscard: card is null");
            return INVALID_MOVE;
        }
        G.invaderDeck.discard.push(card[0]);
    },

    //fearCards
    /**
     * Shows on fear card face up, for the rest of the game.
     * @param G 
     * @param ctx 
     * @param pileNumber 1: deckLeve1,..., 3: deckLeve3, 4:earnd, 5:discarded
     * @param idx array index of the card in that pile
     */
    fearCardFlip: function (G: SpiritIslandState, ctx: Ctx, pileNumber: number, idx: number) {
        let card: Types.FearCardData | undefined;
        switch (pileNumber) {
            case 1:
                card = G.fearDeck.deckLeve1[idx];
                break;
            case 2:
                card = G.fearDeck.deckLeve2[idx];
                break;
            case 3:
                card = G.fearDeck.deckLeve3[idx];
                break;
            case 4:
                card = G.fearDeck.earned[idx];
                break;
            case 5:
                card = G.fearDeck.discarded[idx];
                break;

        }
        if (!card) {
            console.log("Move: fearCardFlip: card is null");
            return INVALID_MOVE;
        }
        card.flipped = true;
    },
    fearCardEarn: function (G: SpiritIslandState, ctx: Ctx) {
        let card: Types.FearCardData | undefined;
        if (G.fearDeck.deckLeve1.length > 0) {
            card = G.fearDeck.deckLeve1.splice(0, 1)[0];
        } else if (G.fearDeck.deckLeve2.length > 0) {
            card = G.fearDeck.deckLeve2.splice(0, 1)[0];
        } else if (G.fearDeck.deckLeve3.length > 0) {
            card = G.fearDeck.deckLeve3.splice(0, 1)[0];
        }

        if (!card) {
            console.log("Move: fearCardEarn: card is null");
            return INVALID_MOVE;
        }
        G.fearDeck.earned.push(card);
    },
    fearCardDiscard: function (G: SpiritIslandState, ctx: Ctx) {
        let card: Types.FearCardData | undefined;
        if (G.fearDeck.earned.length > 0) {
            card = G.fearDeck.earned.splice(0, 1)[0];
        }
        if (!card) {
            console.log("Move: fearCardDiscard: card is null");
            return INVALID_MOVE;
        }
        G.fearDeck.discarded.push(card);
    },
    setGeneratedFear: function (G: SpiritIslandState, ctx: Ctx, count: number) {
        count = count % (G.activeSpirits.length * 4 + 1);
        count += G.activeSpirits.length * 4 + 1;
        count = count % (G.activeSpirits.length * 4 + 1);
        G.fearGenerated = count;
    },

    //Blight
    setBlightOnCard: function (G: SpiritIslandState, ctx: Ctx, count: number) {
        if (count < 0) return INVALID_MOVE;
        G.blightOnCard = count;
    }
}
