import * as React from "react";

import style from "./style.module.scss";



export interface ModalWindowProps {
    title: string
    onClose: () => void
}

function CloseButton(props: { onClick: (ev: React.MouseEvent) => void }) {
    return (
        <span className={style.ModalWindow__closeButton} onClick={props.onClick}>
            <svg version="1.1"
                width="20" height="20"
                xmlns="http://www.w3.org/2000/svg">
                <line x1="1" y1="19" x2="19" y2="1"
                    stroke="black"
                    strokeWidth="4" />
                <line x1="1" y1="1" x2="19" y2="19"
                    stroke="black"
                    strokeWidth="4" />
            </svg>
        </span>
    )
}

export class ModalWindow extends React.Component<ModalWindowProps> {
    render() {
        return (
            <div className={style.ModalWindow__container}>
                <div className={style.ModalWindow__fadeOutBack} />
                <div className={style.ModalWindow__window}>
                    <div className={style.ModalWindow__titleBar}>
                        <span>{this.props.title}</span>
                        <CloseButton onClick={() => this.props.onClose()} />
                    </div>
                    <div className={style.ModalWindow__bodyContainer}>
                        {this.props.children}
                    </div>
                </div>
            </div>

        );
    }
}

