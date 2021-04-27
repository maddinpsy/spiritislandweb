import { Button } from "components/Button";
import { ModalWindow } from "components/ModalWindow";
import * as React from "react";
import { Redirect } from "react-router-dom";

import style from "./style.module.scss";



interface SubscribeFormState {
    email: string;
    requested: boolean;
    response?: string;
}

export class SubscribeForm extends React.Component<{}, SubscribeFormState> {
    constructor(props: {}) {
        super(props);
        this.emailChanged = this.emailChanged.bind(this);
        this.state = { email: "", requested: false };
    }

    emailChanged(ev: React.FormEvent<HTMLInputElement>) {
        this.setState({ email: ev.currentTarget.value })
    }

    onSuccess(response: string) {
        this.setState({ response: response });
    }

    subscribe(emailaddress: string) {
        if (this.state.requested)
            return;
        this.setState({ requested: true });

        const subscribeaddress = 'https://spiritislandweb.hosted.phplist.com/lists/?p=subscribe&id=1'
        const ajaxaddress = subscribeaddress.replace(/subscribe/, 'asubscribe');
        var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
        if (emailReg.test(emailaddress)) {
            fetch(ajaxaddress, {
                method: 'post',
                body: "email=" + emailaddress,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            })
                .then(response => response.text())
                .then((data) => {
                    if (data.search(/FAIL/) >= 0) {
                        //request fail
                        window.location.href = subscribeaddress + "&email=" + emailaddress;
                    } else {
                        //request success
                        this.onSuccess(data);
                    }
                })
        } else {
            //email not valid
            window.location.href = subscribeaddress + "&email=" + emailaddress;
        }
    }

    render() {
        const from = (
            <div className={style.SubscribeWindow__formContainer} >
                <input
                    className={style.SubscribeWindow__emailinput}
                    type="text"
                    placeholder="Your email ..."
                    value={this.state.email} onChange={this.emailChanged}
                    disabled={this.state.requested}
                />
                <Button
                    size="small"
                    className={style.SubscribeWindow__subscribeButton}
                    onClick={() => this.subscribe(this.state.email)}
                    disabled={this.state.requested}
                >Subscribe</Button>
                {this.state.requested && <div className={style.SubscribeWindow__loading}>. . .</div>}
            </div>
        );
        //show subscribe window
        return (
            <div style={{width: "30vw"}}>
                <p>
                    This software is still under development. Expect missing features and bugs.
                    You can enter you emailaddress to get informed about the development progress.
                    Be the first to play the game when it is ready.
                    </p>
                {this.state.response ? <div dangerouslySetInnerHTML={{ __html: this.state.response }} /> : from}
            </div>
        );


    }
}



export interface SubscribeWindowProps {
    onClose: () => void
    onSuccess: () => void
}

export class SubscribeWindow extends React.Component<SubscribeWindowProps> {
    constructor(props: SubscribeWindowProps) {
        super(props);
    }

    render() {
        //show subscribe window
        return (
            <ModalWindow title="Warning" onClose={this.props.onClose} >
                <SubscribeForm />
                <p>
                    You can use the development version on your own risk.
                    </p>
                <Button size="small" onClick={() => this.props.onSuccess()}>Start anyway</Button>
            </ModalWindow>
        );

    }
}

