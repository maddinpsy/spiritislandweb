import * as React from "react";

import { Board} from "game/SetupPhase";

import style from "./style.module.scss";
import boardA from "assets/Board A.png"
import boardB from "assets/Board B.png"
import boardC from "assets/Board C.png"
import boardD from "assets/Board D.png"
import boardE from "assets/Board E.png"
import boardF from "assets/Board F.png"


const boardImages: { [key: string]: string } = { "A": boardA, "B": boardB, "C": boardC, "D": boardD, "E": boardE, "F": boardF }

export class AvailableBoards extends React.Component<{ availBoards: Board[], removeBoard: (boardName: string) => void }>
{
    constructor(props: any) {
        super(props);
        this.onRemoveBoard = this.onRemoveBoard.bind(this);
    }

    onRemoveBoard(event: React.DragEvent<HTMLDivElement>) {
        event.preventDefault();
        const boardName = event.dataTransfer.getData("text");
        this.props.removeBoard(boardName);
    }

    render() {
        const boards = this.props.availBoards.map(b => {
            return (
                <div key={b.name}
                    className={style.AvailableBoards__imageWrap}
                    draggable="true"
                    onDragStart={(ev) => {
                        ev.dataTransfer.setData("text", b.name)
                    }}
                >
                    <img src={boardImages[b.name]} className={style.AvailableBoards__image} draggable="false" />
                </div>)
        });
        return (
            <div className={style.AvailableBoards__area}
                onDrop={this.onRemoveBoard}
                onDragOver={(event) => event.preventDefault()}>
                {boards}
            </div>
        )
    }
}
