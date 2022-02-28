//relative path, because we use esm to start
import { Types } from "../spirit-island-card-katalog/types";
import { DB } from "../spirit-island-card-katalog/db";
import { SpiritIslandState } from "./Game";
import { SetupSpirit } from "./GamePhaseSetup";
import { InvaderCardData, InvaderCardsStage1, InvaderCardsStage2, InvaderCardsStage3 } from "./InvaderCards";
import { shuffleArray } from "../helper/random"

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

export type MainActions =
    | { type: "increaseToken", boardName: string, landNumber: number, tokenType: TokenType }
    | { type: "decreaseToken", boardName: string, landNumber: number, tokenType: TokenType }
    | { type: "setSpiritEnergy", spiritName: string, energy: number }
    | { type: "setSpiritDestroyedPresences", spiritName: string, destroyedPresences: number }
    | { type: "setSpiritElement", spiritName: string, elementType: Types.Elements, count: number }
    | { type: "toggleSpiritPanelPresence", spiritName: string, presenceIndex: number }
    | { type: "playCard", spiritName: string, handCardIdx: number }
    | { type: "discardFromHand", spiritName: string, handCardIdx: number }
    | { type: "forgetFromHand", spiritName: string, handCardIdx: number }
    | { type: "undoPlayCard", spiritName: string, playCardIdx: number }
    | { type: "discardPlayed", spiritName: string, playCardIdx: number }
    | { type: "discardAllPlayed", spiritName: string }
    | { type: "forgetFromPlayed", spiritName: string, playCardIdx: number }
    | { type: "reclaimCards", spiritName: string }
    | { type: "reclaimOne", spiritName: string, discardedCardIdx: number }
    | { type: "forgetFromDiscarded", spiritName: string, discardedCardIdx: number }
    | { type: "flipOne", deckType: Types.PowerDeckType }
    | { type: "flipFour", deckType: Types.PowerDeckType }
    | { type: "takeFlipped", deckType: Types.PowerDeckType, flipSetIdx: number, cardIdx: number, spiritName: string }
    | { type: "discardFlipSet", deckType: Types.PowerDeckType, flipSetIdx: number }
    | { type: "takeDiscarded", deckType: Types.PowerDeckType, discardedCardIdx: number, spiritName: string }
    | { type: "invadersExplore", idx: number }
    | { type: "invadersBuild", idx: number }
    | { type: "invadersRage", idx: number }
    | { type: "invadersDiscard", idx: number }
    | { type: "fearCardFlip", pileNumber: number, idx: number }
    | { type: "fearCardEarn" }
    | { type: "fearCardDiscard" }
    | { type: "setGeneratedFear", count: number }
    | { type: "setBlightOnCard", count: number }
    ;

export function mainReducer(G: SpiritIslandState, action: MainActions) {
    switch (action.type) {
        case "increaseToken": MainMoves.increaseToken(G, action.boardName, action.landNumber, action.tokenType); break;
        case "decreaseToken": MainMoves.decreaseToken(G, action.boardName, action.landNumber, action.tokenType); break;
        case "setSpiritEnergy": MainMoves.setSpiritEnergy(G, action.spiritName, action.energy); break;
        case "setSpiritDestroyedPresences": MainMoves.setSpiritDestroyedPresences(G, action.spiritName, action.destroyedPresences); break;
        case "setSpiritElement": MainMoves.setSpiritElement(G, action.spiritName, action.elementType, action.count); break;
        case "toggleSpiritPanelPresence": MainMoves.toggleSpiritPanelPresence(G, action.spiritName, action.presenceIndex); break;
        case "playCard": MainMoves.playCard(G, action.spiritName, action.handCardIdx); break;
        case "discardFromHand": MainMoves.discardFromHand(G, action.spiritName, action.handCardIdx); break;
        case "forgetFromHand": MainMoves.forgetFromHand(G, action.spiritName, action.handCardIdx); break;
        case "undoPlayCard": MainMoves.undoPlayCard(G, action.spiritName, action.playCardIdx); break;
        case "discardPlayed": MainMoves.discardPlayed(G, action.spiritName, action.playCardIdx); break;
        case "discardAllPlayed": MainMoves.discardAllPlayed(G, action.spiritName); break;
        case "forgetFromPlayed": MainMoves.forgetFromPlayed(G, action.spiritName, action.playCardIdx); break;
        case "reclaimCards": MainMoves.reclaimCards(G, action.spiritName); break;
        case "reclaimOne": MainMoves.reclaimOne(G, action.spiritName, action.discardedCardIdx); break;
        case "forgetFromDiscarded": MainMoves.forgetFromDiscarded(G, action.spiritName, action.discardedCardIdx); break;
        case "flipOne": MainMoves.flipOne(G, action.deckType); break;
        case "flipFour": MainMoves.flipFour(G, action.deckType); break;
        case "takeFlipped": MainMoves.takeFlipped(G, action.deckType, action.flipSetIdx, action.cardIdx, action.spiritName); break;
        case "discardFlipSet": MainMoves.discardFlipSet(G, action.deckType, action.flipSetIdx); break;
        case "takeDiscarded": MainMoves.takeDiscarded(G, action.deckType, action.discardedCardIdx, action.spiritName); break;
        case "invadersExplore": MainMoves.invadersExplore(G, action.idx); break;
        case "invadersBuild": MainMoves.invadersBuild(G, action.idx); break;
        case "invadersRage": MainMoves.invadersRage(G, action.idx); break;
        case "invadersDiscard": MainMoves.invadersDiscard(G, action.idx); break;
        case "fearCardFlip": MainMoves.fearCardFlip(G, action.pileNumber, action.idx); break;
        case "fearCardEarn": MainMoves.fearCardEarn(G,); break;
        case "fearCardDiscard": MainMoves.fearCardDiscard(G,); break;
        case "setGeneratedFear": MainMoves.setGeneratedFear(G, action.count); break;
        case "setBlightOnCard": MainMoves.setBlightOnCard(G, action.count); break;
    }
}


export function mainPhaseSetup(G: SpiritIslandState, seed: string = "") {
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
    G.minorPowercards.available = DB.PowerCards
        .filter(c => c.type === Types.PowerDeckType.Minor)
        .filter(c => c.set === Types.ProductSet.Basegame)
        .map(c => c.toPureData());
    shuffleArray(G.minorPowercards.available)

    G.majorPowercards.available = DB.PowerCards
        .filter(c => c.type === Types.PowerDeckType.Major)
        .filter(c => c.set === Types.ProductSet.Basegame)
        .map(c => c.toPureData());
    shuffleArray(G.majorPowercards.available)

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
    G.invaderDeck.available = [...s1, ...s2, ...s3];

    //init fear deck
    const fearDeckLayout = [3, 3, 3];
    let allFearCards = DB.FearCards
        .filter(c => c.set === Types.ProductSet.Basegame)
        .map(c => c.toPureData());
    shuffleArray(allFearCards);
    G.fearDeck.deckLeve1 = allFearCards.splice(0, fearDeckLayout[0])
    G.fearDeck.deckLeve2 = allFearCards.splice(0, fearDeckLayout[1])
    G.fearDeck.deckLeve3 = allFearCards.splice(0, fearDeckLayout[2])

    //blight 
    G.blightOnCard = G.activeSpirits.length * 2;
}


const MainMoves = {
    //change of board status
    increaseToken: function (G: SpiritIslandState, boardName: string, landNumber: number, tokenType: TokenType) {
        const tokens = G.boardTokens?.find(b => b.boardName === boardName)?.lands.find(l => l.landNumber === landNumber)?.tokens;
        if (!tokens) {
            throw new Error(`token not found tokenType: boardName:${boardName}, landNumber:${landNumber}, tokenType:${tokenType}`);
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
    decreaseToken: function (G: SpiritIslandState, boardName: string, landNumber: number, tokenType: TokenType) {
        const tokens = G.boardTokens?.find(b => b.boardName === boardName)?.lands.find(l => l.landNumber === landNumber)?.tokens;
        if (!tokens) {
            throw new Error(`token not found tokenType: boardName:${boardName}, landNumber:${landNumber}, tokenType:${tokenType}`);
        }
        const tokenIdx = tokens.findIndex(t => t.tokenType === tokenType);
        if (tokenIdx === -1) {
            throw new Error(`tokenIndex not found tokenType: boardName:${boardName}, landNumber:${landNumber}, tokenType:${tokenType}`);
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
    setSpiritEnergy: function (G: SpiritIslandState, spiritName: string, energy: number) {
        if (energy < 0) throw new Error("Energy is negative");
        const spirit = G.activeSpirits.find(s => s.name === spiritName);
        if (!spirit) throw new Error(`Spirit not found. spiritName=${spiritName}`);
        spirit.currentEnergy = energy;
    },
    setSpiritDestroyedPresences: function (G: SpiritIslandState, spiritName: string, destroyedPresences: number) {
        if (destroyedPresences < 0) throw new Error("Presence count is negative");;
        const spirit = G.activeSpirits.find(s => s.name === spiritName);
        if (!spirit) throw new Error(`Spirit not found. spiritName=${spiritName}`);
        spirit.destroyedPresences = destroyedPresences;
    },
    setSpiritElement: function (G: SpiritIslandState, spiritName: string, elementType: Types.Elements, count: number) {
        const spirit = G.activeSpirits.find(s => s.name === spiritName);
        if (!spirit) throw new Error(`Spirit not found. spiritName=${spiritName}`);
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
    toggleSpiritPanelPresence: function (G: SpiritIslandState, spiritName: string, presenceIndex: number) {
        const spirit = G.activeSpirits.find(s => s.name === spiritName);
        if (!spirit) throw new Error(`Spirit not found. spiritName=${spiritName}`);
        spirit.presenceTrackCovered[presenceIndex] = !spirit.presenceTrackCovered[presenceIndex];
    },

    //play cards
    playCard: function (G: SpiritIslandState, spiritName: string, handCardIdx: number) {
        const spirit = G.activeSpirits.find(s => s.name === spiritName);
        if (!spirit) throw new Error(`Spirit not found. spiritName=${spiritName}`);
        if (!spirit.handCards[handCardIdx]) throw new Error(`Card not found. handCardIdx=${handCardIdx}`);

        const card = spirit.handCards.splice(handCardIdx, 1);
        if (!card) {
            throw new Error("Move: playCard card is null");
        }
        spirit.playedCards.push(card[0]);
    },
    discardFromHand: function (G: SpiritIslandState, spiritName: string, handCardIdx: number) {
        const spirit = G.activeSpirits.find(s => s.name === spiritName);
        if (!spirit) throw new Error(`Spirit not found. spiritName=${spiritName}`);
        if (!spirit.handCards[handCardIdx]) throw new Error(`Card not found. handCardIdx=${handCardIdx}`);
        const card = spirit.handCards.splice(handCardIdx, 1);
        if (!card) {
            throw new Error("Move: playCard card is null");
        }
        spirit.discardedCards.push(card[0]);
    },
    forgetFromHand: function (G: SpiritIslandState, spiritName: string, handCardIdx: number) {
        const spirit = G.activeSpirits.find(s => s.name === spiritName);
        if (!spirit) throw new Error(`Spirit not found. spiritName=${spiritName}`);
        if (!spirit.handCards[handCardIdx]) throw new Error(`Card not found. handCardIdx=${handCardIdx}`);

        const card = spirit.handCards.splice(handCardIdx, 1);
        if (!card || card.length !== 1) {
            throw new Error("Move: playCard card is null");
        }
        if (card[0].type === Types.PowerDeckType.Minor) {
            G.minorPowercards.discarded.push(card[0]);
        }
        if (card[0].type === Types.PowerDeckType.Major) {
            G.majorPowercards.discarded.push(card[0]);
        }
    },
    undoPlayCard: function (G: SpiritIslandState, spiritName: string, playCardIdx: number) {
        const spirit = G.activeSpirits.find(s => s.name === spiritName);
        if (!spirit) throw new Error(`Spirit not found. spiritName=${spiritName}`);
        if (!spirit.playedCards[playCardIdx]) throw new Error(`Card not found. playCardIdx=${playCardIdx}`);

        const card = spirit.playedCards.splice(playCardIdx, 1);
        if (!card) {
            throw new Error("Move: undoPlayCard: card is null");
        }
        spirit.handCards.push(card[0]);
    },
    discardPlayed: function (G: SpiritIslandState, spiritName: string, playCardIdx: number) {
        const spirit = G.activeSpirits.find(s => s.name === spiritName);
        if (!spirit) throw new Error(`Spirit not found. spiritName=${spiritName}`);
        if (!spirit.playedCards[playCardIdx]) throw new Error(`Card not found. playCardIdx=${playCardIdx}`);

        const card = spirit.playedCards.splice(playCardIdx, 1);
        if (!card) {
            throw new Error("Move: discardPlayed: card is null");
        }
        spirit.discardedCards.push(card[0]);
    },
    discardAllPlayed: function (G: SpiritIslandState, spiritName: string) {
        const spirit = G.activeSpirits.find(s => s.name === spiritName);
        if (!spirit) throw new Error(`Spirit not found. spiritName=${spiritName}`);

        spirit.playedCards.forEach(card =>
            spirit.discardedCards.push(card)
        );
        spirit.playedCards = [];
    },
    forgetFromPlayed: function (G: SpiritIslandState, spiritName: string, playCardIdx: number) {
        const spirit = G.activeSpirits.find(s => s.name === spiritName);
        if (!spirit) throw new Error(`Spirit not found. spiritName=${spiritName}`);
        if (!spirit.playedCards[playCardIdx]) throw new Error(`Card not found. playCardIdx=${playCardIdx}`);

        const card = spirit.playedCards.splice(playCardIdx, 1);
        if (!card || card.length !== 1) {
            throw new Error("Move: forgetFromPlayed: card is null");
        }
        if (card[0].type === Types.PowerDeckType.Minor) {
            G.minorPowercards.discarded.push(card[0]);
        }
        if (card[0].type === Types.PowerDeckType.Major) {
            G.majorPowercards.discarded.push(card[0]);
        }
    },
    reclaimCards: function (G: SpiritIslandState, spiritName: string) {
        const spirit = G.activeSpirits.find(s => s.name === spiritName);
        if (!spirit) throw new Error(`Spirit not found. spiritName=${spiritName}`);

        spirit.discardedCards.forEach(card =>
            spirit.handCards.push(card)
        );
        spirit.discardedCards = [];
    },
    reclaimOne: function (G: SpiritIslandState, spiritName: string, discardedCardIdx: number) {
        const spirit = G.activeSpirits.find(s => s.name === spiritName);
        if (!spirit) throw new Error(`Spirit not found. spiritName=${spiritName}`);
        if (!spirit.discardedCards[discardedCardIdx]) throw new Error(`Card not found. discardedCardIdx=${discardedCardIdx}`);

        const card = spirit.discardedCards.splice(discardedCardIdx, 1);
        if (!card || card.length !== 1) {
            throw new Error("Move: reclaimOne: card is null");
        }
        spirit.handCards.push(card[0]);
    },
    forgetFromDiscarded: function (G: SpiritIslandState, spiritName: string, discardedCardIdx: number) {
        const spirit = G.activeSpirits.find(s => s.name === spiritName);
        if (!spirit) throw new Error(`Spirit not found. spiritName=${spiritName}`);
        if (!spirit.discardedCards[discardedCardIdx]) throw new Error(`Card not found. discardedCardIdx=${discardedCardIdx}`);

        const card = spirit.discardedCards.splice(discardedCardIdx, 1);
        if (!card || card.length !== 1) {
            throw new Error("Move: forgetFromDiscarded: card is null");
        }
        if (card[0].type === Types.PowerDeckType.Minor) {
            G.minorPowercards.discarded.push(card[0]);
        }
        if (card[0].type === Types.PowerDeckType.Major) {
            G.majorPowercards.discarded.push(card[0]);
        }
    },

    //card decks
    flipOne: function (G: SpiritIslandState, deckType: Types.PowerDeckType) {
        let deck = deckType === Types.PowerDeckType.Major ? G.majorPowercards : G.minorPowercards;
        //make sure we have enoght cards
        if (deck.available.length + deck.discarded.length < 1) {
            throw new Error(`deck is empty`);
        }
        //refill if empty
        if (deck.available.length === 0) {
            deck.available = deck.discarded;
            deck.discarded = [];
        }
        //remove first from available
        const card = deck.available.splice(0, 1);
        if (!card || card.length !== 1) {
            throw new Error("Move: flipOne: card is null");
        }
        //add as flipset
        deck.flipSets.push(
            {
                flippedBy: "???", //TODO
                cards: [card[0]]
            }
        )
    },
    flipFour: function (G: SpiritIslandState, deckType: Types.PowerDeckType) {
        let deck = deckType === Types.PowerDeckType.Major ? G.majorPowercards : G.minorPowercards;
        //make sure we have enoght cards
        if (deck.available.length + deck.discarded.length < 4) {
            throw new Error(`deck is empty`);
        }
        let flippedCards: Types.PowerCardData[] = [];
        for (let i = 0; i < 4; i++) {
            //refill if empty
            if (deck.available.length === 0) {
                deck.available = deck.discarded;
                deck.discarded = [];
            }
            //remove first from available
            const card = deck.available.splice(0, 1);
            if (!card || card.length !== 1) {
                throw new Error("Move: flipFour: card is null");
            }
            flippedCards.push(card[0]);
        }
        //add as flipset
        deck.flipSets.push(
            {
                flippedBy: "???", //TODO
                cards: flippedCards
            }
        )
    },
    takeFlipped: function (G: SpiritIslandState,

        deckType: Types.PowerDeckType,
        flipSetIdx: number,
        cardIdx: number,
        spiritName: string
    ) {
        let deck = deckType === Types.PowerDeckType.Major ? G.majorPowercards : G.minorPowercards;
        const spirit = G.activeSpirits.find(s => s.name === spiritName);
        if (!spirit) throw new Error(`Spirit not found. spiritName=${spiritName}`);
        const card = deck.flipSets[flipSetIdx].cards.splice(cardIdx, 1);
        if (!card || card.length !== 1) {
            throw new Error("Move: takeFlipped: card is null");
        }
        spirit.handCards.push(card[0]);
    },
    discardFlipSet(G: SpiritIslandState,

        deckType: Types.PowerDeckType,
        flipSetIdx: number,
    ) {
        let deck = deckType === Types.PowerDeckType.Major ? G.majorPowercards : G.minorPowercards;
        const flipset = deck.flipSets.splice(flipSetIdx, 1);
        if (!flipset || flipset.length !== 1) {
            throw new Error("Move: discardFlipSet: flipset is null");
        }
        flipset[0].cards.forEach(card => deck.discarded.push(card));
    },
    takeDiscarded: function (G: SpiritIslandState,

        deckType: Types.PowerDeckType,
        discardedCardIdx: number,
        spiritName: string
    ) {
        let deck = deckType === Types.PowerDeckType.Major ? G.majorPowercards : G.minorPowercards;
        const spirit = G.activeSpirits.find(s => s.name === spiritName);
        if (!spirit) throw new Error(`Spirit not found. spiritName=${spiritName}`);
        let card = deck.discarded.splice(discardedCardIdx, 1);
        if (!card || card.length !== 1) {
            throw new Error("Move: takeDiscarded: card is null");
        }
        spirit.handCards.push(card[0]);
    },

    //Invader Deck
    invadersExplore: function (G: SpiritIslandState, idx: number) {
        const card = G.invaderDeck.available.splice(idx, 1);
        if (!card || card.length !== 1) {
            throw new Error("Move: invaderExplore: card is null");
        }
        card[0].flipped = true;
        G.invaderDeck.explore.push(card[0]);
    },
    invadersBuild: function (G: SpiritIslandState, idx: number) {
        const card = G.invaderDeck.explore.splice(idx, 1);
        if (!card || card.length !== 1) {
            throw new Error("Move: invaderBuild: card is null");
        }
        G.invaderDeck.build.push(card[0]);
    },
    invadersRage: function (G: SpiritIslandState, idx: number) {
        const card = G.invaderDeck.build.splice(idx, 1);
        if (!card || card.length !== 1) {
            throw new Error("Move: invaderRage: card is null");
        }
        G.invaderDeck.rage.push(card[0]);
    },
    invadersDiscard: function (G: SpiritIslandState, idx: number) {
        const card = G.invaderDeck.rage.splice(idx, 1);
        if (!card || card.length !== 1) {
            throw new Error("Move: invaderDiscard: card is null");
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
    fearCardFlip: function (G: SpiritIslandState, pileNumber: number, idx: number) {
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
            throw new Error("Move: fearCardFlip: card is null");
        }
        card.flipped = true;
    },
    fearCardEarn: function (G: SpiritIslandState) {
        let card: Types.FearCardData | undefined;
        if (G.fearDeck.deckLeve1.length > 0) {
            card = G.fearDeck.deckLeve1.splice(0, 1)[0];
        } else if (G.fearDeck.deckLeve2.length > 0) {
            card = G.fearDeck.deckLeve2.splice(0, 1)[0];
        } else if (G.fearDeck.deckLeve3.length > 0) {
            card = G.fearDeck.deckLeve3.splice(0, 1)[0];
        }

        if (!card) {
            throw new Error("Move: fearCardEarn: card is null");
        }
        G.fearDeck.earned.push(card);
    },
    fearCardDiscard: function (G: SpiritIslandState) {
        let card: Types.FearCardData | undefined;
        if (G.fearDeck.earned.length > 0) {
            card = G.fearDeck.earned.splice(0, 1)[0];
        }
        if (!card) {
            throw new Error("Move: fearCardDiscard: card is null");
        }
        G.fearDeck.discarded.push(card);
    },
    setGeneratedFear: function (G: SpiritIslandState, count: number) {
        if (count < 0 || count >= G.activeSpirits.length * 4) {
            count = 0;
        }
        G.fearGenerated = count;
    },

    //Blight
    setBlightOnCard: function (G: SpiritIslandState, count: number) {
        if (count < 0) throw new Error("blight count is negative");
        G.blightOnCard = count;
    }
}
