import * as React from "react";

import { gameSetup, rootReducer } from "game/Game";
import { PhaseSetup } from "components/PhaseSetup";
import { PhaseMain } from "components/PhaseMain";

export function SpiritIslandBoard(props:{}) {
    //const playerNames = props.matchData || [];
    const [state,dispatch] = React.useReducer(rootReducer,gameSetup());
    if (state.phase === "setup") {
        return (<PhaseSetup G={state} dispatch={dispatch} />);
    }
    if (state.phase === "main") {
        return (<PhaseMain G={state} dispatch={dispatch} playerNames={[/*TODO*/]} />);
    }
    return <div>Error</div>
}
