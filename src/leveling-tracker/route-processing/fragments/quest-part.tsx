import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Fragments } from "./types";
import { getQuest } from "@/utils/get-quest";
import { faExclamation } from "@fortawesome/free-solid-svg-icons";

type QuestPartProps = {
    part: Fragments.QuestFragment;
}

export function QuestPart({ part }: QuestPartProps) {
    const quest = getQuest(part.questId);

    return (
        <div className="font-medium text-orange-600 pl-2">
            <FontAwesomeIcon icon={faExclamation} className="pr-1" />
            {quest.name}
            {quest.reward_offers[quest.id] && ` - ${quest.reward_offers[quest.id]?.quest_npc}`}
        </div>
    );
}