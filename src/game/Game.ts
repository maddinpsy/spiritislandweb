import { Ctx, Game } from 'boardgame.io';
import { ActivePlayers } from 'boardgame.io/core';

//relative include path is neccesry, because we use esm for the server backend
import { SetupPhase, SetupPhaseState } from './SetupPhase';


export type SpiritIslandState = SetupPhaseState & {};

export const SpiritIsland: Game<SpiritIslandState, Ctx> = {
    name: "SpiritIsland",
    minPlayers: 1,
    //maxPlayers: 99,
    turn: {
        activePlayers: ActivePlayers.ALL
    },
    ...SetupPhase
};

