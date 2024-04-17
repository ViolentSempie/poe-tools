import Divider from "@/components/divider";
import { GeneratedBuild, BuildGenerator } from "./generator/generator";
import { CSSProperties, useEffect, useMemo, useState } from "react";
import { ImageCoordinate, PassiveTree } from "./generator/passive-tree/passive-tree";

function IconImage({ coord }: {coord: ImageCoordinate}) {
    const style: CSSProperties = {
        width: `${coord.w}px`,
        height: `${coord.h}px`,
        objectFit: "none",
        objectPosition: `-${coord.x}px -${coord.y}px`,
    };

    return <img src={coord.url} style={style}/>;
}

export function BuildRandomizer() {
    const [tree, setTree] = useState<PassiveTree | null>(null);
    const [currentBuild, setCurrentBuild] = useState<GeneratedBuild | null>(null);
    const generateNewBuild = () => {
        if (!tree) {
            setCurrentBuild(null);
            return;
        }

        const builder = new BuildGenerator(tree);
        setCurrentBuild(builder.generate());
    };

    useEffect(() => {
        const newTree = new PassiveTree();
        newTree.load().then(() => {
            setTree(newTree);
        });
    }, []);

    useEffect(() => {
        if (!tree) {
            setCurrentBuild(null);
            return;
        }

        generateNewBuild();
    }, [tree]);
    
    if (currentBuild === null) {
        return null;
    }

    return (
        <div className="absolute translate-x-[500px] right-1/2 bottom-[38px] rounded-md bg-slate-800 text-gray-100 opacity-90">
            <div className="flow-root mt-2 px-4">
                <p className="text-gray-100">Build Randomizer</p>
            </div>

            <Divider className="mt-2" />

            <div className="flow-root mt-4 px-4">
                <div className="flex flex-col gap-y-2 text-gray-100">
                    <p>Class: {currentBuild.classNode.name}</p>
                    <p>Skill: TODO</p>
                    {currentBuild.keystones.map((node, index) => {
                        const imageCoord = tree?.imageCoordinates[node.icon];

                        if (!imageCoord) {
                            return <p>{node.name}</p>;
                        }

                        return (
                            <div key={index} className={`flex flex-row gap-x-2 ${index > 0 ? "mt-2" : ""}`}>
                                <div className="relative">
                                    <IconImage coord={imageCoord} />
                                </div>

                                <div className="flex-col">
                                    <p>{node.name}</p>
                                    {node.stats.map((item) => item.split("\n")).flat().map((item) => (<div className="relative">{item}</div>))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <Divider className="mt-2" />

            <div className="flex flex-row flex-grow">
                <button onClick={generateNewBuild} className="text-gray-100 bg-slate-800 hover:bg-slate-600 px-2 py-1 rounded-bl-md justify-center">Generate another</button>
            </div>
        </div>
    );
}