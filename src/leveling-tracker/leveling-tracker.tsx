import { RouteData } from "./route-processing/types";
import { FragmentStep } from "./route-processing/fragment-step";
import { reduce } from "@/utils/reduce";
import Divider from "@/components/divider";
import { useExileLeveling } from "@/hooks/use-exile-leveling";
import { GemStep } from "./route-processing/gem-step";
import { useLevelingStore } from "@/stores/leveling";

export function Leveling() {
    const steps = useExileLeveling();
    const nextStep = useLevelingStore((state) => state.nextStep);
    const previousStep = useLevelingStore((state) => state.previousStep);
    const section = useLevelingStore((state) => state.section);
    const step = useLevelingStore((state) => state.step);
    const currentSteps = useLevelingStore((state) => state.currentSteps.length);
    const numSteps = useLevelingStore((state) => state.getSection(state.section)?.steps.length ?? 0);
    const numSections = useLevelingStore((state) => state.sections.length);

    const hasNext = (step + currentSteps) < numSteps || (section + 1) < numSections;
    const hasPrevious = step > 0 || section > 0;

    return (
        <div className="absolute translate-x-1/2 right-1/2 bottom-[38px] rounded-md bg-slate-800 text-gray-100 opacity-70">
            <div className="flow-root mt-2 px-4">
                <p className="text-gray-100">Act {section + 1}</p>
            </div>

            <Divider className="mt-2" />

            <div className="flow-root mt-2 px-4">
                <div className="flex flex-col gap-y-2">
                    {steps.map((step, index) => (
                        <div key={index}>
                            <div className="relative">
                                {reduce(step.type, {
                                    fragment_step: () => <FragmentStep fragment={step as RouteData.FragmentStep} />,
                                    gem_step: () => <GemStep gemStep={step as RouteData.GemStep} />,
                                    _: () => <div>Unknown step type</div>,
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <Divider className="mt-2" />

            <div className="flex flex-row flex-grow">
                <button onClick={previousStep} className="text-gray-100 bg-slate-800 hover:bg-slate-600 px-2 py-1 rounded-bl-md basis-1/2" disabled={!hasPrevious}>Previous</button>
                <button onClick={nextStep} className="text-gray-100 bg-slate-800 hover:bg-slate-600 px-2 py-1 rounded-br-md basis-1/2" disabled={!hasNext}>Next</button>
            </div>
        </div>
    );
}
