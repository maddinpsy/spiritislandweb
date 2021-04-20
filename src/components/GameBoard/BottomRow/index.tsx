import { Button } from "components/Button";
import * as React from "react";

import style from "./style.module.scss";


export interface BottomRowProps {

}

export class BottomRow extends React.Component<BottomRowProps> {
    constructor(props: BottomRowProps) {
        super(props);
    }

    render() {
        return (
            <div className={style.BottomRow__container}>
                <Button className={style.BottomRow__startButton}>Start <br/> Game</Button>
            </div>
        );
    }
}

