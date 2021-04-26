import * as React from "react";


import style from "./style.module.scss";


import { IncreaseDecreaseButton } from "../../IncreaseDecreaseButton";
import { TokenImage } from "../TokenImage";
import { PlacedToken } from "game/MainPhase";


/** Defines the hardcoded sizes for the token containers. These are used to fit the tokens into the land polygons. */


export interface TokenOnBoardProps {
    token: PlacedToken
    buttonWidth: number
    selected: boolean

    onIncrease: () => void;
    onDecrease: () => void;
}

export function TokenOnBoard(props: React.HTMLAttributes<HTMLDivElement> & TokenOnBoardProps) {

    const tokenImgae = props.token.count > 0 && <TokenImage tokenType={props.token.tokenType} />
    const count = props.token.count > 0 && props.token.count;

    return (
        <div {...props}>
            {count}{tokenImgae}
            {props.selected && <IncreaseDecreaseButton onIncrease={props.onIncrease} onDecrease={props.onDecrease} width={props.buttonWidth} />}
        </div>
    );
}
