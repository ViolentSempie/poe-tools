import { AreaEnteredEvent } from 'poe-log-events/dist/events/AreaEnteredEvent';
import { Fragments } from "@/leveling-tracker/route-processing/fragments/types";
import { useLevelingStore } from "@/stores/leveling";
import { getPart } from "@/utils/get-part";
import { useEffect } from "react";
import { getArea } from '@/utils/get-area';
import { useFeatureStore } from '@/stores/features';

export function useExileLeveling() {
    const enabled = useFeatureStore(state => state.features.exileLeveling.enabled);
    const stepData = useLevelingStore(state => state.currentSteps);
    const setStepData = useLevelingStore(state => state.setCurrentSteps);

    useEffect(() => {
        if (!enabled) {
            window.electron.removeAllListeners("poe-client-area-entered");
            return;
        }

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

        return () => {
            window.electron.removeAllListeners("poe-client-area-entered");
        };
    }, [enabled]);

    useEffect(() => {
        if (enabled) {
            // Initialize
            const { step, section, getSteps } = useLevelingStore.getState();
            setStepData(getSteps(section, step));
        }
    }, []);

    return stepData;
}