import * as React from "react";

import { BoardProps } from "boardgame.io/react";
import { SpiritIslandState } from "Game";

export class SpiritIslandBoard extends React.Component<BoardProps<SpiritIslandState>, any> {
    render() {
        if (!this.props.matchData) {
            return (<div>"this.props.matchData is not defined."</div>);
        }
        //mapping from id to name comes from this.props.matchData  
        return (
            <div>Hello World</div>
        );
    }
}
