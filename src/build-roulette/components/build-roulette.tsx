import React, { CSSProperties } from "react";
import { ImageCoordinate } from "../generator/passive-tree/passive-tree";
import { useRouletteStore } from "@/stores/roulette";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClipboard, faDiceD20, faSpinner } from "@fortawesome/free-solid-svg-icons";

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
    const copyExportString = async () => {
        await navigator.clipboard.writeText(build?.exportString ?? "");
    };

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

            {build && (
                <div className="col-span-2 mt-2 flex rounded-md shadow-sm">
                    <div className="relative flex flex-grow items-stretch focus-within:z-10">
                        <input
                            type="text"
                            name="exile-string"
                            id="exile-string"
                            disabled
                            className="block w-full rounded-none rounded-l-md border-0 py-1.5 pl-1.5 bg-slate-600 text-gray-50 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-violet-600 sm:text-sm sm:leading-6"
                            value={build.exportString}
                        />
                    </div>
                    <button
                        type="button"
                        className="relative -ml-px inline-flex items-center gap-x-1.5 rounded-r-md px-3 py-2 text-sm font-semibold text-gray-100 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    >
                        <FontAwesomeIcon icon={faClipboard} onClick={copyExportString} className="-ml-0.5 h-5 w-5 text-gray-400" aria-hidden="true" />
                    </button>
                </div>
            )}


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