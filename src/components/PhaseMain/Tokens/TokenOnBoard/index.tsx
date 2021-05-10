import * as React from "react";


import style from "./style.module.scss";


import { IncreaseDecreaseButton } from "../../IncreaseDecreaseButton";
import { TokenImage } from "../TokenImage";
import { PlacedToken } from "game/GamePhaseMain";
import { SelectableDivHOC, SelectableProps } from "components/SelectableDivHOC";


/** Defines the hardcoded sizes for the token containers. These are used to fit the tokens into the land polygons. */


export interface TokenOnBoardProps {
    token: PlacedToken
    buttonWidth: number
    presenceColors: string[]
    className:string
    style:React.CSSProperties

    onIncrease: () => void;
    onDecrease: () => void;
}

class TokenOnBoard extends React.Component<TokenOnBoardProps & SelectableProps> {
    render() {
        const tokenImgae = this.props.token.count > 0 &&
            <TokenImage tokenType={this.props.token.tokenType} presenceColors={this.props.presenceColors} />
        const count = this.props.token.count > 0 && this.props.token.count;

        return (
            <div ref={this.props.selRef} style={this.props.style} className={this.props.className}>
                {count}{tokenImgae}
                {this.props.isSelected &&
                    <IncreaseDecreaseButton
                        onIncrease={this.props.onIncrease}
                        onDecrease={this.props.onDecrease}
                        style={{ width: this.props.buttonWidth }}
                    />
                }
            </div>
        );
    }
}

 export default SelectableDivHOC<TokenOnBoardProps>(TokenOnBoard)