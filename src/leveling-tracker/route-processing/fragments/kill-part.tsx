import { Fragments } from "./types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSkull } from "@fortawesome/free-solid-svg-icons";

type KillPartProps = {
    part: Fragments.KillFragment;
}

export function KillPart({ part }: KillPartProps) {
    return (
        <div className="flex flex-row space-x-3">
            <div className="flex items-center w-6 justify-center">
                <FontAwesomeIcon icon={faSkull} />
            </div>

            <div className="flex flex-row min-w-0 flex-1 space-x-1 pt-0.5">
                <p className="text-gray-100">
                    Find and kill 
                </p>
                <p className="font-medium text-orange-600">
                    {part.value}
                </p>
            </div>
        </div>
    );
}