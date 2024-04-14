import { useLevelingStore } from "@/stores/leveling";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export function ExileLevelingReset() {
    const setSection = useLevelingStore((state) => state.setSection);
    const setStep = useLevelingStore((state) => state.setStep);

    return (
        <div>
            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-100">
                Exile Leveling Reset
            </label>

            <div className="mt-2 flex flex-col">
                <div className="relative flex flex-grow text-sm text-gray-300">
                    This will reset the leveling tool. If you are sure, click the button below.
                </div>
                <button
                onClick={() => {
                    setSection(0);
                    setStep(0);
                }}
                    type="button"
                    className="relative -ml-px inline-flex items-center gap-x-1.5 rounded-md px-3 py-2 text-sm font-semibold text-gray-100 ring-1 ring-inset ring-slate-900 bg-red-600 hover:bg-red-500 active:bg-red-700"
                >
                    <FontAwesomeIcon icon={faTrashCan} />
                    <p>I am sure, reset my progress!</p>
                </button>
            </div>
        </div>
    )
}
