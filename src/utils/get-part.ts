import { Fragments } from "@/leveling-tracker/route-processing/fragments/types";
import { RouteData } from "@/leveling-tracker/route-processing/types";

export function getPart(step: RouteData.FragmentStep | RouteData.GemStep, type: string): Fragments.AnyFragment | null {
    if (step.type !== "fragment_step") {
        return null;
    }

    for (const part of step.parts) {
        if (typeof part === "string" || part.type !== type) {
            continue;
        }

        return part;
    }

    return null;
}

export function getEnterStep(enterStep: RouteData.FragmentStep) {
    const enterStepLocation = getPart(enterStep, "enter") as Fragments.EnterFragment;
    const waypointStepLocation = getPart(enterStep, "waypoint_use") as Fragments.WaypointUseFragment;
    const logoutStepLocation = getPart(enterStep, "logout") as Fragments.LogoutFragment;
    return enterStepLocation?.areaId ?? waypointStepLocation?.dstAreaId ?? logoutStepLocation?.areaId ?? "";
}