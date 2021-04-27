import * as React from "react";

import style from "./style.module.scss";

import { Types } from "spirit-island-card-katalog/types";

import coin_empty from "assets/icons/coin_empty.png"
import two_cards from "assets/icons/two_cards.png"
import destroyed_presences from "assets/icons/DestroyedPresences.png"

import animal_icon from "assets/elements/animal_checked.png"
import earth_icon from "assets/elements/earth_checked.png"
import air_icon from "assets/elements/air_checked.png"
import fire_icon from "assets/elements/fire_checked.png"
import moon_icon from "assets/elements/moon_checked.png"
import plant_icon from "assets/elements/plant_checked.png"
import sun_icon from "assets/elements/sun_checked.png"
import water_icon from "assets/elements/water_checked.png"


export function EnergyIcon(props: { energy: number }) {
    return <div className={style.Icons__energyContainer}>
        <div className={style.Icons__energyText} style={{ backgroundImage: "url(" + coin_empty + ")" }}>{props.energy}</div>
    </div>
}

export function DestroyedPresencesIcon(props: { count: number }) {
    return <div className={style.Icons__destroyedContainer}>
        <div className={style.Icons__destroyedText}>{props.count}</div>
        <img src={destroyed_presences} alt="" className={style.Icons__destroyedImage} />
    </div>
}

export function DiscardedCardsIcon(props: { count: number }) {
    return <div className={style.Icons__discardedContainer}>
        <div className={style.Icons__discardedText}>{props.count}</div>
        <img className={style.Icons__discardedImage} src={two_cards} alt="" />
    </div>
}

export function ElementIcon(props: { type: Types.Elements }) {
    let image;
    switch (props.type) {
        case Types.Elements.Sun:
            image = sun_icon;
            break;
        case Types.Elements.Air:
            image = air_icon;
            break;
        case Types.Elements.Moon:
            image = moon_icon;
            break;
        case Types.Elements.Fire:
            image = fire_icon;
            break;
        case Types.Elements.Water:
            image = water_icon;
            break;
        case Types.Elements.Earth:
            image = earth_icon;
            break;
        case Types.Elements.Plant:
            image = plant_icon;
            break;
        case Types.Elements.Animal:
            image = animal_icon;
            break;
    }
    return <img src={image} alt={props.type} className={style.Icons__elementImage} />
}

export function ElementList(props: { elemetCount: { type: Types.Elements, count: number }[] }) {
    const elemetDivs = props.elemetCount.map(e => {
        return (
            <div className={style.Icons__elementContainer} key={e.type}>
                <div className={style.Icons__elementText}>{e.count}</div>
                <ElementIcon type={e.type} />
            </div>
        )
    });
    return <div className={style.Icons__elementList}>
        {elemetDivs}
    </div>
}



