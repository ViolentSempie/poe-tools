import { RouteData } from "../types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faPuzzlePiece } from "@fortawesome/free-solid-svg-icons";
import { Fragments } from "./types";
import { getArea } from "@/utils/get-area";

type LogoutFragmentProps = {
    fragment: RouteData.FragmentStep;
}

export function LogoutFragment({ fragment }: LogoutFragmentProps) {
    const logout = fragment.parts[0] as Fragments.LogoutFragment;
    const town = getArea(logout.areaId);

    return (
        <div className="relative flex space-x-3">
            <div className="flex items-center w-6 justify-center">
                <FontAwesomeIcon icon={faPuzzlePiece} />
            </div>

            <div className="flex flex-row min-w-0 flex-1 justify-between space-x-1 pt-0.5">
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