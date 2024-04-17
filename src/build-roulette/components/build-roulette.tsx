import React, { CSSProperties } from "react";
import { ImageCoordinate } from "../generator/passive-tree/passive-tree";
import { useRouletteStore } from "@/stores/roulette";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDiceD20, faSpinner } from "@fortawesome/free-solid-svg-icons";

function IconImage({ coord }: {coord: ImageCoordinate}) {
    const style: CSSProperties = {
        width: `${coord.w}px`,
        height: `${coord.h}px`,
        objectFit: "none",
        objectPosition: `-${coord.x}px -${coord.y}px`,
    };

    return <img src={coord.url} style={style}/>;
}

export function BuildRoulette() {
    const tree = useRouletteStore((state) => state.passiveTree);
    const build = useRouletteStore((state) => state.build);
    const generateBuild = useRouletteStore((state) => state.generateBuild);

    if (!tree.isLoaded) {
        return <FontAwesomeIcon icon={faSpinner} spin />;
    }

    return (
       <div className="grid grid-cols-2 gap-y-2" style={{ gridTemplateColumns: "80px 1fr"}}>
            <div className="col-span-2">
                <span className="font-medium">Your generated build</span>
            </div>

            {build?.keystones?.map((node, index) => {
                const imageCoord = tree?.imageCoordinates[node.icon];

                return (
                    <React.Fragment key={`keystone-${index}`}>
                        <div className="flex w-[54px] mx-2 mt-1">
                            {imageCoord && <IconImage coord={imageCoord} />}
                            {!imageCoord && <span>{node.name}</span>}
                        </div>

                        <div className="flex flex-col">
                            <span className="font-medium">{node.name}</span>
                            {node.stats.map((item) => item.split("\n")).flat().map((item) => (<div className="flex flex-grow text-sm">{item}</div>))}
                        </div>
                    </React.Fragment>
                );
            })}


            <div className="flex col-span-2">
                <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-violet-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-violet-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 sm:col-start-2"
                    onClick={generateBuild}
                >
                    <FontAwesomeIcon icon={faDiceD20} className="mr-2" /> Generate new build!
                </button>
            </div>
        </div>
    );
}