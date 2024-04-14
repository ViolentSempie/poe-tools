import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGlobe } from "@fortawesome/free-solid-svg-icons";

export function WaypointGetPart() {
    return (
        <p className="font-medium text-blue-600">
            <FontAwesomeIcon icon={faGlobe} /> waypoint
        </p>
    );
}