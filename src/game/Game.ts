import { Ctx, Game } from 'boardgame.io';
import { ActivePlayers } from 'boardgame.io/core';

//relative include path is neccesry, because we use esm for the server backend
import { SetupMoves, SetupPhaseState, gameSetup } from './SetupPhase';
import { MainMoves, MainPhaseState } from './MainPhase';


export type SpiritIslandState = SetupPhaseState & MainPhaseState;

export const SpiritIsland: Game<SpiritIslandState, Ctx> = {
    name: "SpiritIsland",
    minPlayers: 1,
    //maxPlayers: 99,
    turn: {
        activePlayers: ActivePlayers.ALL
    },
    setup: gameSetup,
    phases: {
        setup: {
            moves: SetupMoves,
            next: "main",
            start: true,
        },
        main: {
            moves: MainMoves,
        }
    }
};

