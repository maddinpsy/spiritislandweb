import * as React from "react";

import classnames from "classnames";

import style from "./style.module.scss";

import increaseIcon from "assets/increase.svg"
import decreaseIcon from "assets/decrease.svg"

interface IncreaseDecreaseButtonProps {
    onIncrease: () => void;
    onDecrease: () => void;
    style?: React.CSSProperties;
    className?: string;
}

export class IncreaseDecreaseButton extends React.Component<IncreaseDecreaseButtonProps>
{
    render() {
        return (
            <div className={classnames(style.IncreaseDecreaseButton__container,this.props.className)} style={this.props.style}>
                <div className={style.IncreaseDecreaseButton__increaseButton} onClick={(ev) => {
                    ev.stopPropagation();
                    this.props.onIncrease()
                }}>
                    <img src={increaseIcon} alt="^" />
                </div>
                <div className={style.IncreaseDecreaseButton__decreaseButton} onClick={(ev) => {
                    ev.stopPropagation();
                    this.props.onDecrease()
                }}>
                    <img src={decreaseIcon} alt="v" />
                </div>
            </div>
        );
    }
}
