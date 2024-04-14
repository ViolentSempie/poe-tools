import { Fragments } from "@/leveling-tracker/route-processing/fragments/types";
import { RouteData } from "@/leveling-tracker/route-processing/types";
import { ClientEvent, ClientEventType } from "@/poe-events/types/client-event";
import { EnteredClientEvent } from "@/poe-events/types/entered-client-event";
import { useLevelingStore } from "@/stores/leveling";
import { useEffect } from "react";

const ENTER_STEPS = [
    "enter",
    "waypoint_use",
    "logout",
];

function getSteps(section: number, currentStep: number): RouteData.Step[] {
    // Go through the currentSection.steps and return all the steps until we find a section.parts[1].type === "enter"
    const currentSection = getSection(section);
    const steps = [];
    let index = currentStep;

    for (index; currentStep < currentSection.steps.length; index++) {
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
            ...getSteps(section + 1, 0),
        ];
    }

    return steps;
}

function getSection(section: number | null = null) {
    const sections = useLevelingStore.getState().sections;
    section ??= useLevelingStore.getState().section;

    return sections[section];
}

function getPart(step: RouteData.FragmentStep | RouteData.GemStep, type: string): Fragments.AnyFragment | null {
    if (step.type !== "fragment_step") {
        return null;
    }

    for (const part of step.parts) {
        if (typeof part === "string") {
            continue;
        }

        if (part.type !== type) {
            continue;
        }

        return part;
    }

    return null;
}

export function useExileLeveling() {
    const data = useLevelingStore(state => state.currentSteps);
    const setData = useLevelingStore(state => state.setCurrentSteps);

    useEffect(() => {
        window.electron.on("poe-client-event", function (event, data: ClientEvent) {
            // parse event
            if (data.type !== ClientEventType.Entered) {
                return;
            }

            const { section, step, setStep, currentSteps, setCurrentSteps } = useLevelingStore.getState();
            const currentSection = getSection();

            const enterStep = currentSteps[currentSteps.length - 1];
            const nextStep = step + currentSteps.length;

            const enteredEvent = data as EnteredClientEvent;
            const enterStepLocation = getPart(enterStep, "enter") as Fragments.EnterFragment;
            const waypointStepLocation = getPart(enterStep, "waypoint_use") as Fragments.WaypointUseFragment;
            const logoutStepLocation = getPart(enterStep, "logout") as Fragments.LogoutFragment;
            const nextLocation = enterStepLocation?.areaId ?? waypointStepLocation?.dstAreaId ?? logoutStepLocation?.areaId ?? -1;

            if (enteredEvent.locationId !== nextLocation) {
                return;
            }

            if (nextStep >= currentSection.steps.length) {
                useLevelingStore.getState().nextSection();
                setCurrentSteps(getSteps(section, 1));
                return;
            }

            setStep(nextStep);
            setCurrentSteps(getSteps(section, nextStep));
        });

        // Initialize
        const step = useLevelingStore.getState().step;
        setData(getSteps(useLevelingStore.getState().section, step));
    }, []);

    return data;
}