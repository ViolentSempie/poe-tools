import { ExileLevelingReset } from "./exile-leveling-reset";
import { ExileLevelingString } from "./exile-leveling-string";

export function ExileLevelingTab() {
    return (
        <div className="flex flex-col flex-grow">
            <ExileLevelingString />
            <ExileLevelingReset />
        </div>
    );
}
