
//relative include path is neccesry, because we use esm for the server backend
import { defaultSetupPhaseState, SetupActions, SetupPhaseState, setupReducer } from './GamePhaseSetup';
import { MainPhaseState, defaultMainPhaseState, MainActions, mainReducer } from './GamePhaseMain';
import { produce } from 'immer'

export type SpiritIslandState =
    SetupPhaseState &
    MainPhaseState &
    {
        SoftwareVersion: string,
        phase: "setup" | "main"
    };

export function gameSetup(): SpiritIslandState {
    return {
        ...defaultMainPhaseState,
        ...defaultSetupPhaseState,
        SoftwareVersion: "0.1",
        phase: "setup"
    };
}

export function rootReducer(G: SpiritIslandState, action: MainActions | SetupActions) {
    try {
        return produce(G, (draftG) => {
            const setupAction = action as SetupActions
            const mainAction = action as MainActions;
            if (setupAction) {
                setupReducer(draftG, setupAction);
            }
            if (mainAction) {
                mainReducer(draftG, mainAction);
            }
        });
    } catch (ev) {
        alert(ev);
        return G;
    }
}