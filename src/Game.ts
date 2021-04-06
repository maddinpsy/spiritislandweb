
import { Ctx, Game} from 'boardgame.io';

export interface SpiritIslandState
{
}

export const SpiritIsland: Game<SpiritIslandState, Ctx> = {
    name: "SpiritIsland",
    minPlayers: 1,
    maxPlayers: 99,
};

