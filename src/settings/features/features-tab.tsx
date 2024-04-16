import { useFeatureStore } from "@/stores/features";
import FeatureSwitch from "./feature-switch";

export function FeaturesTab() {
    const features = useFeatureStore((state) => state.features);

    return (
        <div className="space-y-2">
            {Object.keys(features).map((feature) => (
                <FeatureSwitch key={feature} featureId={feature as keyof typeof features} />
            ))}
        </div>
    );
}
