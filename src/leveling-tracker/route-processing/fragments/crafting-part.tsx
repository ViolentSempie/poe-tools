import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Fragments } from "./types";
import { faHammer } from "@fortawesome/free-solid-svg-icons";

type CraftingPartProps = {
    part: Fragments.CraftingFragment;
}

export function CraftingPart({ part }: CraftingPartProps) {
    return (
        <div className="font-medium text-white-600 pl-2">
            <FontAwesomeIcon icon={faHammer} className="pr-1" />
            {part.crafting_recipes.join(", ")}
        </div>
    );
}