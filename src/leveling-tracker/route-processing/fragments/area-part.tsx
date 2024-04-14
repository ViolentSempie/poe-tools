import { getArea } from "@/utils/get-area";
import { Fragments } from "./types";

type AreaPartProps = {
    part: Fragments.AreaFragment;
}

export function AreaPart({ part }: AreaPartProps) {
    const area = getArea(part.areaId);
    return <p className="font-medium text-yellow-600 pl-1">{area.name}</p>;
}