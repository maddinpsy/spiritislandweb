import * as React from "react";

import style from "./style.module.scss";
import { InvaderCardData } from "game/InvaderCards"

import invaderCards from "assets/Invader Deck.jpg"
import invaderCardsBack from "assets/Invader Back.jpg"

export interface InvaderCardProps {
    card: InvaderCardData,
    divWidth_percent?: number
}


export class InvaderCard extends React.Component<InvaderCardProps> {
    constructor(props: any) {
        super(props)
        this.state = { currentSpiritsIdx: 0 }
    }
    render() {
        const imgHeight = 2440;
        const imgWidth = 1580;
        const divWidth_percent = this.props.divWidth_percent || 1;

        let spriteX = 0;
        let spriteY = 0;
        //set sprite pos base on card
        switch (this.props.card.stage) {
            case 1:
                switch (this.props.card.id) {
                    case 0:
                        spriteX = spriteY = 0;
                        break;
                    case 1:
                        spriteX = imgWidth / 4;
                        spriteY = 0;
                        break;
                    case 2:
                        spriteX = imgWidth / 2;
                        spriteY = 0;
                        break;
                    case 3:
                        spriteX = imgWidth / 4 * 3;
                        spriteY = 0;
                        break;
                }
                break;
            case 2:
                switch (this.props.card.id) {
                    case 0:
                        spriteX = 0;
                        spriteY = imgHeight / 4;
                        break;
                    case 1:
                        spriteX = imgWidth / 4;
                        spriteY = imgHeight / 4;
                        break;
                    case 2:
                        spriteX = imgWidth / 2;
                        spriteY = imgHeight / 4;
                        break;
                    case 3:
                        spriteX = imgWidth / 4 * 3;
                        spriteY = imgHeight / 4;
                        break;
                    case 4:
                        spriteX = 0;
                        spriteY = imgHeight / 2;
                        break;
                }
                break;
            case 3:
                switch (this.props.card.id) {
                    case 0:
                        spriteX = imgWidth / 4;
                        spriteY = imgHeight / 2;
                        break;
                    case 1:
                        spriteX = imgWidth / 2;
                        spriteY = imgHeight / 2;
                        break;
                    case 2:
                        spriteX = imgWidth / 4 * 3;
                        spriteY = imgHeight / 2;
                        break;
                    case 3:
                        spriteX = 0;
                        spriteY = imgHeight / 4 * 3;
                        break;
                    case 4:
                        spriteX = imgWidth / 4;
                        spriteY = imgHeight / 4 * 3;
                        break;
                    case 5:
                        spriteX = imgWidth / 2;
                        spriteY = imgHeight / 4 * 3;
                        break;
                }
                break;
        }
        //move image to the right when multiple tiles are shown
        spriteX += imgWidth / 4 * (1 - divWidth_percent) / 2
        //set image based on flipped
        const imageUrl = this.props.card.flipped ? invaderCards : invaderCardsBack;
        return (
            <div
                className={style.InvaderCard__container}
                style={{
                    backgroundImage: `url("${imageUrl}")`,
                    backgroundPositionX: -spriteX/4,
                    backgroundPositionY: -spriteY/4,
                    backgroundSize: `${imgWidth/4}px ${imgHeight/4}px`,
                    backgroundRepeat: "no-repeat"
                }}
            >
            </div>
        );
    }
}
