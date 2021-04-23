import * as React from "react";

import { BoardProps } from "boardgame.io/react";
import { SpiritIslandState } from "game/Game";
import { Loading } from "components/Loading";
import style from "./style.module.scss";
import { PhaseSetup } from "components/PhaseSetup";
import { PhaseMain } from "components/PhaseMain";

export class SpiritIslandBoard extends React.Component<BoardProps<SpiritIslandState>, { loading: boolean }> {
    constructor(props: any) {
        super(props)
        this.state = { loading: true }
    }
    componentDidMount() {
        //avoid startup flicker, for one second
        window.setTimeout(() => this.setState({ loading: false }), 1000);
    }
    render() {
        if (this.state.loading) {
            //show loading compontne to avoid startup flicker
            return (
                <div>
                    {/* LoadingScreen overleays everything */}
                    <Loading />
                    {/* show board images in the background, so they get loaded */}
                    <div style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }}>
                        <PhaseSetup G={this.props.G} moves={this.props.moves}/>
                    </div>
                </div>
            )
        }
        if (this.props.ctx.phase === "setup") {
            return (<PhaseSetup G={this.props.G} moves={this.props.moves}/>);
        }
        if (this.props.ctx.phase === "main") {
            return (<PhaseMain G={this.props.G} moves={this.props.moves}/>);
        }
        return (<div>Error ctx.phase={this.props.ctx.phase}</div>)
    }
}
