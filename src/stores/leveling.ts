import { RouteData } from "@/leveling-tracker/route-processing/types";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

type LevelingStore = {
    sections: RouteData.Section[];
    section: number;
    step: number;
    lastUpdate: number;
    setSections: (sections: RouteData.Section[]) => void;
    nextSection: () => void;
    setStep: (step: number) => void;
    setLastUpdate: (lastUpdate: number) => void;
};

export const useLevelingStore = create<LevelingStore>()(
    devtools(
        persist(
            (set, get) => ({
                sections: [],
                section: 0,
                step: 0,
                lastUpdate: 0,
                setSections: (sections: RouteData.Section[]) => set({ sections }),
                nextSection: () => set({
                    section: get().section + 1,
                    step: 0,
                }),
                setStep: (step: number) => set({ step }),
                setLastUpdate: (lastUpdate: number) => set({ lastUpdate }),
            }),
            {
                name: "leveling-store-2",
            }
        )
    )
);
