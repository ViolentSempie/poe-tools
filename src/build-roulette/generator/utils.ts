import { PassiveTree } from "./passive-tree/passive-tree";
import { Node } from "./passive-tree/types/passive-tree";

export const getRandomElement = <T>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];

export function getShortestPath(targetNode: Node, tree: PassiveTree, selectedNodes: Node[]) {
    let shortestPath: Node[] = [];

    for (const node of selectedNodes) {
        const path = tree.findPath(node.id, targetNode.id);
        
        if (shortestPath.length !== 0 && path.length >= shortestPath.length) {
            continue;
        }

        shortestPath = path;
    }

    return shortestPath.reverse();
}