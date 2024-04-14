import { RouteData } from "./route-processing/types";
import { RenderFragment } from "./route-processing/render-fragment";
import { reduce } from "@/utils/reduce";
import Divider from "@/components/divider";
import { useExileLeveling } from "@/hooks/use-exile-leveling";

export function Leveling() {
    const steps = useExileLeveling();

    return (
        <div className="absolute right-[730px] bottom-[35px] rounded-md bg-slate-800 text-gray-100">
            <div className="flow-root mt-2 px-4">
                <div className="flex flex-col gap-y-2">
                    {steps.map((step, index) => (
                        <div key={index}>
                            <div className="relative">
                                {reduce(step.type, {
                                    fragment_step: () => <RenderFragment fragment={step as RouteData.FragmentStep} />,
                                    _: () => <div>Unknown step type</div>,
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <Divider className="mt-2" />

            <div className="flex flex-row flex-grow">
                <button className="text-gray-100 bg-slate-800 hover:bg-slate-600 px-2 py-1 rounded-bl-md basis-1/2">Previous</button>
                <button className="text-gray-100 bg-slate-800 hover:bg-slate-600 px-2 py-1 rounded-br-md basis-1/2">Next</button>
            </div>
        </div>
    );
}
