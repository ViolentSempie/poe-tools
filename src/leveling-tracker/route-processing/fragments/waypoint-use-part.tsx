import { Fragments } from "./types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faGlobe } from "@fortawesome/free-solid-svg-icons";
import { getArea } from "@/utils/get-area";

type WaypointUsePartProps = {
    part: Fragments.WaypointUseFragment;
}

export function WaypointUsePart({ part }: WaypointUsePartProps) {
    const town = getArea(part.dstAreaId);

    return (
        <div className="relative flex space-x-3">
            <div className="flex items-center w-6 justify-center">
                    <FontAwesomeIcon icon={faGlobe} />
            </div>

            <div className="flex flex-row min-w-0 flex-1 space-x-1 pt-0.5">
                <p className="text-gray-100">
                    Use waypoint <FontAwesomeIcon icon={faArrowRight} />
                </p>
                <p className="font-medium text-blue-600">
                    {town.name}
                </p>
            </div>
        </div>
    );
}