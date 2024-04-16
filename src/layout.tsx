import { Settings } from "./settings/settings";
import { useLevelingStore } from "./stores/leveling";
import { Leveling } from "./leveling-tracker/leveling-tracker";

export default function RootLayout() {
  const exileLevelingEnabled = useLevelingStore((state) => state.enabled);

  return (
    <div className={`absolute w-full h-full bg-transparent`}>
      <main className="absolute w-full h-full bg-transparent">
        <Settings />

        {exileLevelingEnabled && <Leveling />}
      </main>
    </div>
  );
}
