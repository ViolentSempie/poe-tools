import { RouteData } from "../types";
import { Fragments } from "./types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSkull } from "@fortawesome/free-solid-svg-icons";

type KillFragmentProps = {
    fragment: RouteData.FragmentStep;
}

export function KillFragment({ fragment }: KillFragmentProps) {
    const text = fragment.parts[0] as string;
    const killTarget = fragment.parts[1] as Fragments.KillFragment;

    return (
        <div className="relative flex space-x-3">
            <div className="flex items-center w-6 justify-center">
                <FontAwesomeIcon icon={faSkull} />
            </div>

            <div className="flex flex-row min-w-0 flex-1 justify-between space-x-1 pt-0.5">
                <p className="text-gray-100">
                    {text}
                </p>
                <p className="font-medium text-orange-600">
                    {killTarget.value}
                </p>
            </div>
        </div>
    );
}