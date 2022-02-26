import * as React from "react";

import { SpiritIslandState } from "game/Game";
import { AvailableBoards } from "./AvailableBoards";
import { UsedBoards } from "./UsedBoards";
import { BottomRow, StartButton } from "./BottomRow";
import style from "./style.module.scss";
import { AvailableSpirits } from "./AlailableSpirits";
import { UsedSpirits } from "./UsedSpirits";
import { SetupActions } from "game/GamePhaseSetup";

export interface PhaseSetupProps {
    G: SpiritIslandState
    dispatch: (action: SetupActions) => void
}

export class PhaseSetup extends React.Component<PhaseSetupProps> {
    render() {
        return (
            <div className={style.PhaseSetup__container}>
                <AvailableBoards availBoards={this.props.G.availBoards}
                    removeBoard={(n) => this.props.dispatch({ type: 'removeBoard', boardName: n })} />
                <UsedBoards
                    availBoards={this.props.G.availBoards}
                    usedBoards={this.props.G.usedBoards}
                    doPlaceBoard={(boardName, place) => this.props.dispatch({ type: "placeBoard", boardName: boardName, place: place })}
                    doPlaceSpirit={(spiritIdx, boardName) => this.props.dispatch({ type: "placeSpirit", spiritIdx: spiritIdx, boardName: boardName })} />
                <UsedSpirits
                    setupSpirits={this.props.G.setupSpirits}
                    usedBoards={this.props.G.usedBoards}
                    doPlaceSpirit={(spiritIdx, boardName) => this.props.dispatch({ type: "placeSpirit", spiritIdx: spiritIdx, boardName: boardName })} />
                <AvailableSpirits
                    availSpirits={this.props.G.setupSpirits}
                    doRemoveSpirit={(spiritIdx) => this.props.dispatch({ type: "removeSpirit", spiritIdx: spiritIdx })}
                />
                <BottomRow>
                    <StartButton
                        spirits={this.props.G.setupSpirits}
                        usedBoards={this.props.G.usedBoards}
                        onStart={() => this.props.dispatch({ type: "startGame" })} />
                </BottomRow>
            </div>
        );
    }
}
