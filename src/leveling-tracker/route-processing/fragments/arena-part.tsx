import { Fragments } from "./types";

type ArenaPartProps = {
    part: Fragments.ArenaFragment;
}

export function ArenaPart({ part }: ArenaPartProps) {
    return <p className="font-medium text-yellow-600 pl-2">{part.value}</p>;
}