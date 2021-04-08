import * as React from "react";

import { BoardProps } from "boardgame.io/react";
import { SpiritIslandState } from "game/Game";
import { IslandArea } from "./IslandArea";

export class SpiritIslandBoard extends React.Component<BoardProps<SpiritIslandState>, {loading:boolean}> {
    constructor(props:any){
        super(props)
        this.state={loading:true}
    }
    componentDidMount(){
        //avoid startup flicker, for one second
        window.setTimeout(()=>this.setState({loading:false}),1000);
    }
    render() {
        if(this.state.loading){
            //show loading compontne to avoid startup flicker
            return (<div>connecting..</div>)
        }
        //mapping from id to name comes from this.props.matchData  
        return (
            <IslandArea />
        );
    }
}
