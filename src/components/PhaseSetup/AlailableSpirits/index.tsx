import * as React from "react";

import style from "./style.module.scss";

// the order is the same as defined in game/SetupPhase gameSetup()
import spirit1 from "assets/spirits/Lightning_Logo_big.png"
import spirit2 from "assets/spirits/Rivers_Logo_big.png"
import spirit3 from "assets/spirits/Earth_Logo_big.png"
import spirit4 from "assets/spirits/Shadows_Logo_big.png"
import spirit5 from "assets/spirits/Rampant_Logo_big.png"
import spirit6 from "assets/spirits/Thunderspeaker_Logo_big.png"
import spirit7 from "assets/spirits/Ocean_Logo_big.png"
import spirit8 from "assets/spirits/Bodan_Logo_big.png"
import { SetupSpirit } from "game/GamePhaseSetup";
import { GeneralDragData } from "../UsedBoards";

export const spiritImages: string[] = [
    spirit1,
    spirit2,
    spirit3,
    spirit4,
    spirit5,
    spirit6,
    spirit7,
    spirit8,
]

export interface SpiritDragData {
    type: "spirit"
    spiritId: number
}
export interface AvailableSpiritsProps {
    availSpirits: SetupSpirit[]
    doRemoveSpirit: (spiritIdx: number) => void
}

export class AvailableSpirits extends React.Component<AvailableSpiritsProps>
{
    constructor(props: any) {
        super(props);
        this.onDrop = this.onDrop.bind(this);
    }

    onDrop(event: React.DragEvent<HTMLDivElement>) {
        event.preventDefault();
        const jsonData = event.dataTransfer.getData("text");
        const transferData = JSON.parse(jsonData) as GeneralDragData;
        if (transferData.type === "spirit") {
            this.props.doRemoveSpirit(transferData.spiritId);
        }
    }

    render() {
        const boards = this.props.availSpirits.map((spirit, idx) => {
            //spirits with board, are not available
            if (spirit.curretBoard) {
                return;
            }
            return (
                <div key={spirit.name}
                    className={style.AvailableSpirits__imageWrap}
                    draggable="true"
                    onDragStart={(ev) => {
                        let data: SpiritDragData =
                        {
                            type: "spirit",
                            spiritId: idx
                        }
                        ev.dataTransfer.setData("text", JSON.stringify(data))
                    }}
                >
                    <img src={spiritImages[idx]} className={style.AvailableSpirits__image} draggable="false" />
                    <div className={style.AvailableSpirits__name} >{spirit.name}</div>
                </div>)
        });
        return (
            <div className={style.AvailableSpirits__area}
                onDrop={this.onDrop}
                onDragOver={(event) => event.preventDefault()}>
                {boards}
            </div>
        )
    }
}
