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

    onIncrease: () => void;
    onDecrease: () => void;
}

type TokenOnBoardUnionProps = React.HTMLAttributes<HTMLDivElement> & TokenOnBoardProps 

class TokenOnBoard extends React.Component<TokenOnBoardUnionProps & SelectableProps> {
    render() {
        const tokenImgae = this.props.token.count > 0 &&
            <TokenImage tokenType={this.props.token.tokenType} presenceColors={this.props.presenceColors} />
        const count = this.props.token.count > 0 && this.props.token.count;

        return (
            <div ref={this.props.selRef}{...this.props}>
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

 export default SelectableDivHOC<TokenOnBoardUnionProps>(TokenOnBoard)