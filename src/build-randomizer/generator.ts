
import path from "ngraph.path";
import { getRandomElement, getShortestPath, shuffleArray } from "./utils";
import { FORBIDDEN_CLASSES, MAX_DISTANCE_BETWEEN_KEYSTONES } from "./constants";
import { PassiveTree } from "./passive-tree/passive-tree";
import { Node } from "./passive-tree/types/passive-tree";


function pickKeystone(tree: PassiveTree, selectedNodes: Node[], selectedKeystones: Node[]) {
    const usedKeystones: Node[] = [];
    const keystones = shuffleArray(tree.keystones.filter(x => !usedKeystones.includes(x) && !selectedKeystones.includes(x))
        .filter((x) => getShortestPath(x, tree, selectedNodes).length <= MAX_DISTANCE_BETWEEN_KEYSTONES));

    return [keystones[0], getShortestPath(keystones[0], tree, selectedNodes)[0]];
}

function getClassId(tree: PassiveTree, classId?: number) {
    if (classId) {
        return classId;
    }

    do {
        classId = +getRandomElement(Object.keys(tree.classes).map((x) => +x));
    } while (FORBIDDEN_CLASSES.includes(tree.classes[classId].name.toLowerCase()));

    return classId;
}

export function generateBuild(tree: PassiveTree, classId?: number) {
    // Pick a random class if no class has been passed
    classId = getClassId(tree, classId);

    const classNode = tree.classes[classId];
    let iteration = 0;

    // Iterate for 100 times until we have a build that is allowed
    while (++iteration < 100) {
        const selectedNodes: Node[] = [classNode];
        const selectedKeystones: Node[] = [];

        let subIteration = 0;

        do {
            // Pick a keystone using the currently selectedNodes to determine distance
            const [keystone, node] = pickKeystone(tree, selectedNodes, selectedKeystones) ?? [null, null];

            if (!keystone || !node) {
                continue;
            }
            
            // Mark of the path in the selectedNodes for the next keystone
            const path = tree.findPath(node.id, keystone.id);

            for (const node of path) {
                if (selectedNodes.map((x) => x.id).includes(+node.id)) {
                    continue;
                }

                selectedNodes.push(node);
            }

            // Mark the keystone as found
            selectedKeystones.push(keystone);
        } while (selectedKeystones.length < 4 && ++subIteration < 15);

        // Error out of this iteration if the amount of keystones is not 4
        if (selectedKeystones.length !== 4) {
            continue;
        }

        // We have viable build!
        return {
            classNode: classNode,
            keystones: selectedKeystones,
        };
    }

    return null;
}