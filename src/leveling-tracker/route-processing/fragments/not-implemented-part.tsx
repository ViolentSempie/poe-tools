import { Fragments } from "./types";

export function NotImplementedPart({ type, part }: { type: string, part: Fragments.AnyFragment }) {
    console.log("not implemented", type, part);
    return <div className="text-red-600">Unknown type {type}</div>
}