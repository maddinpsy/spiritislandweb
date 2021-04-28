import * as React from "react";


import style from "./style.module.scss";

import Presence from "assets/tokens/Presenceicon.png"


/** Defines the hardcoded sizes for the token containers. These are used to fit the tokens into the land polygons. */

export function PresenceImage(props: { cssBackground: string }) {

    let elStyle: React.CSSProperties = {};
    elStyle.background = props.cssBackground;
    return (<div className={style.PresenceImage__presence} style={elStyle}>
        <img src={Presence} alt="" />
    </div>)


}
