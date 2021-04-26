import * as React from "react";


import style from "./style.module.scss";

import Badlands from "assets/icons/Badlands.png"
import City from "assets/icons/Citiyicon.png"
import Explorer from "assets/icons/Explorericon.png"
import Town from "assets/icons/Townicon.png"
import Beast from "assets/icons/Beasticon.png"
import Dahan from "assets/icons/Dahanicon.png"
import Presence from "assets/icons/Presenceicon.png"
import Wild from "assets/icons/Wildicon.png"
import Blight from "assets/icons/Blighticon.png"
import Disease from "assets/icons/Diseaseicon.png"

import { TokenType } from "game/MainPhase";


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
