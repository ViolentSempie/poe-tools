import { Settings } from "./settings/settings";
import { Leveling } from "./leveling-tracker/leveling-tracker";
import { useFeatureStore } from "./stores/features";

export default function RootLayout() {
  const features = useFeatureStore((state) => state.features);

  return (
    <div className={`absolute w-full h-full bg-transparent`}>
      <main className="absolute w-full h-full bg-transparent">
        <Settings />

        {features.exileLeveling.enabled && <Leveling />}
      </main>
    </div>
  );
}
