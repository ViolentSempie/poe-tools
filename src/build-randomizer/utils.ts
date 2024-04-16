import { PassiveTree } from "./passive-tree/passive-tree";
import { Node } from "./passive-tree/types/passive-tree";

export const getRandomElement = <T>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];

export function shuffleArray(array: Node[]): Node[] {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }

    return array;
}

export function getShortestPath(targetNode: Node, tree: PassiveTree, selectedNodes: Node[]) {
    let shortestPath: Node[] = [];

    for (const node of selectedNodes) {
        const path = tree.findPath(node.id, targetNode.id);
        
        if (shortestPath.length !== 0 && path.length >= shortestPath.length) {
            continue;
        }

        shortestPath = path;
    }

    return shortestPath;
}