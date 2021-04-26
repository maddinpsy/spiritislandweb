import { S3_PREFIX } from "../serverConfig";
import { Board } from "./SetupPhase";

export const BoardInfo: Board[] = [
    {
        name: "A",
        anchors: [
            { start: { x: 22, y: 303 }, end: { x: 327, y: 305 } },
            { start: { x: 327, y: 305 }, end: { x: 480, y: 41 } },
            { start: { x: 480, y: 40 }, end: { x: 175, y: 38 } }
        ],
        smallBoardUrl: S3_PREFIX + "/boards/BoardA_small.png",
        largeBoardUrl: S3_PREFIX + "/boards/BoardA_big.png",
        startTokens: [
            {
                landNumber: 1,
                tokens: []
            }, {
                landNumber: 2,
                tokens: [
                    { tokenType: "City", count: 1 },
                    { tokenType: "Dahan", count: 1 },
                ]
            }, {
                landNumber: 3,
                tokens: [
                    { tokenType: "Dahan", count: 2 },
                ]
            }, {
                landNumber: 4,
                tokens: [
                    { tokenType: "Blight", count: 1 },
                ]
            }, {
                landNumber: 5,
                tokens: []
            }, {
                landNumber: 6,
                tokens: [
                    { tokenType: "Dahan", count: 1 },
                ]
            }, {
                landNumber: 7,
                tokens: [
                    { tokenType: "Dahan", count: 2 },
                ]
            }, {
                landNumber: 8,
                tokens: [
                    { tokenType: "Town", count: 1 },
                ]
            }
        ],

    }, {
        name: "B",
        anchors: [
            { start: { x: 22, y: 303 }, end: { x: 327, y: 305 } },
            { start: { x: 327, y: 305 }, end: { x: 480, y: 41 } },
            { start: { x: 480, y: 40 }, end: { x: 175, y: 38 } }
        ],
        smallBoardUrl: S3_PREFIX + "/boards/BoardB_small.png",
        largeBoardUrl: S3_PREFIX + "/boards/BoardB_big.png",
        startTokens: [
            {
                landNumber: 1,
                tokens: [
                    { tokenType: "Dahan", count: 1 },
                ]
            }, {
                landNumber: 2,
                tokens: [
                    { tokenType: "City", count: 1 },
                ]
            }, {
                landNumber: 3,
                tokens: [
                    { tokenType: "Dahan", count: 2 },
                ]
            }, {
                landNumber: 4,
                tokens: [
                    { tokenType: "Blight", count: 1 },
                ]
            }, {
                landNumber: 5,
                tokens: []
            }, {
                landNumber: 6,
                tokens: [
                    { tokenType: "Town", count: 1 },
                ]
            }, {
                landNumber: 7,
                tokens: [
                    { tokenType: "Dahan", count: 1 },
                ]
            }, {
                landNumber: 8,
                tokens: [
                    { tokenType: "Dahan", count: 2 },
                ]
            }
        ],

    }, {
        name: "C",
        anchors: [
            { start: { x: 22, y: 303 }, end: { x: 327, y: 305 } },
            { start: { x: 327, y: 305 }, end: { x: 480, y: 41 } },
            { start: { x: 480, y: 40 }, end: { x: 175, y: 38 } }
        ],
        smallBoardUrl: S3_PREFIX + "/boards/BoardC_small.png",
        largeBoardUrl: S3_PREFIX + "/boards/BoardC_big.png",
        startTokens: [
            {
                landNumber: 1,
                tokens: [
                    { tokenType: "Dahan", count: 1 },
                ]
            }, {
                landNumber: 2,
                tokens: [
                    { tokenType: "City", count: 1 },
                ]
            }, {
                landNumber: 3,
                tokens: [
                    { tokenType: "Dahan", count: 2 },
                ]
            }, {
                landNumber: 4,
                tokens: []
            }, {
                landNumber: 5,
                tokens: [
                    { tokenType: "Blight", count: 1 },
                    { tokenType: "Dahan", count: 2 },
                ]
            }, {
                landNumber: 6,
                tokens: [
                    { tokenType: "Dahan", count: 1 },
                ]
            }, {
                landNumber: 7,
                tokens: [
                    { tokenType: "Town", count: 1 },
                ]
            }, {
                landNumber: 8,
                tokens: []
            },
        ],
    }, {
        name: "D",
        anchors: [
            { start: { x: 22, y: 303 }, end: { x: 327, y: 305 } },
            { start: { x: 327, y: 305 }, end: { x: 480, y: 41 } },
            { start: { x: 480, y: 40 }, end: { x: 175, y: 38 } }
        ],
        smallBoardUrl: S3_PREFIX + "/boards/BoardD_small.png",
        largeBoardUrl: S3_PREFIX + "/boards/BoardD_big.png",
        startTokens: [
            {
                landNumber: 1,
                tokens: [
                    { tokenType: "Dahan", count: 2 },
                ]
            }, {
                landNumber: 2,
                tokens: [
                    { tokenType: "City", count: 1 },
                    { tokenType: "Dahan", count: 1 },
                ]
            }, {
                landNumber: 3,
                tokens: []
            }, {
                landNumber: 4,
                tokens: []
            }, {
                landNumber: 5,
                tokens: [
                    { tokenType: "Blight", count: 1 },
                    { tokenType: "Dahan", count: 1 },
                ]
            }, {
                landNumber: 6,
                tokens: []
            }, {
                landNumber: 7,
                tokens: [
                    { tokenType: "Town", count: 1 },
                    { tokenType: "Dahan", count: 2 },
                ]
            }, {
                landNumber: 8,
                tokens: []
            },
        ],

    }, {
        name: "E",
        anchors: [
            { start: { x: 22, y: 303 }, end: { x: 327, y: 305 } },
            { start: { x: 327, y: 305 }, end: { x: 480, y: 41 } },
            { start: { x: 480, y: 40 }, end: { x: 175, y: 38 } }
        ],
        smallBoardUrl: S3_PREFIX + "/boards/BoardE_small.png",
        largeBoardUrl: S3_PREFIX + "/boards/BoardE_big.png",
        startTokens: [
            {
                landNumber: 1,
                tokens: [
                    { tokenType: "Dahan", count: 1 },
                ]
            }, {
                landNumber: 2,
                tokens: [
                    { tokenType: "City", count: 1 },
                ]
            }, {
                landNumber: 3,
                tokens: [
                    { tokenType: "Dahan", count: 2 },
                ]
            }, {
                landNumber: 4,
                tokens: [
                    { tokenType: "Blight", count: 1 },
                ]
            }, {
                landNumber: 5,
                tokens: [
                    { tokenType: "Dahan", count: 1 },
                ]
            }, {
                landNumber: 6,
                tokens: []
            }, {
                landNumber: 7,
                tokens: [
                    { tokenType: "Town", count: 1 },
                ]
            }, {
                landNumber: 8,
                tokens: [
                    { tokenType: "Dahan", count: 2 },
                ]
            }
        ],

    }, {
        name: "F",
        anchors: [
            { start: { x: 22, y: 303 }, end: { x: 327, y: 305 } },
            { start: { x: 327, y: 305 }, end: { x: 480, y: 41 } },
            { start: { x: 480, y: 40 }, end: { x: 175, y: 38 } }
        ],
        smallBoardUrl: S3_PREFIX + "/boards/BoardF_small.png",
        largeBoardUrl: S3_PREFIX + "/boards/BoardF_big.png",
        startTokens: [
            {
                landNumber: 1,
                tokens: [
                    { tokenType: "Dahan", count: 2 },
                ]
            }, {
                landNumber: 2,
                tokens: [
                    { tokenType: "City", count: 1 },
                ]
            }, {
                landNumber: 3,
                tokens: [
                    { tokenType: "Dahan", count: 1 },
                ]
            }, {
                landNumber: 4,
                tokens: [
                    { tokenType: "Blight", count: 1 },
                ]
            }, {
                landNumber: 5,
                tokens: [
                    { tokenType: "Dahan", count: 1 },
                ]
            }, {
                landNumber: 6,
                tokens: [
                    { tokenType: "Dahan", count: 2 },
                ]
            }, {
                landNumber: 7,
                tokens: []
            }, {
                landNumber: 8,
                tokens: [
                    { tokenType: "Town", count: 1 },
                ]
            }
        ],

    },
];