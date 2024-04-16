import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SettingsModal from "./settings-modal";
import { useState } from "react";
import { faCog } from "@fortawesome/free-solid-svg-icons";
import { useFeatureStore } from "@/stores/features";

export function Settings() {
    const [open, setOpen] = useState(false);
    const hotkeyHelperTextFeature = useFeatureStore((state) => state.features.hotkeyHelperText);

    return (
        <div className="absolute bottom-[200px] left-[300px] flex items-center">
            <button
                onClick={() => setOpen(!open)}
                type="button"
                className="rounded bg-violet-600 px-2 py-1 text-xs font-semibold text-white shadow-sm hover:bg-violet-500 active:bg-violet-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
            >
                <FontAwesomeIcon icon={faCog} className="h-6 w-6 text-gray-100" />
            </button>

            {hotkeyHelperTextFeature.enabled && <span className="ml-2 text-sm rounded-md p-2 bg-opacity-70 bg-slate-800">Ctrl + F to enable overlay</span>}

            <SettingsModal open={open} setOpen={setOpen} />
        </div>
    );
}
