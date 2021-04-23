import * as React from "react";

import { BoardProps } from "boardgame.io/react";
import { SpiritIslandState } from "game/Game";
import { AvailableBoards } from "./AvailableBoards";
import { UsedBoards } from "./UsedBoards";
import { BottomRow, StartButton } from "./BottomRow";
import { Loading } from "components/Loading";
import style from "./style.module.scss";
import { AvailableSpirits } from "./AlailableSpirits";
import { UsedSpirits } from "./UsedSpirits";

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
                        <AvailableSpirits availSpirits={this.props.G.setupSpirits} doRemoveSpirit={() => { }} />
                        <AvailableBoards availBoards={this.props.G.availBoards} removeBoard={() => { }} />
                    </div>
                </div>
            )
        }
        if (this.props.ctx.phase === "setup") {
            return (
                <div className={style.GameBoard__container}>
                    <AvailableBoards availBoards={this.props.G.availBoards} removeBoard={this.props.moves.removeBoard} />
                    <UsedBoards
                        availBoards={this.props.G.availBoards}
                        usedBoards={this.props.G.usedBoards}
                        doPlaceBoard={this.props.moves.placeBoard}
                        doPlaceSpirit={this.props.moves.placeSpirit} />
                    <UsedSpirits
                        setupSpirits={this.props.G.setupSpirits}
                        usedBoards={this.props.G.usedBoards}
                        doPlaceSpirit={this.props.moves.placeSpirit} />
                    <AvailableSpirits availSpirits={this.props.G.setupSpirits} doRemoveSpirit={this.props.moves.removeSpirit} />
                    <BottomRow>
                        <StartButton spirits={this.props.G.setupSpirits} usedBoards={this.props.G.usedBoards} onStart={this.props.moves.startGame} />
                    </BottomRow>
                </div>
            );
        }
        if (this.props.ctx.phase === "main") {
            return (
                <div className={style.GameBoard__container}>
                    <UsedBoards
                        availBoards={this.props.G.availBoards}
                        usedBoards={this.props.G.usedBoards}
                        doPlaceBoard={this.props.moves.placeBoard}
                        doPlaceSpirit={this.props.moves.placeSpirit} />
                    <BottomRow/>
                </div>
            );
        }
        return (<div>Error ctx.phase={this.props.ctx.phase}</div>)
    }
}
