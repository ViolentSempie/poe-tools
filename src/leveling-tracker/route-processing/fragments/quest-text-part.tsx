import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Fragments } from "./types";
import { faExclamation } from "@fortawesome/free-solid-svg-icons";

type QuestTextPartProps = {
    part: Fragments.QuestTextFragment;
}

export function QuestTextPart({ part }: QuestTextPartProps) {
    return (
        <p className="font-medium text-green-600 pl-2">
            <FontAwesomeIcon icon={faExclamation} className="pr-1" />
            {part.value}
        </p>
    );
}