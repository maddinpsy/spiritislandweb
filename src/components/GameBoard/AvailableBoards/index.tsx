import * as React from "react";

import { Board } from "game/SetupPhase";

import style from "./style.module.scss";
import boardA from "assets/Board A.png"
import boardB from "assets/Board B.png"
import boardC from "assets/Board C.png"
import boardD from "assets/Board D.png"
import boardE from "assets/Board E.png"
import boardF from "assets/Board F.png"


const boardImages: { [key: string]: string } = { "A": boardA, "B": boardB, "C": boardC, "D": boardD, "E": boardE, "F": boardF }

export interface AvailBoardDragData {
    type: "availBoard"
    boardName: string
}

interface AvailableBoardsProps {
    availBoards: Board[]
    removeBoard: (boardName: string) => void
}

export class AvailableBoards extends React.Component<AvailableBoardsProps>
{
    constructor(props: any) {
        super(props);
        this.onRemoveBoard = this.onRemoveBoard.bind(this);
    }

    onRemoveBoard(event: React.DragEvent<HTMLDivElement>) {
        event.preventDefault();
        const jsonData = event.dataTransfer.getData("text");
        const transferData = JSON.parse(jsonData) as AvailBoardDragData;
        const boardName = transferData.boardName;
        this.props.removeBoard(boardName);
    }

    render() {
        const boards = this.props.availBoards.map(b => {
            return (
                <div key={b.name}
                    className={style.AvailableBoards__imageWrap}
                    draggable="true"
                    onDragStart={(ev) => {
                        const data: AvailBoardDragData = {
                            type: "availBoard",
                            boardName: b.name
                        }
                        ev.dataTransfer.setData("text", JSON.stringify(data))
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
