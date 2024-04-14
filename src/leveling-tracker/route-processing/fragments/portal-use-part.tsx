import { Fragments } from "./types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faGlobe } from "@fortawesome/free-solid-svg-icons";
import { getArea } from "@/utils/get-area";

type PortalUsePartProps = {
    part: Fragments.PortalUseFragment;
}

export function PortalUsePart({ part }: PortalUsePartProps) {
    const town = getArea(part.dstAreaId);

    return (
        <div className="flex flex-row min-w-0 flex-1 space-x-1 pt-0.5 pl-1">
            <p className="text-blue-600">
                <FontAwesomeIcon icon={faGlobe} /> portal
            </p>

            <p>
                <FontAwesomeIcon icon={faArrowRight} />
            </p>

            <p className="font-medium text-yellow-600">
                {town.name}
            </p>
        </div>
    );
}