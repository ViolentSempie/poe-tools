import { Fragments } from "./types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faGlobe } from "@fortawesome/free-solid-svg-icons";
import { getArea } from "@/utils/get-area";

type PortalSetPartProps = {
    part: Fragments.PortalSetFragment;
}

export function PortalSetPart({ part }: PortalSetPartProps) {
    return (
        <div className="flex flex-row min-w-0 flex-1 space-x-1 pt-0.5 pl-1">
            <p className="text-blue-600">
                <FontAwesomeIcon icon={faGlobe} /> portal
            </p>
        </div>
    );
}