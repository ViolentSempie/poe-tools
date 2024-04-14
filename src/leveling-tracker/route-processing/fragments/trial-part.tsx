import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPuzzlePiece } from "@fortawesome/free-solid-svg-icons";

export function TrialPart() {
    return (
        <p className="font-medium text-yellow-600 pl-1">
            <FontAwesomeIcon icon={faPuzzlePiece} /> Trial of Ascendancy
        </p>
    );
}