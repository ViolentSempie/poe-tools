import { RouteData } from "@/leveling-tracker/route-processing/types";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

type LevelingStore = {
    sections: RouteData.Section[];
    section: number;
    step: number;
    currentSteps: (RouteData.FragmentStep | RouteData.GemStep)[];
    lastUpdate: number;
    setSections: (sections: RouteData.Section[]) => void;
    setSection: (section: number) => void;
    nextSection: () => void;
    setStep: (step: number) => void;
    setCurrentSteps: (currentSteps: (RouteData.FragmentStep | RouteData.GemStep)[]) => void;
    setLastUpdate: (lastUpdate: number) => void;
};

export const useLevelingStore = create<LevelingStore>()(
    devtools(
        persist(
            (set, get) => ({
                sections: [],
                section: 0,
                step: 0,
                currentSteps: [],
                lastUpdate: 0,
                setSections: (sections: RouteData.Section[]) => set({ sections }),
                setSection: (section: number) => set({ section }),
                nextSection: () => set({
                    section: get().section + 1,
                    step: 0,
                }),
                setStep: (step: number) => set({ step }),
                setCurrentSteps: (currentSteps: (RouteData.FragmentStep | RouteData.GemStep)[]) => set({ currentSteps }),
                setLastUpdate: (lastUpdate: number) => set({ lastUpdate }),
            }),
            {
                name: "leveling-store-2",
            }
        )
    )
);
