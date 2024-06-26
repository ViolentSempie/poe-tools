import { Fragments } from "./fragments/types";

export namespace RouteData {
    export type Route = Section[];

    export interface Section {
        name: string;
        steps: Step[];
    }

    export type Step = FragmentStep | GemStep;

    export interface FragmentStep {
        type: "fragment_step";
        parts: Fragments.AnyFragment[];
        subSteps: FragmentStep[];
    }

    export interface GemStep {
        type: "gem_step";
        requiredGem: RequiredGem;
        rewardType: "quest" | "vendor";
        count: number;
    }

    export interface RouteFile {
        name: string;
        contents: string;
    }

    export interface BuildData {
        characterClass: string;
        bandit: "None" | "Oak" | "Kraityn" | "Alira";
        leagueStart: boolean;
        library: boolean;
    }

    export interface BuildTree {
        name: string;
        version: string;
        url: string;
    }

    export interface RequiredGem {
        id: string;
        note: string;
        count: number;
    }

    export interface GemLink {
        title: string;
        primaryGemIds: string[];
        secondaryGemIds: string[];
    }
}