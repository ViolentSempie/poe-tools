import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { Fragments } from "./types";
import { getArea } from "@/utils/get-area";

type LogoutPartProps = {
    part: Fragments.LogoutFragment;
}

export function LogoutPart({ part }: LogoutPartProps) {
    const town = getArea(part.areaId);

    return (
        <div className="flex flex-row space-x-3">
            <div className="flex flex-row min-w-0 flex-1 space-x-1 pt-0.5">
                <p className="text-gray-100">
                    Logout <FontAwesomeIcon icon={faArrowRight} />
                </p>

                <p className="font-medium text-yellow-600">
                    {town.name}
                </p>
            </div>
        </div>
    );
}