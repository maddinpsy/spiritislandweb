import { Button } from "components/Button";
import { SubscribeWindow } from "components/SubscribeWindow";
import * as React from "react";

import style from "./style.module.scss";

export class StartButton extends React.Component<{}, { popupVisible: boolean }> {
    constructor(props: BottomRowProps) {
        super(props);
        this.state = { popupVisible: false };
    }
    render() {
        return (
            <div>
                {this.state.popupVisible ?
                    <SubscribeWindow onClose={() => this.setState({ popupVisible: false })} /> : ""
                }
                <Button onClick={() => this.setState({ popupVisible: true })} className={style.BottomRow__startButton}>
                    Start <br /> Game
            </Button>
            </div>
        )
    }
}

export interface BottomRowProps {

}

export class BottomRow extends React.Component<BottomRowProps> {
    constructor(props: BottomRowProps) {
        super(props);
    }

    render() {
        return (
            <div className={style.BottomRow__container}>
                <StartButton />
            </div>
        );
    }
}

