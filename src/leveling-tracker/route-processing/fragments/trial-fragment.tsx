import { RouteData } from "../types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPuzzlePiece } from "@fortawesome/free-solid-svg-icons";

type TrialFragmentProps = {
    fragment: RouteData.FragmentStep;
}

export function TrialFragment({ fragment }: TrialFragmentProps) {
    return (
        <div className="relative flex space-x-3">
            <div className="flex items-center w-6 justify-center">
                <FontAwesomeIcon icon={faPuzzlePiece} />
            </div>

            <div className="flex flex-row min-w-0 flex-1 justify-between space-x-1 pt-0.5">
                <p className="text-gray-100">
                    Complete the 
                </p>
                <p className="font-medium text-yellow-600">
                    Trial of Ascendancy
                </p>
            </div>
        </div>
    );
}