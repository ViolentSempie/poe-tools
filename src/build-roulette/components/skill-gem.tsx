import { useEffect, useState } from "react";
import { SkillGem as SkillGemType, getSkills } from "../skills";
import { useRouletteStore } from "@/stores/roulette";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDiceD20 } from "@fortawesome/free-solid-svg-icons";

export function SkillGem() {
    const [gems, setGems] = useState<SkillGemType[]>([]);
    const selectedSkillGem = useRouletteStore((state) => state.selectedSkillGem);
    const setSelectedSkillGem = useRouletteStore((state) => state.setSelectedSkillGem);

    useEffect(() => {
        getSkills().then((data) => {
            setGems(data);
        });
    }, []);

    const setRandomGem = () => {
        // randomize a number between 0 and gems.length
        const randomGem = Math.floor(Math.random() * gems.length);
        setSelectedSkillGem(gems[randomGem]);
    };

    return (
        <div className="flex flex-col gap-y-2">
            {selectedSkillGem !== null && (
                <div className="flex flex-col gap-y-2">
                    <span className="font-medium">{selectedSkillGem?.name ?? "Loading gem name"}</span>
                    <span className="text-sm">{selectedSkillGem?.description ?? "Loading gem description"}</span>
                </div>
            )}

            <button
                type="button"
                className="inline-flex w-full justify-center rounded-md bg-violet-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-violet-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 sm:col-start-2"
                onClick={setRandomGem}
            >
                <FontAwesomeIcon icon={faDiceD20} className="mr-2" /> Randomize a skill gem
            </button>
        </div>
    );
}
