import { RouteData } from "@/leveling-tracker/route-processing/types";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

type LevelingStore = {
    logFilePath: string;
    sections: RouteData.Section[];
    section: number;
    step: number;
    lastUpdate: number;
    setLogFilePath: (logFilePath: string) => void;
    setSections: (sections: RouteData.Section[]) => void;
    nextSection: () => void;
    setStep: (step: number) => void;
    setLastUpdate: (lastUpdate: number) => void;
};

export const useLevelingStore = create<LevelingStore>()(
    devtools(
        persist(
            (set, get) => ({
                logFilePath: "/home/sempie/.local/share/Steam/steamapps/common/Path of Exile/logs/Client.txt",
                sections: [],
                section: 0,
                step: 0,
                lastUpdate: 0,
                setLogFilePath: (logFilePath: string) => set({ logFilePath }),
                setSections: (sections: RouteData.Section[]) => set({ sections }),
                nextSection: () => set({
                    section: get().section + 1,
                    step: 0,
                }),
                setStep: (step: number) => set({ step }),
                setLastUpdate: (lastUpdate: number) => set({ lastUpdate }),
            }),
            {
                name: "leveling-store",
            }
        )
    )
);
