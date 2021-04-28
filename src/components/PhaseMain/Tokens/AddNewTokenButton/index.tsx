import * as React from "react";


import style from "./style.module.scss";


import classnames from "classnames"
import { TokenImage } from "../TokenImage";
import { TokenType } from "game/GamePhaseMain";


interface AddNewTokenButtonProps {
    position: { left: number, top: number }
    className: string
    availableTokens: TokenType[]
    presenceColors:string[]

    showDialog: (data?: { title: string, content: JSX.Element }) => void;
    onIncreaseToken: (tokenType: TokenType) => void;
}


export class AddNewTokenButton extends React.Component<AddNewTokenButtonProps>{

    render() {
        if (this.props.availableTokens.length === 0) {
            return <div />;
        }
        const popup = (
            <div className={style.Tokens__newTokensContainer}>
                {this.props.availableTokens
                //only show presence token for available spirits
                .filter(t=>!t.startsWith("Presence") || Number(t.substr(8))<=this.props.presenceColors.length)
                .map(token => {
                    return (
                        <div
                            className={style.Tokens__newToken}
                            key={token}
                            onClick={() => {
                                this.props.onIncreaseToken(token);
                                this.props.showDialog();
                            }
                            }
                        >
                            <TokenImage tokenType={token} presenceColors={this.props.presenceColors}/> {token.toString()}
                        </div>
                    )
                })}
            </div>
        )
        return (
            <div
                className={classnames(this.props.className, style.Tokens__newTokenButton)}
                style={{ ...this.props.position }}
                onClick={() => this.props.showDialog({ title: "Add new Token", content: popup })}
            >
                +
            </div>
        );
    }
}
