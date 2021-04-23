import * as React from "react";

import { BoardProps } from "boardgame.io/react";
import { SpiritIslandState } from "game/Game";
import { AvailableBoards } from "./AvailableBoards";
import { UsedBoards } from "./UsedBoards";
import { BottomRow } from "./BottomRow";
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
                    <AvailableBoards availBoards={this.props.G.availBoards} removeBoard={this.props.moves.removeBoard} />
                </div>
            )
        }
        //mapping from id to name comes from this.props.matchData  
        return (
            <div className={style.GameBoard__container}>
                <AvailableBoards availBoards={this.props.G.availBoards} removeBoard={this.props.moves.removeBoard} />
                <UsedBoards 
                availBoards={this.props.G.availBoards} 
                usedBoards={this.props.G.usedBoards} 
                doPlaceBoard={this.props.moves.placeBoard} 
                doPlaceSpirit={this.props.moves.placeSpirit}/>
                <UsedSpirits 
                setupSpirits={this.props.G.setupSpirits} 
                usedBoards={this.props.G.usedBoards} 
                doPlaceSpirit={this.props.moves.placeSpirit}/>
                <AvailableSpirits availSpirits={this.props.G.setupSpirits} doRemoveSpirit={this.props.moves.removeSpirit}/>
                <BottomRow />
            </div>
        );
    }
}
