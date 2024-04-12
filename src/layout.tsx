import { Inter } from "next/font/google";
import { Settings } from "./settings/settings";
import { useLevelingStore } from "./stores/leveling";
import { Leveling } from "./leveling-tracker/leveling-tracker";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout() {
  const sections = useLevelingStore((state) => state.sections);

  return (
    <div className={`absolute w-full h-full bg-transparent ${inter.className}`}>
      <main className="absolute w-full h-full border border-red-600 bg-transparent">
        <Settings />

        {sections.length && <Leveling />}
      </main>
    </div>
  );
}
