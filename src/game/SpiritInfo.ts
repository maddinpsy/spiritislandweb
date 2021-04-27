//relative include path is neccesry, because we use esm for the server backend
import { DB } from "../spirit-island-card-katalog/db";
import { Types } from "../spirit-island-card-katalog/types";
import { S3_PREFIX } from "../serverConfig";
import { SetupSpirit } from "./GamePhaseSetup";
export const SpiritInfo: SetupSpirit[] =
    [
        {
            name: "Lightning's Swift Strike",
            logoUrl: S3_PREFIX + "/spirits/Lightning/Lightning_Logo_big.png",
            frontSideUrl: S3_PREFIX + "/spirits/Lightning/Spirit Lightning (1).jpg",
            backSideUrl: S3_PREFIX + "/spirits/Lightning/Spirit Lightning (2).jpg",
            startHand: DB.PowerCards.filter(c => c.type === Types.Unique.LightngingsSwiftStrike).map(c => c.toPureData()),
        }, {
            name: "River Surges in Sunlight",
            logoUrl: S3_PREFIX + "/spirits/Rivers/Rivers_Logo_big.png",
            frontSideUrl: S3_PREFIX + "/spirits/Rivers/Spirit Rivers (1).jpg",
            backSideUrl: S3_PREFIX + "/spirits/Rivers/Spirit Rivers (2).jpg",
            startHand: DB.PowerCards.filter(c => c.type === Types.Unique.RiverSurgesInSunlight).map(c => c.toPureData()),
        }, {
            name: "Vital Strength of the Earth",
            logoUrl: S3_PREFIX + "/spirits/Earth/Earth_Logo_big.png",
            frontSideUrl: S3_PREFIX + "/spirits/Earth/Spirit Earth (1).jpg",
            backSideUrl: S3_PREFIX + "/spirits/Earth/Spirit Earth (2).jpg",
            startHand: DB.PowerCards.filter(c => c.type === Types.Unique.VitalStrengthOfTheEarth).map(c => c.toPureData()),
        }, {
            name: "Shadows Flicker Like Flame",
            logoUrl: S3_PREFIX + "/spirits/Shadows/Shadows_Logo_big.png",
            frontSideUrl: S3_PREFIX + "/spirits/Shadows/Spirit Shadows (1).jpg",
            backSideUrl: S3_PREFIX + "/spirits/Shadows/Spirit Shadows (2).jpg",
            startHand: DB.PowerCards.filter(c => c.type === Types.Unique.ShadowsFlickerLikeFlame).map(c => c.toPureData()),
        }, {
            name: "A Spread of Rampant Green",
            logoUrl: S3_PREFIX + "/spirits/Rampant/Rampant_Logo_big.png",
            frontSideUrl: S3_PREFIX + "/spirits/Rampant/Spirit Rampant (1).jpg",
            backSideUrl: S3_PREFIX + "/spirits/Rampant/Spirit Rampant (2).jpg",
            startHand: DB.PowerCards.filter(c => c.type === Types.Unique.ASpreadOfRampantGreen).map(c => c.toPureData()),
        }, {
            name: "Thunderspeaker",
            logoUrl: S3_PREFIX + "/spirits/Thunderspeaker/Thunderspeaker_Logo_big.png",
            frontSideUrl: S3_PREFIX + "/spirits/Thunderspeaker/Spirit Thunderspeaker (1).jpg",
            backSideUrl: S3_PREFIX + "/spirits/Thunderspeaker/Spirit Thunderspeaker (2).jpg",
            startHand: DB.PowerCards.filter(c => c.type === Types.Unique.Thunderspeaker).map(c => c.toPureData()),
        }, {
            name: "Ocean's Hungry Grasp",
            logoUrl: S3_PREFIX + "/spirits/Ocean/Ocean_Logo_big.png",
            frontSideUrl: S3_PREFIX + "/spirits/Ocean/Spirit Ocean (1).jpg",
            backSideUrl: S3_PREFIX + "/spirits/Ocean/Spirit Ocean (2).jpg",
            startHand: DB.PowerCards.filter(c => c.type === Types.Unique.OceansHungryGrasp).map(c => c.toPureData()),
        }, {
            name: "Bringer of Dreams and Nightmares",
            logoUrl: S3_PREFIX + "/spirits/Boden/Bodan_Logo_big.png",
            frontSideUrl: S3_PREFIX + "/spirits/Boden/Spirit Bodan (1).jpg",
            backSideUrl: S3_PREFIX + "/spirits/Boden/Spirit Bodan (2).jpg",
            startHand: DB.PowerCards.filter(c => c.type === Types.Unique.BringerOfDreamsAndNightmares).map(c => c.toPureData()),
        },
    ]


































