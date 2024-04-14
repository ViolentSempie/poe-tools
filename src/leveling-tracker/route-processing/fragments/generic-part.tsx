import { getArea } from "@/utils/get-area";
import { Fragments } from "./types";

type GenericPartProps = {
    part: Fragments.GenericFragment;
}

export function GenericPart({ part }: GenericPartProps) {
    return <p className="text-gray-100 pl-1">{part.value}</p>;
}