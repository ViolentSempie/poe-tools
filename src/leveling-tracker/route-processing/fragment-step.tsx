import { reduce } from "@/utils/reduce";
import { RouteData } from "./types";
import { TrialPart } from "./fragments/trial-part";
import { WaypointGetPart } from "./fragments/waypoint-get-part";
import { EnterPart } from "./fragments/enter-part";
import { Fragments } from "./fragments/types";
import { KillPart } from "./fragments/kill-part";
import { LogoutPart } from "./fragments/logout-part";
import { StringPart } from "./fragments/string-part";
import { WaypointUsePart } from "./fragments/waypoint-use-part";
import { WaypointPart } from "./fragments/waypoint-part";
import { ArenaPart } from "./fragments/arena-part";
import { QuestTextPart } from "./fragments/quest-text-part";
import { DirectionPart } from "./fragments/direction-part";
import { QuestPart } from "./fragments/quest-part";
import { CraftingPart } from "./fragments/crafting-part";
import { GenericPart } from "./fragments/generic-part";
import { PortalUsePart } from "./fragments/portal-use-part";
import { PortalSetPart } from "./fragments/portal-set-part";
import { AreaPart } from "./fragments/area-part";
import { ReactNode } from "react";
import { NotImplementedPart } from "./fragments/not-implemented-part";
import { AscendPart } from "./fragments/ascend-part";

type RenderFragmentProps = {
    fragment: RouteData.FragmentStep;
}

export function FragmentStep({ fragment }: RenderFragmentProps) {
    return (
        <div className="flex flex-col">
            <div className="flex flex-row">
                {fragment.parts.map((part, index) => (
                    <div key={index}>
                        {typeof part === "string" && <StringPart part={part} />}
                        {typeof part !== "string" && reduce(part.type, {
                            kill: () => <KillPart part={part as Fragments.KillFragment} />,
                            enter: () => <EnterPart part={part as Fragments.EnterFragment} />,
                            trial: () => <TrialPart />,
                            arena: () => <ArenaPart part={part as Fragments.ArenaFragment} />,
                            logout: () => <LogoutPart part={part as Fragments.LogoutFragment} />,
                            quest: () => <QuestPart part={part as Fragments.QuestFragment} />,
                            quest_text: () => <QuestTextPart part={part as Fragments.QuestTextFragment} />,
                            waypoint: () => <WaypointPart />,
                            waypoint_get: () => <WaypointGetPart />,
                            waypoint_use: () => <WaypointUsePart part={part as Fragments.WaypointUseFragment} />,
                            dir: () => <DirectionPart part={part as Fragments.DirectionFragment} />,
                            crafting: () => <CraftingPart part={part as Fragments.CraftingFragment} />,
                            generic: () => <GenericPart part={part as Fragments.GenericFragment} />,
                            portal_use: () => <PortalUsePart part={part as Fragments.PortalUseFragment} />,
                            portal_set: () => <PortalSetPart part={part as Fragments.PortalSetFragment} />,
                            area: () => <AreaPart part={part as Fragments.AreaFragment} />,
                            copy: () => <NotImplementedPart type="copy" part={part} />,
                            ascend: () => <AscendPart part={part as Fragments.AscendFragment} />,
                            reward_quest: () => <NotImplementedPart type="reward_quest" part={part} />,
                            reward_vendor: () => <NotImplementedPart type="reward_vendor" part={part} />,
                            _: () => <NotImplementedPart type={part.type} part={part} />,
                        } as Record<typeof part.type | "_", () => ReactNode>)}
                    </div>
                ))}
            </div>

            {fragment.subSteps.map((subStep, index) => (
                <FragmentStep key={index} fragment={subStep} />
            ))}
            {/* {reduce(fragment.parts[1].type, {
                kill: () => <KillFragment fragment={fragment} />,
                enter: () => <EnterFragment fragment={fragment} />,
                trial: () => <TrialFragment />,
                waypoint_get: () => <WaypointGetFragment />,
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
            })} */}
        </div>
    );
}
