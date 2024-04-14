import { reduce } from "@/utils/reduce";
import { RouteData } from "./types";
import { KillFragment } from "./fragments/kill-fragment";
import { EnterFragment } from "./fragments/enter-fragment";
import { WaypointUseFragment } from "./fragments/waypoint-use-fragment";
import { TrialFragment } from "./fragments/trial-fragment";
import { LogoutFragment } from "./fragments/logout-fragment";

type RenderFragmentProps = {
    fragment: RouteData.FragmentStep;
}

export function RenderFragment({ fragment }: RenderFragmentProps) {
    if (fragment.parts.length === 1) {
        if (typeof fragment.parts[0] === "string") {
            return <div>{fragment.parts[0] as string}</div>;
        }

        const { type } = fragment.parts[0];

        return reduce(type, {
                waypoint_use: () => <WaypointUseFragment fragment={fragment} />,
                logout: () => <LogoutFragment fragment={fragment} />,
                _: () => <div>Unknown type {type}</div>, 
                // waypoint_get: () => <WaypointGetFragment fragment={fragment} />,
        });
    }
    if (fragment.parts.length === 1 || typeof fragment.parts[1] === "string") {
        return <div>{fragment.parts[0] as string}</div>;
    }

    return (
        <div className="relative flex space-x-3">
            {reduce(fragment.parts[1].type, {
                kill: () => <KillFragment fragment={fragment} />,
                enter: () => <EnterFragment fragment={fragment} />,
                trial: () => <TrialFragment fragment={fragment} />,
                // arena: () => <ArenaFragment fragment={fragment} />,
                // logout: () => <LogoutFragment fragment={fragment} />,
                // enter: () => <EnterFragment fragment={fragment} />,
                // waypoint: () => <WaypointFragment fragment={fragment} />,
                // waypoint_use: () => <WaypointUseFragment fragment={fragment} />,
                // waypoint_get: () => <WaypointGetFragment fragment={fragment} />,
                // portal_use: () => <PortalUseFragment fragment={fragment} />,
                // portal_set: () => <PortalSetFragment fragment={fragment} />,
                // quest: () => <QuestFragment fragment={fragment} />,
                // quest_text: () => <QuestTextFragment fragment={fragment} />,
                // generic: () => <GenericFragment fragment={fragment} />,
                // reward_quest: () => <RewardQuestFragment fragment={fragment} />,
                // reward_vendor: () => <RewardVendorFragment fragment={fragment} />,
                
                // ascend: () => <AscendFragment fragment={fragment} />,
                // crafting: () => <CraftingFragment fragment={fragment} />,
                // direction: () => <DirectionFragment fragment={fragment} />,
                // copy: () => <CopyFragment fragment={fragment} />,
                _: () => <div>{fragment.parts[0] as string}</div>,
            })}
        </div>
    );
}
