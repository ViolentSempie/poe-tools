import { RouteData } from "@/leveling-tracker/route-processing/types";
import { getEnterStep } from "@/utils/get-part";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

const ENTER_STEPS = [
    "enter",
    "waypoint_use",
    "logout",
];

type LevelingStore = {
    sections: RouteData.Section[];
    section: number;
    step: number;
    currentSteps: (RouteData.FragmentStep | RouteData.GemStep)[];
    lastUpdate: number;
    getSection: (section?: number) => RouteData.Section;
    getSteps: (section: number, currentStep: number) => RouteData.Step[];
    setSections: (sections: RouteData.Section[]) => void;
    setSection: (section: number) => void;
    nextSection: () => void;
    setStep: (step: number) => void;
    nextStep: () => void;
    previousStep: () => void;
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
                getSection(section: number | null = null) {
                    section ??= get().section;
                    return get().sections[section];
                },
                getSteps(section: number, currentStep: number): RouteData.Step[] {
                    // Go through the currentSection.steps and return all the steps until we find a section.parts[1].type === "enter"
                    const currentSection = get().getSection(section);
                    const steps = [];
                    let index = currentStep;
                
                    for (index; index < currentSection.steps.length; index++) {
                        const step = currentSection.steps[index];
                        steps.push(step);
                
                        if (step.type === "gem_step") {
                            continue;
                        }
                
                        const findEnterPart = step.parts.find(part => typeof part !== "string" && ENTER_STEPS.includes(part.type));
                
                        if (findEnterPart) {
                            break;
                        }
                    }
                
                    if (index >= currentSection.steps.length) {
                        return [
                            ...steps,
                            ...get().getSteps(section + 1, 0),
                        ];
                    }
                
                    return steps;
                },
                setSections: (sections: RouteData.Section[]) => set({ sections }),
                setSection: (section: number) => set({ section }),
                nextSection: () => set({
                    section: get().section + 1,
                    step: 1,
                    currentSteps: get().getSteps(get().section, 1),
                }),
                setStep: (step: number) => {
                    set({ step, currentSteps: get().getSteps(get().section, step) });
                },
                nextStep: () => {
                    get().setStep(get().step + get().currentSteps.length);
                },
                previousStep: () => {
                    // find the previous enter step and set the step to the step above it
                    const currentSection = get().getSection();
                    let stepIndex = get().step - 1;

                    while (stepIndex > 0) {
                        const step = currentSection.steps[--stepIndex];
                        const enterStep = typeof step !== "string" && step.type === "fragment_step" && getEnterStep(step).length !== 0;

                        if (enterStep) {
                            get().setStep(stepIndex + 1);
                            return;
                        }
                    }

                    get().setStep(0);
                },
                setCurrentSteps: (currentSteps: (RouteData.FragmentStep | RouteData.GemStep)[]) => set({ currentSteps }),
                setLastUpdate: (lastUpdate: number) => set({ lastUpdate }),
            }),
            {
                name: "leveling-store-2",
            }
        )
    )
);
