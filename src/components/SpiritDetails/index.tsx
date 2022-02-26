import { Button } from "components/Button";
import { PowerCardList } from "components/PhaseMain/PowerCardPile/PowerCardList";
import { ActiveSpirit } from "game/GamePhaseMain";
import * as React from "react";

import style from "./style.module.scss";



export interface SpiritDetailsProps {
    spirit: ActiveSpirit
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
        return (
            <div className={style.SpiritDetails__container}>
                <div className={style.SpiritDetails__imageContainer}>
                    <img className={style.SpiritDetails__image}
                        style={{display:this.state.backside?"none":"block"}}
                        src={this.props.spirit.frontSideUrl}
                        alt={this.props.spirit.name}
                    />
                    <img className={style.SpiritDetails__image}
                        style={{display:this.state.backside?"block":"none"}}
                        src={this.props.spirit.backSideUrl}
                        alt={this.props.spirit.name}
                    />
                    <Button className={style.SpiritDetails__flipButton}
                        onClick={() => this.setState({ backside: !this.state.backside })}>
                        Flip
                    </Button>
                </div>
                <div className={style.SpiritDetails__handcardTitle}>
                    HandCards (scroll down)
                </div>
                <PowerCardList
                    cards={this.props.spirit.handCards}
                    actions={[

                    ]}
                    classNameCard={style.SpiritDetails__handcardCard}
                    classNameList={style.SpiritDetails__handcardList}
                />
            </div>

        );
    }
}

