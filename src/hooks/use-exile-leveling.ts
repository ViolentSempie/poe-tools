import { Fragments } from "@/leveling-tracker/route-processing/fragments/types";
import { ClientEvent, ClientEventType } from "@/poe-events/types/client-event";
import { EnteredClientEvent } from "@/poe-events/types/entered-client-event";
import { useLevelingStore } from "@/stores/leveling";
import { getPart } from "@/utils/get-part";
import { useEffect } from "react";

export function useExileLeveling() {
    const data = useLevelingStore(state => state.currentSteps);
    const setData = useLevelingStore(state => state.setCurrentSteps);

    useEffect(() => {
        window.electron.on("poe-client-event", function (event, data: ClientEvent) {
            // parse event
            if (data.type !== ClientEventType.Entered) {
                return;
            }

            const { getSection, step, setStep, currentSteps } = useLevelingStore.getState();
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
                return;
            }

            setStep(nextStep);
        });

        // Initialize
        const { step, section, getSteps } = useLevelingStore.getState();
        setData(getSteps(section, step));
    }, []);

    return data;
}