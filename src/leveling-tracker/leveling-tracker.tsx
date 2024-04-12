import { RouteData } from "./route-processing/types";
import { RenderFragment } from "./route-processing/render-fragment";
import { reduce } from "@/utils/reduce";
import Divider from "@/components/divider";
import { useExileLeveling } from "@/hooks/use-exile-leveling";

export function Leveling() {
    const steps = useExileLeveling();

    return (
        <div className="absolute left-[730px] bottom-[35px] rounded-md bg-slate-800 text-gray-100">
            <div className="flow-root mt-2 px-4">
                <ul role="list" className="-mb-4">
                    {steps.map((step, index) => (
                        <li key={index}>
                            <div className="relative pb-4">
                                {index !== steps.length - 1 ? (
                                    <span className="absolute left-[12px] top-[30px] -ml-px h-1/4 w-0.5 bg-gray-600" aria-hidden="true" />
                                ) : null}
                                {reduce(step.type, {
                                    fragment_step: () => <RenderFragment fragment={step as RouteData.FragmentStep} />,
                                    _: () => <div>Unknown step type</div>,
                                })}
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            <Divider className="mt-2" />

            <div className="flex flex-row flex-grow">
                <button className="text-gray-100 bg-slate-800 hover:bg-slate-600 px-2 py-1 rounded-bl-md basis-1/2">Previous</button>
                <button className="text-gray-100 bg-slate-800 hover:bg-slate-600 px-2 py-1 rounded-br-md basis-1/2">Next</button>
            </div>
        </div>
    );
}
