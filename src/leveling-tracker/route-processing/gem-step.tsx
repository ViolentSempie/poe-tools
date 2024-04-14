import { getGem } from "@/utils/get-gem";
import { RouteData } from "./types";
import { reduce } from "@/utils/reduce";

type GemStepProps = {
    gemStep: RouteData.GemStep;
}

export function GemStep({ gemStep }: GemStepProps) {
    const gem = getGem(gemStep.requiredGem.id);

    const gemColor = reduce(gem.primary_attribute, {
        strength: () => "text-red-500",
        dexterity: () => "text-green-500",
        intelligence: () => "text-blue-500",
        _: () => "text-gray-500",
    })

    return (
        <div className="flex flex-col">
            <div className="flex flex-row">
                <p className="pr-1">Buy</p>
                <p className={gemColor}>{gem.name}</p>
                <p className="pl-1">for {gem.cost}</p>
            </div>
        </div>
    );
}
