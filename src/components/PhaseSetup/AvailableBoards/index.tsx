import * as React from "react";

import { Board } from "game/GamePhaseSetup";

import style from "./style.module.scss";

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
                    <img src={b.smallBoardUrl} alt={"Board " + b.name} className={style.AvailableBoards__image} draggable="false" />
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
