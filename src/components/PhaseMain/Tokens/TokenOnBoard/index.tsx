import * as React from "react";

import { IncreaseDecreaseButton } from "../../IncreaseDecreaseButton";
import { TokenImage } from "../TokenImage";
import { PlacedToken } from "game/GamePhaseMain";


/** Defines the hardcoded sizes for the token containers. These are used to fit the tokens into the land polygons. */


export interface TokenOnBoardProps {
    token: PlacedToken
    buttonWidth: number
    selected: boolean
    presenceColors: string[]

    onIncrease: () => void;
    onDecrease: () => void;
}

export function TokenOnBoard(props: React.HTMLAttributes<HTMLDivElement> & TokenOnBoardProps) {

    const tokenImgae = props.token.count > 0 &&
        <TokenImage tokenType={props.token.tokenType} presenceColors={props.presenceColors} />
    const count = props.token.count > 0 && props.token.count;

    return (
        <div className={props.className} style={props.style} onClick={props.onClick}>
            {count}{tokenImgae}
            {props.selected && <IncreaseDecreaseButton onIncrease={props.onIncrease} onDecrease={props.onDecrease} style={{ width: props.buttonWidth }} />}
        </div>
    );
}
