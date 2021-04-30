import * as React from "react";

import style from "./style.module.scss";

import { Button } from "components/Button";
import { Types } from "spirit-island-card-katalog/types";

import classnames from "classnames"

export interface PowerCardListProps {
    cards: Types.PowerCardData[]
    actions: { title: string, onSelect: (idx: number) => void }[]
    classNameList?:string
    classNameCard?:string
}

interface PowerCardListState {
    selectedCardIdx?: number
}

export class PowerCardList extends React.Component<PowerCardListProps, PowerCardListState> {
    timeOutId: number
    constructor(props: PowerCardListProps) {
        super(props);
        this.state = {}
        this.timeOutId = -1;
        this.selectCard = this.selectCard.bind(this);
    }
    selectCard(cardIndex: number) {
        this.setState({ selectedCardIdx: cardIndex });
    }
    unselectedCard() {
        this.timeOutId = window.setTimeout(() => {
            this.setState({ selectedCardIdx: undefined })
        });
    }

    render() {
        const cardImages = this.props.cards.map((c, idx) =>
            <div className={classnames(style.PowerCardList__cardContainer,this.props.classNameCard)}>
                <img
                    key={c.name}
                    alt={c.name}
                    src={c.imageUrl}
                    onClick={() => this.selectCard(idx)}
                />
                {this.state.selectedCardIdx === idx &&
                    <div className={style.PowerCardList__buttonOverlay}>
                        {this.props.actions.map(action =>
                            <Button
                                key={action.title}
                                size="small"
                                onClick={
                                    () => {
                                        action.onSelect(idx);
                                        this.setState({ selectedCardIdx: undefined })
                                    }
                                }>
                                {action.title}
                            </Button>
                        )}
                    </div>
                }
            </div>
        );

        return (<div className={classnames(style.PowerCardList__cardList,this.props.classNameList)}
            //unselect handcard when loosing focus
            onBlur={() => this.unselectedCard()}
            //but not if child has still the focus, onBlur is called first
            onFocus={() => { if (this.timeOutId >= 0) window.clearTimeout(this.timeOutId) }}
            //onBlur only works if tabIndex is set
            tabIndex={1}
        >
            {cardImages}
        </div>)
    }
}
