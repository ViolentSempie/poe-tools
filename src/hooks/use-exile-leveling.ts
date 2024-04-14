import { Fragments } from "@/leveling-tracker/route-processing/fragments/types";
import { RouteData } from "@/leveling-tracker/route-processing/types";
import { ClientEvent, ClientEventType } from "@/poe-events/types/client-event";
import { EnteredClientEvent } from "@/poe-events/types/entered-client-event";
import { useLevelingStore } from "@/stores/leveling";
import { useEffect } from "react";

function getSteps(currentSection: RouteData.Section, currentStep: number) {
    // Go through the currentSection.steps and return all the steps until we find a section.parts[1].type === "enter"
    const steps = [];

    for (let i = currentStep; i < currentSection.steps.length; i++) {
        const step = currentSection.steps[i];
        steps.push(step);

        if (step.type === "fragment_step" && typeof step.parts[0] !== "string") {
            break;
        }

        const isEnterStep = step.type === "fragment_step" &&
            typeof step.parts[1] !== "undefined" &&
            typeof step.parts[1] !== "string" &&
            step.parts[1].type === "enter";

        if (isEnterStep) {
            break;
        }
    }

    return steps;
}

function getCurrentSection() {
    const sections = useLevelingStore.getState().sections;
    const section = useLevelingStore.getState().section;

    return sections[section];
}

export function useExileLeveling() {
    const data = useLevelingStore(state => state.currentSteps);
    const setData = useLevelingStore(state => state.setCurrentSteps);

    useEffect(() => {
        function checkSkipAhead(event: EnteredClientEvent) {
            const { sections, section, step } = useLevelingStore.getState();
            let firstSectionIndex = -1;
            let firstStepIndex = -1;

            for (const sectionIndex in sections) {
                const section = sections[sectionIndex];
                
                for (const stepIndex in section.steps) {
                    const step = section.steps[stepIndex];

                    if (step.type !== "fragment_step") {
                        continue;
                    }

                    // todo: possibly check subSteps

                    const enterStepLocation = (step as RouteData.FragmentStep).parts[1] as Fragments.EnterFragment;
                    const waypointStepLocation = (step as RouteData.FragmentStep).parts[0] as Fragments.WaypointUseFragment;
                    const logoutStepLocation = (step as RouteData.FragmentStep).parts[0] as Fragments.LogoutFragment;
                    const nextLocation = enterStepLocation?.areaId ?? waypointStepLocation.dstAreaId ?? logoutStepLocation.areaId ?? -1;
                    const type = enterStepLocation?.type ?? waypointStepLocation.type ?? logoutStepLocation.type ?? "";

                    if (type !== "enter" || nextLocation !== event.locationId) {
                        continue;
                    }

                    firstStepIndex = +stepIndex;
                    break;
                }

                if (firstStepIndex === -1) {
                    continue;
                }

                firstSectionIndex = +sectionIndex;
                break;
            }

            if (firstSectionIndex === -1) {
                return;
            }

            if (firstSectionIndex < section || firstStepIndex < step) {
                return;
            }

            firstStepIndex++;

            if (firstStepIndex === sections[firstSectionIndex].steps.length) {
                firstStepIndex = 0;
                firstSectionIndex++;
            }

            if (firstSectionIndex >= sections.length) {
                // we are probably done
                return;
            }

            const { setStep, setSection, setCurrentSteps } = useLevelingStore.getState();

            setSection(firstSectionIndex);
            setStep(firstStepIndex);
            setCurrentSteps(getSteps(getCurrentSection(), firstStepIndex));
        }

        window.electron.on("poe-client-event", function (event, data: ClientEvent) {
            // parse event
            if (data.type !== ClientEventType.Entered) {
                return;
            }

            const { step, setStep, currentSteps, setCurrentSteps } = useLevelingStore.getState();
            const currentSection = getCurrentSection();

            const enterStep = currentSteps[currentSteps.length - 1];
            const nextStep = step + currentSteps.length;

            const enteredEvent = data as EnteredClientEvent;
            const enterStepLocation = (enterStep as RouteData.FragmentStep).parts[1] as Fragments.EnterFragment;
            const waypointStepLocation = (enterStep as RouteData.FragmentStep).parts[0] as Fragments.WaypointUseFragment;
            const logoutStepLocation = (enterStep as RouteData.FragmentStep).parts[0] as Fragments.LogoutFragment;
            const nextLocation = enterStepLocation?.areaId ?? waypointStepLocation.dstAreaId ?? logoutStepLocation.areaId ?? -1;

            console.log(enterStep, nextLocation, enteredEvent);
            if (enteredEvent.locationId !== nextLocation) {
                checkSkipAhead(enteredEvent);
                return;
            }

            if (nextStep >= currentSection.steps.length) {
                useLevelingStore.getState().nextSection();
                setCurrentSteps(getSteps(getCurrentSection(), 0));
                return;
            }

            setStep(nextStep);
            setCurrentSteps(getSteps(currentSection, nextStep));
        });

        // Initialize
        const step = useLevelingStore.getState().step;
        const currentSection = getCurrentSection();

        setData(getSteps(currentSection, step));
    }, []);

    return data;
}