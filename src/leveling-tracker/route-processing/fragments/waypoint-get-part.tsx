import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGlobe } from "@fortawesome/free-solid-svg-icons";

export function WaypointGetPart() {
    return (
        <div className="flex flex-row gap-x-3">
            <div className="flex items-center w-6 justify-center">
                    <FontAwesomeIcon icon={faGlobe} />
            </div>

            <div className="flex flex-row min-w-0 flex-1 space-x-1 pt-0.5">
                <p className="text-gray-100">
                    Get
                </p>
                <p className="font-medium text-orange-600">
                    waypoint
                </p>
            </div>
        </div>
    );
}