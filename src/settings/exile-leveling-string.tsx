import { useLevelingStore } from "@/stores/leveling";
import { ClipboardIcon } from "@heroicons/react/24/solid";
import { useState } from "react";

export function ExileLevelingString() {
    const [error, setError] = useState(false);
    const sections = useLevelingStore((state) => state.sections);
    const setSections = useLevelingStore((state) => state.setSections);

    const setExileLevelingString = async () => {
        const text = await navigator.clipboard.readText();
        try {
            const data = JSON.parse(text);
            setSections(data);
            setError(false);
        } catch (e) {
            setError(true);
            console.error("Error parsing exile leveling string", e);
        }
    };

    return (
        <div>
            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-100">
                Exile Leveling String
            </label>

            <div className="mt-2 flex rounded-md shadow-sm">
                <div className="relative flex flex-grow items-stretch focus-within:z-10">
                    <input
                        type="text"
                        name="exile-string"
                        id="exile-string"
                        disabled
                        className="block w-full rounded-none rounded-l-md border-0 py-1.5 pl-1.5 bg-slate-600 text-gray-50 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-violet-600 sm:text-sm sm:leading-6"
                        value={sections.length ? "Exile leveling string imported" : "No exile leveling string imported"}
                    />
                </div>
                <button
                    type="button"
                    className="relative -ml-px inline-flex items-center gap-x-1.5 rounded-r-md px-3 py-2 text-sm font-semibold text-gray-100 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                >
                    <ClipboardIcon onClick={setExileLevelingString} className="-ml-0.5 h-5 w-5 text-gray-400" aria-hidden="true" />
                </button>
            </div>

            {error && (
                <p className="mt-2 text-sm text-red-600" id="exile-leveling-error">
                    Error parsing exile leveling string
                </p>
            )}

            <p className="mt-2 text-sm text-violet-400" id="exile-leveling-url">
                <a href="https://heartofphos.github.io/exile-leveling/">Get it here</a>
            </p>
        </div>
    )
}
