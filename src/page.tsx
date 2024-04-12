import { Settings } from "./settings/settings";

export default function Home() {
  return (
    <main className="absolute w-full h-full border border-red-600 bg-transparent">
      <Settings />
    </main>
  );
}
