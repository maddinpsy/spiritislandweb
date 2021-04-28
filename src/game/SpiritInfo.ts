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
            presenceAppearance: {
                presenceTrackDiameter: 0.065,
                presenceTrackPosition: [
                    { x: 0.5109, y: 0.2990 },
                    { x: 0.5831, y: 0.2990 },
                    { x: 0.6553, y: 0.2990 },
                    { x: 0.7275, y: 0.2990 },
                    { x: 0.7997, y: 0.2990 },
                    { x: 0.8733, y: 0.2990 },
                    { x: 0.9461, y: 0.2990 },

                    { x: 0.5090, y: 0.4540 },
                    { x: 0.5823, y: 0.4540 },
                    { x: 0.6556, y: 0.4540 },
                    { x: 0.7289, y: 0.4540 },
                ],
                presenceBackground: "rgb(225, 98, 42)"
            },
        }, {
            name: "River Surges in Sunlight",
            logoUrl: S3_PREFIX + "/spirits/Rivers/Rivers_Logo_big.png",
            frontSideUrl: S3_PREFIX + "/spirits/Rivers/Spirit Rivers (1).jpg",
            backSideUrl: S3_PREFIX + "/spirits/Rivers/Spirit Rivers (2).jpg",
            startHand: DB.PowerCards.filter(c => c.type === Types.Unique.RiverSurgesInSunlight).map(c => c.toPureData()),
            presenceAppearance: {
                presenceTrackDiameter: 0.065,
                presenceTrackPosition: [
                    { x: 0.5009, y: 0.2980 },
                    { x: 0.5739, y: 0.2980 },
                    { x: 0.6469, y: 0.2980 },
                    { x: 0.7199, y: 0.2980 },
                    { x: 0.7929, y: 0.2980 },
                    { x: 0.8660, y: 0.2980 },

                    { x: 0.5009, y: 0.4540 },
                    { x: 0.5739, y: 0.4540 },
                    { x: 0.6469, y: 0.4540 },
                    { x: 0.7199, y: 0.4540 },
                    { x: 0.7929, y: 0.4540 },
                    { x: 0.8660, y: 0.4540 },
                ],
                presenceBackground: "rgb(59, 135, 128)",
            },
        }, {
            name: "Vital Strength of the Earth",
            logoUrl: S3_PREFIX + "/spirits/Earth/Earth_Logo_big.png",
            frontSideUrl: S3_PREFIX + "/spirits/Earth/Spirit Earth (1).jpg",
            backSideUrl: S3_PREFIX + "/spirits/Earth/Spirit Earth (2).jpg",
            startHand: DB.PowerCards.filter(c => c.type === Types.Unique.VitalStrengthOfTheEarth).map(c => c.toPureData()),
            presenceAppearance: {
                presenceTrackDiameter: 0.065,
                presenceTrackPosition: [
                    { x: 0.5129, y: 0.2980 },
                    { x: 0.5861, y: 0.2980 },
                    { x: 0.6593, y: 0.2980 },
                    { x: 0.7325, y: 0.2980 },
                    { x: 0.8057, y: 0.2985 },

                    { x: 0.5129, y: 0.4540 },
                    { x: 0.5861, y: 0.4540 },
                    { x: 0.6593, y: 0.4540 },
                    { x: 0.7325, y: 0.4540 },
                    { x: 0.8057, y: 0.4540 },
                ],
                presenceBackground: "#986b55"
            },
        }, {
            name: "Shadows Flicker Like Flame",
            logoUrl: S3_PREFIX + "/spirits/Shadows/Shadows_Logo_big.png",
            frontSideUrl: S3_PREFIX + "/spirits/Shadows/Spirit Shadows (1).jpg",
            backSideUrl: S3_PREFIX + "/spirits/Shadows/Spirit Shadows (2).jpg",
            startHand: DB.PowerCards.filter(c => c.type === Types.Unique.ShadowsFlickerLikeFlame).map(c => c.toPureData()),
            presenceAppearance: {
                presenceTrackDiameter: 0.065,
                presenceTrackPosition: [
                    { x: 0.5129, y: 0.2985 },
                    { x: 0.5861, y: 0.2985 },
                    { x: 0.6593, y: 0.2985 },
                    { x: 0.7325, y: 0.2985 },
                    { x: 0.8057, y: 0.2985 },

                    { x: 0.5129, y: 0.4540 },
                    { x: 0.5861, y: 0.4540 },
                    { x: 0.6593, y: 0.4540 },
                    { x: 0.7325, y: 0.4540 },
                    { x: 0.8057, y: 0.4540 },
                ],
                presenceBackground: "rgb(59, 91, 103)"
            },
        }, {
            name: "A Spread of Rampant Green",
            logoUrl: S3_PREFIX + "/spirits/Rampant/Rampant_Logo_big.png",
            frontSideUrl: S3_PREFIX + "/spirits/Rampant/Spirit Rampant (1).jpg",
            backSideUrl: S3_PREFIX + "/spirits/Rampant/Spirit Rampant (2).jpg",
            startHand: DB.PowerCards.filter(c => c.type === Types.Unique.ASpreadOfRampantGreen).map(c => c.toPureData()),
            presenceAppearance: {
                presenceTrackDiameter: 0.065,
                presenceTrackPosition: [
                    { x: 0.5160, y: 0.3080 },
                    { x: 0.5900, y: 0.3080 },
                    { x: 0.6622, y: 0.3080 },
                    { x: 0.7353, y: 0.3080 },
                    { x: 0.8084, y: 0.3080 },
                    { x: 0.8815, y: 0.3080 },

                    { x: 0.5160, y: 0.4640 },
                    { x: 0.5900, y: 0.4640 },
                    { x: 0.6622, y: 0.4640 },
                    { x: 0.7353, y: 0.4640 },
                    { x: 0.8084, y: 0.4640 },
                ],
                presenceBackground: "rgb(34, 123, 51)"
            },
        }, {
            name: "Thunderspeaker",
            logoUrl: S3_PREFIX + "/spirits/Thunderspeaker/Thunderspeaker_Logo_big.png",
            frontSideUrl: S3_PREFIX + "/spirits/Thunderspeaker/Spirit Thunderspeaker (1).jpg",
            backSideUrl: S3_PREFIX + "/spirits/Thunderspeaker/Spirit Thunderspeaker (2).jpg",
            startHand: DB.PowerCards.filter(c => c.type === Types.Unique.Thunderspeaker).map(c => c.toPureData()),
            presenceAppearance: {
                presenceTrackDiameter: 0.065,
                presenceTrackPosition: [
                    { x: 0.5160, y: 0.2985 },
                    { x: 0.5900, y: 0.2985 },
                    { x: 0.6622, y: 0.2985 },
                    { x: 0.7353, y: 0.2985 },
                    { x: 0.8084, y: 0.2985 },

                    { x: 0.5160, y: 0.4400 },
                    { x: 0.5900, y: 0.4400 },
                    { x: 0.6622, y: 0.4400 },
                    { x: 0.7353, y: 0.4400 },
                    { x: 0.8084, y: 0.4400 },
                    { x: 0.8815, y: 0.4400 },
                ],
                presenceBackground: "rgb(49, 81, 61)",
            },
        }, {
            name: "Ocean's Hungry Grasp",
            logoUrl: S3_PREFIX + "/spirits/Ocean/Ocean_Logo_big.png",
            frontSideUrl: S3_PREFIX + "/spirits/Ocean/Spirit Ocean (1).jpg",
            backSideUrl: S3_PREFIX + "/spirits/Ocean/Spirit Ocean (2).jpg",
            startHand: DB.PowerCards.filter(c => c.type === Types.Unique.OceansHungryGrasp).map(c => c.toPureData()),
            presenceAppearance: {
                presenceTrackDiameter: 0.065,
                presenceTrackPosition: [
                    { x: 0.5160, y: 0.4250 },
                    { x: 0.5886, y: 0.4250 },
                    { x: 0.6612, y: 0.4250 },
                    { x: 0.7338, y: 0.4250 },
                    { x: 0.8064, y: 0.4250 },
                    { x: 0.8790, y: 0.4250 },

                    { x: 0.5160, y: 0.5650 },
                    { x: 0.5886, y: 0.5650 },
                    { x: 0.6612, y: 0.5650 },
                    { x: 0.7338, y: 0.5650 },
                    { x: 0.8064, y: 0.5650 },
                ],
                presenceBackground: "rgb(20, 81, 148)",
            },
        }, {
            name: "Bringer of Dreams and Nightmares",
            logoUrl: S3_PREFIX + "/spirits/Boden/Bodan_Logo_big.png",
            frontSideUrl: S3_PREFIX + "/spirits/Boden/Spirit Bodan (1).jpg",
            backSideUrl: S3_PREFIX + "/spirits/Boden/Spirit Bodan (2).jpg",
            startHand: DB.PowerCards.filter(c => c.type === Types.Unique.BringerOfDreamsAndNightmares).map(c => c.toPureData()),
            presenceAppearance: {
                presenceTrackDiameter: 0.065,
                presenceTrackPosition: [
                    { x: 0.5179, y: 0.3012 },
                    { x: 0.5911, y: 0.3012 },
                    { x: 0.6644, y: 0.3012 },
                    { x: 0.7377, y: 0.3012 },
                    { x: 0.8109, y: 0.3012 },
                    { x: 0.8842, y: 0.3012 },

                    { x: 0.5170, y: 0.4580 },
                    { x: 0.5903, y: 0.4580 },
                    { x: 0.6636, y: 0.4580 },
                    { x: 0.7369, y: 0.4580 },
                    { x: 0.8102, y: 0.4580 },
                ],
                presenceBackground: "rgb(57, 40, 91)",
            },
        },
    ]


































