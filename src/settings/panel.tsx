import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SettingsModal from "./settings-modal";
import { useState } from "react";
import { faCog, faDiceD20 } from "@fortawesome/free-solid-svg-icons";
import { useFeatureStore } from "@/stores/features";
import BuildRouletteModal from "@/build-roulette/build-roulette-modal";

export function Panel() {
    const [open, setOpen] = useState(false);
    const [rouletteOpen, setRouletteOpen] = useState(false);

    const hotkeyHelperTextFeature = useFeatureStore((state) => state.features.hotkeyHelperText);
    const buildRouletteFeature = useFeatureStore((state) => state.features.buildRoulette);

    return (
        <div className="absolute bottom-[200px] left-[300px] flex items-center">
            <div className="flex flex-row gap-x-2">
                {buildRouletteFeature.enabled && (
                    <button
                        onClick={() => setRouletteOpen(!rouletteOpen)}
                        type="button"
                        className="rounded bg-violet-600 px-2 py-1 text-xs font-semibold text-white shadow-sm hover:bg-violet-500 active:bg-violet-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
                    >
                        <FontAwesomeIcon icon={faDiceD20} className="h-6 w-6 text-gray-100" />
                    </button>
                )}

                <button
                    onClick={() => setOpen(!open)}
                    type="button"
                    className="rounded bg-violet-600 px-2 py-1 text-xs font-semibold text-white shadow-sm hover:bg-violet-500 active:bg-violet-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
                >
                    <FontAwesomeIcon icon={faCog} className="h-6 w-6 text-gray-100" />
                </button>
            </div>

            {hotkeyHelperTextFeature.enabled && <span className="ml-2 text-sm rounded-md p-2 bg-opacity-70 bg-slate-800">Alt + F to enable overlay</span>}

            <BuildRouletteModal open={rouletteOpen} setOpen={setRouletteOpen} />
            <SettingsModal open={open} setOpen={setOpen} />
        </div>
    );
}
