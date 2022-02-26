import { Button } from "components/Button";
import { ModalWindow } from "components/ModalWindow";
import { SubscribeWindow } from "components/SubscribeWindow";
import { Board, BoardPlacement, SetupSpirit } from "game/GamePhaseSetup";
import * as React from "react";

import style from "./style.module.scss";
export interface StartButtonProps {
    spirits: SetupSpirit[]
    usedBoards: (Board & BoardPlacement)[];
    onStart:()=>void
}
export class StartButton extends React.Component<StartButtonProps, { popupVisible: boolean, erorrMessage?: string }> {
    constructor(props: StartButtonProps) {
        super(props);
        this.state = { popupVisible: false };
        this.startGame=this.startGame.bind(this);
        this.onClosePopup=this.onClosePopup.bind(this);
    }

    startGame() {
        this.setState({ popupVisible: true });
        if (this.props.usedBoards.length === 0) {
            this.setState({ erorrMessage: "There must be at least one board!" })
        }
        //each board needs a spirit
        if (this.props.usedBoards.some(b => this.props.spirits.every(s => s.curretBoard !== b.name))) {
            this.setState({ erorrMessage: "Each board must have a spirit!" })
        }
    }
    onClosePopup() {
        this.setState({ popupVisible: false, erorrMessage: undefined });
    }

    render() {
        let popupWindow;
        if (this.state.erorrMessage) {
            popupWindow = (
                <ModalWindow title="Error" onClose={this.onClosePopup}>
                    { this.state.erorrMessage }
            </ModalWindow >
            );
    }else{
    popupWindow = <SubscribeWindow onClose={this.onClosePopup} onSuccess={this.props.onStart} />;
}
return (
    <div>
        {this.state.popupVisible && popupWindow}
        <Button onClick={() => this.startGame()} className={style.BottomRow__startButton}>
            Start <br /> Game
            </Button>
    </div>
)
    }
}

export interface BottomRowProps {

}

export class BottomRow extends React.Component<BottomRowProps> {
    render() {
        return (
            <div className={style.BottomRow__container}>
                {this.props.children}
            </div>
        );
    }
}

