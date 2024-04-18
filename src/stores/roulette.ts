import { BuildGenerator, GeneratedBuild } from "@/build-roulette/generator/generator";
import { PassiveTree } from "@/build-roulette/generator/passive-tree/passive-tree";
import { SkillGem } from "@/build-roulette/skills";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

type BuildRouletteStore = {
    passiveTree: PassiveTree;
    build: GeneratedBuild | null;
    selectedSkillGem: SkillGem | null;
    selectedClass: number;
    setSelectedSkillGem: (skillGem: SkillGem) => void;
    setSelectedClass: (classId: number) => void;
    initialize: () => void;
    buildGenerator: () => Promise<BuildGenerator>;
    generateBuild: () => Promise<void>;
    reset: () => void;
};


export const useRouletteStore = create<BuildRouletteStore>()(
    devtools(
        persist(
            (set, get) => ({
                passiveTree: new PassiveTree(),
                build: null,
                selectedSkillGemData: null,
                selectedSkillGem: null,
                selectedClass: 0,

                setSelectedSkillGem: (skillGem) => set({ selectedSkillGem: skillGem }),
                setSelectedClass: (classId) => set({ selectedClass: classId }),

                initialize: () => {
                    get().passiveTree?.load();
                },

                buildGenerator: async () => {
                    if (!get().passiveTree.isLoaded) {
                        await get().passiveTree.load();
                    }

                    return new BuildGenerator(get().passiveTree, get().selectedSkillGem!);
                },
                generateBuild: async () => {
                    set({ build: (await get().buildGenerator()).generate(get().selectedClass)})
                },
                reset: () => set({ build: null, selectedClass: 0, selectedSkillGem: null }),
            }),
            {
                name: "build-roulette-store",
                partialize: (state) => ({
                    selectedSkillGem: state.selectedSkillGem,
                    selectedClass: state.selectedClass,
                    build: state.build,
                }),
            }
        )
    )
);