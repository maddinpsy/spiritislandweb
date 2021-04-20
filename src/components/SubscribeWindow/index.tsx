import { ModalWindow } from "components/ModalWindow";
import * as React from "react";

import style from "./style.module.scss";


export interface SubscribeWindowProps {
    onClose: () => void

}

export class SubscribeWindow extends React.Component<SubscribeWindowProps> {
    constructor(props: SubscribeWindowProps) {
        super(props);
    }

    render() {
        return (
            <ModalWindow title="Subscibre" onClose={this.props.onClose} >
                <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.5.2/jquery.min.js"></script>
                <script type="text/javascript" src="https://s3.amazonaws.com/phplist/phplist-subscribe-0.2.min.js"></script>

                <div id="phplistsubscriberesult"></div>
                <form action="https://spiritislandweb.hosted.phplist.com/lists/?p=subscribe&id=1" method="post" id="phplistsubscribeform">
                    <input type="text" name="email" value="" id="emailaddress" />
                    <button type="submit" id="phplistsubscribe">Subscribe to our newsletters</button>
                </form>

            </ModalWindow>

        );
    }
}

