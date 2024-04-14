import { Fragments } from "./types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSkull } from "@fortawesome/free-solid-svg-icons";

type KillPartProps = {
    part: Fragments.KillFragment;
}

export function KillPart({ part }: KillPartProps) {
    return (
        <p className="font-medium text-orange-600 pl-2">
            <FontAwesomeIcon icon={faSkull} /> {part.value}
        </p>
    );
}