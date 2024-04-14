import { faPuzzlePiece } from "@fortawesome/free-solid-svg-icons";
import { Fragments } from "./types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type AscendPartProps = {
    part: Fragments.AscendFragment;
}

export function AscendPart({ part }: AscendPartProps) {
    return (
        <div className="flex flex-row min-w-0 flex-1 space-x-1 pt-0.5 pl-1">
            <p className="text-yellow-600">
                <FontAwesomeIcon icon={faPuzzlePiece} /> Ascend
            </p>
        </div>
    );
}