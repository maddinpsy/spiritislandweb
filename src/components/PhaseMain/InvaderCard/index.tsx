import * as React from "react";

import classnames from "classnames"

import style from "./style.module.scss";
import { InvaderCardData } from "game/InvaderCards"

import invaderCards from "assets/Invader Deck.jpg"
import invaderCardsBack from "assets/Invader Back.jpg"

export interface InvaderCardProps {
    card?: InvaderCardData,
    flipped: boolean,
    className?: string
    onClick?: (ev: React.MouseEvent) => void
}


export class InvaderCard extends React.Component<InvaderCardProps> {
    constructor(props: any) {
        super(props)
        this.state = { currentSpiritsIdx: 0 }
    }
    render() {
        const imgHeigth = 2440;
        const imgWidth = 1580;

        //Return empty image if no card is given
        //also remove click function
        if (!this.props.card) {
            return (
                <div
                    className={classnames(style.InvaderCard__container, this.props.className)}
                >
                    <svg width="100%" height="100%" viewBox={"0 0 " + imgWidth / 4 + " " + imgHeigth / 4}>
                    </svg>
                </div>
            );
        }


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
                        spriteY = imgHeigth / 4;
                        break;
                    case 1:
                        spriteX = imgWidth / 4;
                        spriteY = imgHeigth / 4;
                        break;
                    case 2:
                        spriteX = imgWidth / 2;
                        spriteY = imgHeigth / 4;
                        break;
                    case 3:
                        spriteX = imgWidth / 4 * 3;
                        spriteY = imgHeigth / 4;
                        break;
                    case 4:
                        spriteX = 0;
                        spriteY = imgHeigth / 2;
                        break;
                }
                break;
            case 3:
                switch (this.props.card.id) {
                    case 0:
                        spriteX = imgWidth / 4;
                        spriteY = imgHeigth / 2;
                        break;
                    case 1:
                        spriteX = imgWidth / 2;
                        spriteY = imgHeigth / 2;
                        break;
                    case 2:
                        spriteX = imgWidth / 4 * 3;
                        spriteY = imgHeigth / 2;
                        break;
                    case 3:
                        spriteX = 0;
                        spriteY = imgHeigth / 4 * 3;
                        break;
                    case 4:
                        spriteX = imgWidth / 4;
                        spriteY = imgHeigth / 4 * 3;
                        break;
                    case 5:
                        spriteX = imgWidth / 2;
                        spriteY = imgHeigth / 4 * 3;
                        break;
                }
                break;
        }
        //set image based on flipped
        const imageUrl = this.props.flipped ? invaderCards : invaderCardsBack;
        return (
            <div
                className={classnames(style.InvaderCard__container, this.props.className)}
                onClick={this.props.onClick}
            >
                <svg width="100%" height="100%" viewBox={"0 0 " + imgWidth / 4 + " " + imgHeigth / 4}>
                    <image
                        height={imgHeigth} width={imgWidth} y="0" x="0"
                        xlinkHref={imageUrl}
                        transform={"translate(" + (-spriteX) + "," + (-spriteY) + ")"}
                    />
                </svg>
            </div>
        );
    }
}
