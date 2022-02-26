import { S3_PREFIX } from "../serverConfig";
import { DB } from "./db";

export namespace Types {
    type TokenEvent = DB.TokenEvent;
    type DahanEvent = DB.DahanEvent;

    export function getCardProperties(): string[] {
        const dummyEventDesc = new EventDesc("", "");
        const dummyPower = new (PowerCard as any)();
        const dummyFear = new (FearCard as any)();
        const dummyChoiceEvent = new (ChoiceEventCard as any)();
        const dummyStageEvent = new (StageEventCard as any)(null, dummyEventDesc, dummyEventDesc, dummyEventDesc);
        const dummyTerrorLevelEvent = new (TerrorLevelEventCard as any)(null, dummyEventDesc, dummyEventDesc, dummyEventDesc);
        const dummyHealthyBlightedLandEvent = new (HealthyBlightedLandEventCard as any)(null, dummyEventDesc, dummyEventDesc);
        const dummyAdversaryEvent = new (AdversaryEvent as any)(null, null, null, dummyStageEvent);
        let props = Object.getOwnPropertyNames(dummyPower)
            .concat(Object.getOwnPropertyNames(dummyFear))
            .concat(Object.getOwnPropertyNames(dummyChoiceEvent))
            .concat(Object.getOwnPropertyNames(dummyStageEvent))
            .concat(Object.getOwnPropertyNames(dummyTerrorLevelEvent))
            .concat(Object.getOwnPropertyNames(dummyHealthyBlightedLandEvent))
            .concat(Object.getOwnPropertyNames(dummyAdversaryEvent))
            .filter((name) => name.toLowerCase() === name);
        props = [...new Set(props)];
        return props;
    }

    export enum Speed {
        Fast = "Fast",
        Slow = "Slow",
    }

    export enum Land {
        Ocean = "Ocean",
        Jungle = "Jungle",
        Wetland = "Wetland",
        Mountain = "Mountain",
        Sands = "Sands",
        Coastal = "Coastal",
        Inland = "Inland",
    }

    export const LandAny = [Land.Ocean, Land.Jungle, Land.Wetland, Land.Mountain, Land.Sands, Land.Coastal];

    export enum TargetSpirit {
        Any = "Any Spirit",
        Another = "Another Spirit",
        Yourself = "Yourself",
    }

    export enum TargetProperty {
        Dahan = "Dahan",
        Invaders = "Invaders",
        Town = "Town",
        City = "City",
        Blight = "Blight",
        NoBlight = "No Blight",
        NoInvaders = "No Invaders",
        NoWetland = "No Wetland",
        Beasts = "Beasts",
        TwoBeasts = "2 Beasts",
        Inland = "Inland",
        Disease = "Disease",
    }

    export type TargetType = Land | TargetSpirit | TargetProperty;

    export type Target = TargetType | TargetType[] | null;

    export enum Source {
        Presence = "Presence",
        SacredSite = "SacredSite",
    }

    export interface RangesData {
        from: Source
        range: number | number[]
        land?: (Land[] | undefined)
    }

    export class Ranges implements RangesData {
        constructor(public from: Source, public range: number | number[], public land?: (Land[] | undefined)) {
        }

        toString() {
            let res = this.from + "";
            if (this.land) {
                res += " on " + this.land;
            }
            res += ": ";
            if (Array.isArray(this.range)) {
                res += this.range.join(" & ");
            } else {
                res += this.range;
            }
            return res;
        }

        valueOf() {
            if (Array.isArray(this.range)) {
                return Math.max.apply(null, this.range);
            }
            return this.range;
        }
    }

    export enum Elements {
        Sun = "Sun",
        Moon = "Moon",
        Fire = "Fire",
        Air = "Air",
        Water = "Water",
        Earth = "Earth",
        Plant = "Plant",
        Animal = "Animal",
    }

    export enum ProductSet {
        Basegame = "Basegame",
        BranchAndClaw = "Branch & Claw",
        JaggedEarth = "Jagged Earth",
        Promo = "Promo",
        Promo2 = "Promo2",
    }

    export enum Unique {
        ASpreadOfRampantGreen = "Unique Power: A Spread of Rampant Green",
        BringerOfDreamsAndNightmares = "Unique Power: Bringer of Dreams and Nightmares",
        LightngingsSwiftStrike = "Unique Power: Lightning's Swift Strike",
        OceansHungryGrasp = "Unique Power: Ocean's Hungry Grasp",
        RiverSurgesInSunlight = "Unique Power: River Surges in Sunlight",
        ShadowsFlickerLikeFlame = "Unique Power: Shadows Flicker Like Flame",
        Thunderspeaker = "Unique Power: Thunderspeaker",
        VitalStrengthOfTheEarth = "Unique Power: Vital Strength of the Earth",
        SharpFangsBehindTheLeaves = "Unique Power: Sharp Fangs behind the Leaves",
        KeeperOfTheForbiddenWilds = "Unique Power: Keeper of the Forbidden Wilds",
        SerpentSlumberingBeneathTheIsland = "Unique Power: Serpent Slumbering Beneath the Island",
        HeartOfTheWildfire = "Unique Power: Heart of the Wildfire",
        FinderOfPathsUnseen = "Unique Power: Finder of Paths Unseen",
        FracturedDaysSplitTheSky = "Unique Power: Fractured Days Split the Sky",
        GrinningTricksterStirsUpTrouble = "Unique Power: Grinning Trickster Stirs Up Trouble",
        LureOfTheDeepWilderness = "Unique Power: Lure of the Deep Wilderness",
        ManyMindsMoveAsOne = "Unique Power: Many Minds Move as One",
        ShiftingMemoryOfAges = "Unique Power: Shifting Memory of Ages",
        ShroudOfSilentMist = "Unique Power: Shroud of Silent Mist",
        StarlightSeeksItsForm = "Unique Power: Starlight Seeks its Form",
        StonesUnyieldingDefiance = "Unique Power: Stone's Unyielding Defiance",
        VengeanceAsABurningPlague = "Unique Power: Vengeance as a Burning Plague",
        VolcanoLoomingHigh = "Unique Power: Volcano Looming High",
        DownpourDrenchesTheWorld = "Unique Power: Downpour Drenches the World",
    }

    export enum PowerDeckType {
        Minor = "Minor Power",
        Major = "Major Power",
    }

    export type PowerType = Unique | PowerDeckType;

    export enum FearType {
        Fear = "Fear",
    }

    export enum EventType {
        ChoiceEvent = "Choice Event",
        StageEvent = "Stage Event",
        TerrorLevelEvent = "Terror Level Event",
        HealthyBlightedLandEvent = "Healthy Blighted Island Event",
        AdversaryEvent = "Adversary Event",
    }

    export type CardType = PowerType | FearType | EventType | EventType[];

    export enum Adversary {
        KingdomOfFrance = "Kingdom of France",
    }

    export enum Stage {
        Stage1,
        Stage2,
        Stage3,
    }

    export enum TerrorLevel {
        TerrorLevel1,
        TerrorLevel2,
        TerrorLevel3,
    }

    export enum HealthyBlightedLand {
        Healthy,
        Blighted,
    }

    export interface PowerCardData {
        set: ProductSet,
        type: CardType,
        name: string
        imageUrl: string,
        cost: number,
        speed: Speed,
        range: RangesData | null,
        target: Target,
        elements: Elements[],
        artist: string,
        description: string
    }

    export class PowerCard implements PowerCardData {
        public imageUrl: string;
        constructor(public set: ProductSet, public type: PowerType, public name: string, public cost: number, public speed: Speed,
            public range: Ranges | null, public target: Target, public elements: Elements[],
            public artist: string, public description: string) {
            this.imageUrl = this.getImagePath() + ".webp";
        }

        getImageFolder(): string {
            return S3_PREFIX + "/cards/powers/";
        }

        toPureData(): PowerCardData {
            return {
                set: this.set,
                type: this.type,
                name: this.name,
                imageUrl: this.imageUrl,
                cost: this.cost,
                speed: this.speed,
                range: this.range ? {
                    from: this.range.from,
                    range: this.range.range,
                    land: this.range.land
                } : null,
                target: this.target,
                elements: this.elements,
                artist: this.artist,
                description: this.description
            }
        }

        public getImagePath() {
            let name;
            if (Array.isArray(this.name)) {
                name = this.name[0];
            } else {
                name = this.name;
            }
            return this.getImageFolder() + name
                .toLowerCase()
                .replace(/ /g, "_")
                .replace(/[^a-z_]/g, "");
        }
    }

    export interface FearCardData {
        set: ProductSet,
        type: CardType,
        name: string
        flipped:boolean,
        imageUrl: string,
        level1: string
        level2: string
        level3: string
    }

    export class FearCard {
        public description: string;
        public imageUrl: string;

        constructor(public set: ProductSet, public type: FearType, public name: string, public level1: string, public level2: string, public level3: string) {
            // set description for searching
            this.description = level1 + " " + level2 + " " + level3;
            this.imageUrl = this.getImagePath() + ".webp";
        }

        getImageFolder(): string {
            return S3_PREFIX + "/cards/fears/";
        }

        public toPureData(): FearCardData {
            return {
                set: this.set,
                type: this.type,
                name: this.name,
                flipped:false,
                imageUrl: this.imageUrl,
                level1: this.level1,
                level2: this.level2,
                level3: this.level3,
            }
        }
        public getImagePath() {
            let name;
            if (Array.isArray(this.name)) {
                name = this.name[0];
            } else {
                name = this.name;
            }
            return this.getImageFolder() + name
                .toLowerCase()
                .replace(/ /g, "_")
                .replace(/[^a-z_]/g, "");
        }

    }

    export abstract class EventCard {
        constructor(public set: ProductSet, public type: EventType | EventType[], public name: string | string[],
            public tokenevent: TokenEvent | null, public dahanevent: DahanEvent | null) {
        }

        getImageFolder(): string {
            return S3_PREFIX + "/cards/events/";
        }

        public getImagePath() {
            let name;
            if (Array.isArray(this.name)) {
                name = this.name[0];
            } else {
                name = this.name;
            }
            return this.getImageFolder() + name
                .toLowerCase()
                .replace(/ /g, "_")
                .replace(/[^a-z_]/g, "");
        }

    }

    export class ChoiceCost {
        constructor(public energy: number, public per: string | null, public aidedBy: Elements | null) { }

        toString(): string {
            let text = "";
            text += this.energy + " Energy";
            if (this.per !== null) {
                text += " per " + this.per + ".";
            } else {
                text += ".";
            }
            if (this.aidedBy !== null) {
                text += " Aided by " + this.aidedBy + ".";
            }
            return text;
        }
    }

    export class ChoiceDesc {
        constructor(public name: string, public cost: ChoiceCost | null, public actions: string[]) { }

        toString(): string {
            let text = "";
            text += this.name;
            if (this.cost != null) {
                text += "<br/>Cost: " + this.cost;
            }
            for (let action of this.actions) {
                text += "<br/>• " + action;
            }
            return text;
        }
    }

    export class ChoiceEventCard extends EventCard {
        constructor(set: ProductSet, name: string, public description: string, public choices: ChoiceDesc[],
            tokenevent: TokenEvent | null, dahanevent: DahanEvent | null) {
            super(set, EventType.ChoiceEvent, name, tokenevent, dahanevent);
        }

    }

    export class EventDesc {
        constructor(public name: string, public description: string) { }

        toString(): string {
            return this.name + ": " + this.description;
        }
    }

    export class StageEventCard extends EventCard {
        constructor(set: ProductSet, public level1: EventDesc, public level2: EventDesc, public level3: EventDesc,
            tokenevent: TokenEvent | null, dahanevent: DahanEvent | null) {
            super(set, EventType.StageEvent, [...new Set([level1.name, level2.name, level3.name])], tokenevent, dahanevent);
        }

    }

    export class TerrorLevelEventCard extends EventCard {
        constructor(set: ProductSet, public level1: EventDesc, public level2: EventDesc, public level3: EventDesc,
            tokenevent: TokenEvent | null, dahanevent: DahanEvent | null) {
            super(set, EventType.TerrorLevelEvent, [...new Set([level1.name, level2.name, level3.name])], tokenevent, dahanevent);
        }

    }

    export class HealthyBlightedLandEventCard extends EventCard {
        constructor(set: ProductSet, public healthy: EventDesc, public blighted: EventDesc,
            tokenevent: TokenEvent | null, dahanevent: DahanEvent | null) {
            super(set, EventType.HealthyBlightedLandEvent, [healthy.name, blighted.name], tokenevent, dahanevent);
        }

    }

    export class AdversaryEvent extends EventCard {
        private Inner: EventCard;
        public adversary: Adversary;

        constructor(set: ProductSet, name: string, adversary: Adversary, event: EventCard) {
            let names = Array.isArray(event.name) ? [name].concat(event.name) : [name, event.name];
            super(set, [EventType.AdversaryEvent, event.type as EventType], names, event.tokenevent, event.dahanevent);
            this.Inner = event;
            this.adversary = adversary;
            let self = (this as any);
            let old = Object.getOwnPropertyNames(new (EventCard as any)());
            let neu = Object.getOwnPropertyNames(event)
                .filter(prop => old.indexOf(prop) === -1);
            for (const prop of neu) {
                self[prop] = (event as any)[prop];
            }
        }

    }
}

