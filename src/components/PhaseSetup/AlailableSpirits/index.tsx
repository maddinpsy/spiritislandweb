import * as React from "react";

import style from "./style.module.scss";

import { SetupSpirit } from "game/GamePhaseSetup";
import { GeneralDragData } from "../UsedBoards";


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
                return <></>;
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
                    <img src={spirit.logoUrl} alt={spirit.name} className={style.AvailableSpirits__image} draggable="false" />
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
