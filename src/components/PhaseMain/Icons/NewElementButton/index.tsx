import * as React from "react";


import style from "./style.module.scss";


import classnames from "classnames"
import { Types } from "spirit-island-card-katalog/types";
import { ElementIcon } from "..";
import any_element from "assets/elements/any.png"

interface NewElementButtonProps {
    availableElements:Types.Elements[]
    className?: string
    showDialog: (data?: { title: string, content: JSX.Element }) => void;
    onAddElement: (type: Types.Elements) => void;
}

export class NewElementButton extends React.Component<NewElementButtonProps>{

    render() {
        if (this.props.availableElements.length === 0) {
            return <div />;
        }
        const popup = (
            <div className={style.NewElementButton__newElementsContainer}>
                {this.props.availableElements.map(el => {
                    return (
                        <div
                            className={style.NewElementButton__newElement}
                            key={el}
                            onClick={() => {
                                this.props.onAddElement(el);
                                this.props.showDialog();
                            }
                            }
                        >
                            <ElementIcon type={el} /> {el.toString()}
                        </div>
                    )
                })}
            </div>
        )
        return (
            <img alt="+" src={any_element}
                className={classnames(this.props.className, style.NewElementButton__button)}
                onClick={() => this.props.showDialog({ title: "Add new Element", content: popup })}
            />
        );
    }
}
