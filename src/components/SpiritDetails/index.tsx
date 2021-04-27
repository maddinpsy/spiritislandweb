import { Button } from "components/Button";
import { SetupSpirit } from "game/GamePhaseSetup";
import * as React from "react";

import style from "./style.module.scss";



export interface SpiritDetailsProps {
    spirit: SetupSpirit
}

interface SpiritDetailsState {
    backside: boolean;
}

export class SpiritDetails extends React.Component<SpiritDetailsProps, SpiritDetailsState> {
    constructor(props: SpiritDetailsProps) {
        super(props)
        this.state = { backside: false }
    }
    render() {
        let image = this.props.spirit.frontSideUrl;
        if (this.state.backside) {
            image = this.props.spirit.backSideUrl;
        }
        return (
            <div className={style.SpiritDetails__container}>
                <img className={style.SpiritDetails__image}
                    src={image}
                    alt={this.props.spirit.name}
                />
                <Button style={{position:"absolute"}}
                    onClick={() => this.setState({ backside: !this.state.backside })}>
                    Flip
                </Button>
                <div>HandCards</div>
            </div>

        );
    }
}

