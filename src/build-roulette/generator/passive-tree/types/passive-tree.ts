export type Ascendancy = {
    id: string;
    name: string;
    flavourText?: string;
    flavourTextColour?: string;
    flavourTextRect?: string;
};

export type Node = {
    id: number;
    name: string;
    skill: number;
    isNotable: boolean;
    icon: string;
    stats: string[];

    activeEffectImage?: string;
    activeIcon?: string;
    group?: number;
    in?: number[];
    inactiveIcon?: string;
    isMastery?: boolean;
    isKeystone?: boolean;
    isAscendancyStart?: boolean;
    isMultipleChoice?: boolean;
    isJewelSocket?: boolean;
    isProxy?: boolean;
    isMultipleChoiceOption?: boolean;
    masteryEffects?: Record<string, {
        effect: number;
        stats: string[];
    }>;
    orbit?: number;
    orbitIndex?: number;
    out?: number[];

    ascendancyName?: unknown;
    reminderText?: string;
    recipe?: string;
    grantedStrength?: number;
    grantedDexterity?: number;
    grantedIntelligence?: number;
    grantedPassivePoints?: number;
    expansionJewel: unknown;
    flavourText?: string[];
    classStartIndex?: number;
}

export type Image = {
    filename: string;
    w: number;
    h: number;
    coords: Record<string, { x: number; y: number; w: number; h: number }>;
};

export type PassiveTree = {
    alternate_ascendancies: Ascendancy[];
    classes: {
        name: string;
        base_dex: number;
        base_int: number;
        base_str: number;
        ascendancies: Ascendancy[];
    }[];
    constants: {
        classes: {
            DexClass: number;
            DexIntClass: number;
            IntClass: number;
            StrClass: number;
            StrDexClass: number;
            StrDexIntClass: number;
            StrIntClass: number;
        };
        characterAttributes: {
            Dexterity: number;
            Intelligence: number;
            Strength: number;
        };
        PSSCentreInnerRadius: number;
        skillsPerOrbit: number[];
        orbitRadii: number[];
    };
    extraImages: Record<number, {
        x: number;
        y: number;
        image: string;
    }>;
    groups: Record<number, {
        x: number;
        y: number;
        orbits: number[];
        nodes: number[];
        background?: {
            image: string;
            isHalfImage: boolean;
        };
    }>;
    imageZoomLevels: number[];
    jewelSlots: number[];
    max_x: number;
    max_y: number;
    min_x: number;
    min_y: number;
    nodes: Record<number, Node>;
    points: {
        totalPoints: number;
        ascendancyPoints: number;
    };
    sprites: Record<string, Record<number, Image>>;
    tree: string;
}