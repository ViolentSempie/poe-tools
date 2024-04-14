import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse } from "@fortawesome/free-solid-svg-icons";
import { getArea } from "@/utils/get-area";
import { Fragments } from "./types";

type KillPartProps = {
    part: Fragments.EnterFragment;
}

export function EnterPart({ part }: KillPartProps) {
    const town = getArea(part.areaId);

    return (
        <div className="flex flex-row space-x-3">
            <div className="flex items-center w-6 justify-center">
                <FontAwesomeIcon icon={faHouse} />
            </div>

            <div className="flex flex-row min-w-0 flex-1 space-x-1 pt-0.5">
                <p className="text-gray-100">
                    Travel to
                </p>
                <p className="font-medium text-yellow-600">
                    {town.name}
                </p>
            </div>
        </div>
    );
}