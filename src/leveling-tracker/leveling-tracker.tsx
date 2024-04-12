import { useLevelingStore } from "@/stores/leveling";

export function Leveling() {
    const sections = useLevelingStore((state) => state.sections);
    const section = useLevelingStore((state) => state.section);
    const step = useLevelingStore((state) => state.step);

    const currentSection = sections[section];
    const currentStep = currentSection.steps[step];

    return (
        <div className="absolute left-[730px] bottom-[35px] rounded-md bg-slate-800 text-gray-100 p-2 gap-y-2">
            <label className="font-bold">{currentSection.name}</label>

            {currentStep.type === "fragment_step" && (
                <div>{currentStep.parts[0].toString()}</div>
            )}

            {currentStep.type === "gem_step" && (
                <div>{currentStep.requiredGem.id}</div>
            )}
        </div>
    );
}
