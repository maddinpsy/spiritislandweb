import * as React from "react";

import style from "./style.module.scss";
import spirit1 from "assets/spirits/Bodan_Logo_big.png"
import spirit2 from "assets/spirits/Ocean_Logo_big.png"
import spirit3 from "assets/spirits/Shadows_Logo_big.png"
import spirit4 from "assets/spirits/Earth_Logo_big.png"
import spirit5 from "assets/spirits/Rampant_Logo_big.png"
import spirit6 from "assets/spirits/Thunderspeaker_Logo_big.png"
import spirit7 from "assets/spirits/Lightning_Logo_big.png"
import spirit8 from "assets/spirits/Rivers_Logo_big.png"

interface Spirit {
    name: string,
    image: string
}
export const allSpirits: Spirit[] = [
    { name: "Bringer of Dreams and Nightmares", image: spirit1 },
    { name: "Oceans Hungry??", image: spirit2 },
    { name: "Shadows flicker like flame", image: spirit3 },
    { name: "Earth?", image: spirit4 },
    { name: "Spread of Rampet Green", image: spirit5 },
    { name: "Thunderspeaker", image: spirit6 },
    { name: "Lighning??", image: spirit7 },
    { name: "River??", image: spirit8 },
]

export interface SpiritDragData
{
    type:"spirit"
    spiritName:string
}

export class AvailableSpirits extends React.Component<{ availSpirits: Spirit[]}>
{
    constructor(props: any) {
        super(props);
        this.onRemoveBoard = this.onRemoveBoard.bind(this);
    }

    onRemoveBoard(event: React.DragEvent<HTMLDivElement>) {
        event.preventDefault();
        const boardName = event.dataTransfer.getData("text");
    }

    render() {
        const boards = this.props.availSpirits.map(spirit => {
            return (
                <div key={spirit.name}
                    className={style.AvailableSpirits__imageWrap}
                    draggable="true"
                    onDragStart={(ev) => {
                        let data:SpiritDragData =
                        {
                            type:"spirit",
                            spiritName:spirit.name
                        }
                        ev.dataTransfer.setData("text", JSON.stringify(data))
                    }}
                >
                    <img src={spirit.image} className={style.AvailableSpirits__image} draggable="false" />
                </div>)
        });
        return (
            <div className={style.AvailableSpirits__area}
                onDrop={this.onRemoveBoard}
                onDragOver={(event) => event.preventDefault()}>
                {boards}
            </div>
        )
    }
}
