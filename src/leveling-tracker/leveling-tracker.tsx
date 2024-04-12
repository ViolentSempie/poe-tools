import { useLevelingStore } from "@/stores/leveling";
import { RouteData } from "./route-processing/types";
import { RenderFragment } from "./route-processing/render-fragment";
import { reduce } from "@/utils/reduce";
import Divider from "@/components/divider";
import { useEffect } from "react";
import { usePoeClientEvents } from "@/hooks/poe-client-event";

function getSteps(currentSection: RouteData.Section, currentStep: number) {
    // Go through the currentSection.steps and return all the steps until we find a section.parts[1].type === "enter"
    const steps = [];

    for (let i = currentStep; i < currentSection.steps.length; i++) {
        const step = currentSection.steps[i];
        steps.push(step);

        const isEnterStep = step.type === "fragment_step" && typeof step.parts[1] !== "string" && step.parts[1].type === "enter";

        if (isEnterStep) {
            break;
        }
    }

    return steps;
}

export function Leveling() {
    const sections = useLevelingStore((state) => state.sections);
    const section = useLevelingStore((state) => state.section);
    const step = useLevelingStore((state) => state.step);
    const lastPoeEvent = usePoeClientEvents();

    useEffect(() => {
        console.log(lastPoeEvent);
    }, [lastPoeEvent]);

    const currentSection = sections[section];
    const steps = getSteps(currentSection, step);

    return (
        <div className="absolute left-[730px] bottom-[35px] rounded-md bg-slate-800 text-gray-100">
            <label className="font-bold mt-2 px-4">{currentSection.name}</label>

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
