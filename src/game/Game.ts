
//relative include path is neccesry, because we use esm for the server backend
import { defaultSetupPhaseState, SetupActions, SetupPhaseState, setupReducer } from './GamePhaseSetup';
import { MainPhaseState, defaultMainPhaseState, MainActions, mainReducer } from './GamePhaseMain';
import { produce } from 'immer'
import { defaultInvaderDeck, InvaderDeckActions, invaderDeckReducer, InvaderDeckState } from './GameInvaderDeck';

export type SpiritIslandState =
    SetupPhaseState &
    MainPhaseState &
    InvaderDeckState &
    {
        SoftwareVersion: string,
        phase: "setup" | "main"
    };

export function gameSetup(): SpiritIslandState {
    return {
        ...defaultMainPhaseState,
        ...defaultSetupPhaseState,
        ...defaultInvaderDeck,
        SoftwareVersion: "0.1",
        phase: "setup"
    };
}

export function rootReducer(G: SpiritIslandState, action: MainActions | SetupActions | InvaderDeckActions) {
    try {
        return produce(G, (draftG) => {
            const setupAction = action as SetupActions
            const mainAction = action as MainActions;
            const invaderAction = action as InvaderDeckActions;
            if (setupAction) {
                setupReducer(draftG, setupAction);
            }
            if (mainAction) {
                mainReducer(draftG, mainAction);
            }
            if (invaderAction) {
                invaderDeckReducer(draftG, invaderAction);
            }
        });
    } catch (ev) {
        alert(ev);
        return G;
    }
}