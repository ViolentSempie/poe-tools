import { RouteData } from "../types";
import { Fragments } from "./types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse } from "@fortawesome/free-solid-svg-icons";
import { getArea } from "@/utils/get-area";

type KillFragmentProps = {
    fragment: RouteData.FragmentStep;
}

export function EnterFragment({ fragment }: KillFragmentProps) {
    const enterTarget = fragment.parts[1] as Fragments.EnterFragment;
    const town = getArea(enterTarget.areaId);

    return (
        <div className="relative flex space-x-3">
            <div className="flex items-center w-6 justify-center">
                <FontAwesomeIcon icon={faHouse} />
            </div>

            <div className="flex flex-row min-w-0 flex-1 justify-between space-x-1 pt-0.5">
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