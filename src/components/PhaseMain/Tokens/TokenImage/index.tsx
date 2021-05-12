import * as React from "react";


import style from "./style.module.scss";

import Badlands from "assets/tokens/Badlands.png"
import City from "assets/tokens/Citiyicon.png"
import Explorer from "assets/tokens/Explorericon.png"
import Town from "assets/tokens/Townicon.png"
import Beast from "assets/tokens/Beasticon.png"
import Dahan from "assets/tokens/Dahanicon.png"
import Wild from "assets/tokens/Wildicon.png"
import Blight from "assets/tokens/Blighticon.png"
import Disease from "assets/tokens/Diseaseicon.png"
import Defend from "assets/tokens/Shield.png"

import { TokenType } from "game/GamePhaseMain";
import { PresenceImage } from "../PresenceImage";


/** Defines the hardcoded sizes for the token containers. These are used to fit the tokens into the land polygons. */

export function TokenImage(props: { tokenType: TokenType, presenceColors: string[] }) {
    let image;
    switch (props.tokenType) {
        case "Explorer":
            image = Explorer;
            break;
        case "Town":
            image = Town;
            break;
        case "City":
            image = City;
            break;
        case "Dahan":
            image = Dahan;
            break;
        case "Blight":
            image = Blight;
            break;
        case "Wild":
            image = Wild;
            break;
        case "Beast":
            image = Beast;
            break;
        case "Disease":
            image = Disease;
            break;
        case "Badlands":
            image = Badlands;
            break;
        case "Defend":
            image = Defend;
            break;
        case "Presence1":
            return <PresenceImage cssBackground={props.presenceColors[0]} />
        case "Presence2":
            return <PresenceImage cssBackground={props.presenceColors[1]} />
        case "Presence3":
            return <PresenceImage cssBackground={props.presenceColors[2]} />
        case "Presence4":
            return <PresenceImage cssBackground={props.presenceColors[3]} />
        case "Presence5":
            return <PresenceImage cssBackground={props.presenceColors[4]} />
        case "Presence6":
            return <PresenceImage cssBackground={props.presenceColors[5]} />
    }

    return <img src={image} alt={props.tokenType} className={style.Tokens__tokensImage} />



}
