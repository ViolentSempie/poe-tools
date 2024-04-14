import { getArea } from "@/utils/get-area";
import { Fragments } from "./types";

type KillPartProps = {
    part: Fragments.EnterFragment;
}

export function EnterPart({ part }: KillPartProps) {
    const town = getArea(part.areaId);

    return (
        <p className="font-medium text-yellow-600 pl-2">
            {town.name}
        </p>
    );
}