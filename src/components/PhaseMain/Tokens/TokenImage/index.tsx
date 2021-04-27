import * as React from "react";


import style from "./style.module.scss";

import Badlands from "assets/tokens/Badlands.png"
import City from "assets/tokens/Citiyicon.png"
import Explorer from "assets/tokens/Explorericon.png"
import Town from "assets/tokens/Townicon.png"
import Beast from "assets/tokens/Beasticon.png"
import Dahan from "assets/tokens/Dahanicon.png"
import Presence from "assets/tokens/Presenceicon.png"
import Wild from "assets/tokens/Wildicon.png"
import Blight from "assets/tokens/Blighticon.png"
import Disease from "assets/tokens/Diseaseicon.png"

import { TokenType } from "game/GamePhaseMain";


/** Defines the hardcoded sizes for the token containers. These are used to fit the tokens into the land polygons. */

export function TokenImage(props: { tokenType: TokenType }) {
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
        case "Presence1":
            image = Presence;
            break;
        case "Presence2":
            image = Presence;
            break;
        case "Presence3":
            image = Presence;
            break;
        case "Presence4":
            image = Presence;
            break;
        case "Presence5":
            image = Presence;
            break;
        case "Presence6":
            image = Presence;
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
    }
    return <img src={image} alt={props.tokenType} className={style.Tokens__tokensImage} />
}
