import { AreaEnteredEvent } from 'poe-log-events/dist/events/AreaEnteredEvent';
import { Fragments } from "@/leveling-tracker/route-processing/fragments/types";
import { useLevelingStore } from "@/stores/leveling";
import { getPart } from "@/utils/get-part";
import { useEffect } from "react";
import { getArea } from '@/utils/get-area';

export function useExileLeveling() {
    const data = useLevelingStore(state => state.currentSteps);
    const setData = useLevelingStore(state => state.setCurrentSteps);

    useEffect(() => {
        window.electron.on("poe-client-area-entered", function (event, data: AreaEnteredEvent) {
            const { getSection, step, setStep, currentSteps } = useLevelingStore.getState();
            const currentSection = getSection();

            const enterStep = currentSteps[currentSteps.length - 1];
            const nextStep = step + currentSteps.length;

            const enterStepLocation = getPart(enterStep, "enter") as Fragments.EnterFragment;
            const waypointStepLocation = getPart(enterStep, "waypoint_use") as Fragments.WaypointUseFragment;
            const logoutStepLocation = getPart(enterStep, "logout") as Fragments.LogoutFragment;
            const nextLocation = enterStepLocation?.areaId ?? waypointStepLocation?.dstAreaId ?? logoutStepLocation?.areaId ?? -1;
            const area = getArea(nextLocation);

            if (area.name !== data.newArea) {
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