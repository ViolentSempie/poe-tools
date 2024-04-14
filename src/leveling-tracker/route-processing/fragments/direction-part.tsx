import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown, faArrowLeft, faArrowRight, faArrowUp, } from "@fortawesome/free-solid-svg-icons";
import { Fragments } from "./types";
import { reduce } from "@/utils/reduce";

type DirectionPartProps = {
    part: Fragments.DirectionFragment;
}

export function DirectionPart({ part }: DirectionPartProps) {
    return (
        <p className="font-medium pl-2">
            {reduce(part.dirIndex, {
                1: () => <FontAwesomeIcon icon={faArrowUp} transform={{ rotate: 45 }} />,
                2: () => <FontAwesomeIcon icon={faArrowRight} />,
                3: () => <FontAwesomeIcon icon={faArrowRight} transform={{ rotate: 45 }} />,
                4: () => <FontAwesomeIcon icon={faArrowDown} />,
                5: () => <FontAwesomeIcon icon={faArrowDown} transform={{ rotate: 45 }} />,
                6: () => <FontAwesomeIcon icon={faArrowLeft} />,
                7: () => <FontAwesomeIcon icon={faArrowLeft} transform={{ rotate: 45 }} />,
                8: () => <FontAwesomeIcon icon={faArrowUp} />,
                _: (value) => <p className="text-gray-100">Unknown direction: {value as number}</p>,
            })}
        </p>
    );
}