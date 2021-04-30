import { Button } from "components/Button";
import { PowerCardList } from "components/PhaseMain/PowerCardPile/PowerCardList";
import { ActiveSpirit } from "game/GamePhaseMain";
import { SetupSpirit } from "game/GamePhaseSetup";
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
        let image = this.props.spirit.frontSideUrl;
        if (this.state.backside) {
            image = this.props.spirit.backSideUrl;
        }
        return (
            <div className={style.SpiritDetails__container}>
                <div className={style.SpiritDetails__imageContainer}>
                    <img className={style.SpiritDetails__image}
                        src={image}
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

