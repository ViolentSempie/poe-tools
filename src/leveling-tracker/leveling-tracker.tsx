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

    return (
        <div className="absolute right-1/2 bottom-[38px] rounded-md bg-slate-800 text-gray-100 opacity-90">
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
                <button onClick={previousStep} className="text-gray-100 bg-slate-800 hover:bg-slate-600 px-2 py-1 rounded-bl-md basis-1/2">Previous</button>
                <button onClick={nextStep} className="text-gray-100 bg-slate-800 hover:bg-slate-600 px-2 py-1 rounded-br-md basis-1/2">Next</button>
            </div>
        </div>
    );
}
