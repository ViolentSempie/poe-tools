import { FragmentStep } from './../leveling-tracker/route-processing/types.d';
import { Fragments } from "@/leveling-tracker/route-processing/fragments/types";
import { RouteData } from "@/leveling-tracker/route-processing/types";
import { ClientEvent, ClientEventType } from "@/poe-events/types/client-event";
import { EnteredClientEvent } from "@/poe-events/types/entered-client-event";
import { useLevelingStore } from "@/stores/leveling";
import { useEffect, useState } from "react";

function getSteps(currentSection: RouteData.Section, currentStep: number) {
    // Go through the currentSection.steps and return all the steps until we find a section.parts[1].type === "enter"
    const steps = [];

    for (let i = currentStep; i < currentSection.steps.length; i++) {
        const step = currentSection.steps[i];
        steps.push(step);

        const isEnterStep = step.type === "fragment_step" && typeof step.parts[1] !== "string" && step.parts[1].type === "enter";

        if (isEnterStep) {
            break;
        }
    }

    return steps;
}

export function useExileLeveling() {
    const sections = useLevelingStore((state) => state.sections);
    const section = useLevelingStore((state) => state.section);
    const step = useLevelingStore((state) => state.step);

    const currentSection = sections[section];
    const [currentSteps, setCurrentSteps] = useState<(RouteData.FragmentStep | RouteData.GemStep)[]>(getSteps(currentSection, step));

    const enterStep = currentSteps[currentSteps.length - 1];
    const nextStep = step + currentSteps.length;

    useEffect(() => {
        window.electron.on("poe-client-event", (event, data: ClientEvent) => {
            // parse event
            console.log(event, data, enterStep);
            if (data.type !== ClientEventType.Entered) {
                return;
            }

            const enteredEvent = data as EnteredClientEvent;
            const enterStepLocation = (enterStep as FragmentStep).parts[1] as Fragments.EnterFragment;

            if (enteredEvent.locationId === enterStepLocation.areaId) {
                setCurrentSteps(getSteps(currentSection, nextStep));
            }
        });
    }, []);

    return currentSteps;
}