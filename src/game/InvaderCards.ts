
export enum LandType {
    Jungle = "Jungle",
    Wetland = "Wetland",
    Mountain = "Mountain",
    Sands = "Sands",
}
export type InvaderCardData = {
    stage: 1 | 2 | 3,
    id: number,
    flipped:boolean,
    land1: LandType | "Coastal"
    land2?: LandType,
}

export const InvaderCardsStage1: InvaderCardData[] = [
    { stage: 1, id: 0, flipped:false, land1: LandType.Wetland },
    { stage: 1, id: 1, flipped:false, land1: LandType.Mountain },
    { stage: 1, id: 2, flipped:false, land1: LandType.Jungle },
    { stage: 1, id: 3, flipped:false, land1: LandType.Sands },
]
export const InvaderCardsStage2: InvaderCardData[] = [
    { stage: 2, id: 0, flipped:false, land1: LandType.Jungle },
    { stage: 2, id: 1, flipped:false, land1: LandType.Wetland },
    { stage: 2, id: 2, flipped:false, land1: LandType.Sands },
    { stage: 2, id: 3, flipped:false, land1: LandType.Mountain },
    { stage: 2, id: 4, flipped:false, land1: "Coastal" },
]
export const InvaderCardsStage3: InvaderCardData[] = [
    { stage: 3, id: 0, flipped:false, land1: LandType.Jungle, land2: LandType.Wetland },
    { stage: 3, id: 1, flipped:false, land1: LandType.Sands, land2: LandType.Wetland },
    { stage: 3, id: 2, flipped:false, land1: LandType.Jungle, land2: LandType.Sands },
    { stage: 3, id: 3, flipped:false, land1: LandType.Mountain, land2: LandType.Jungle },
    { stage: 3, id: 4, flipped:false, land1: LandType.Mountain, land2: LandType.Wetland },
    { stage: 3, id: 5, flipped:false, land1: LandType.Sands, land2: LandType.Mountain },
]
