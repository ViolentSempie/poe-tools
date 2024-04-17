import { getRandomElement, getShortestPath, shuffleArray } from "./utils";
import { MAX_DISTANCE_BETWEEN_KEYSTONES, NUMBER_OF_KEYSTONES } from "./constants";
import { PassiveTree } from "./passive-tree/passive-tree";
import { Node } from "./passive-tree/types/passive-tree";

// https://www.poewiki.net/wiki/Special:CargoQuery?title=Special%3ACargoQuery&tables=skill_gems&fields=skill_gems._pageName,skill_gems.gem_tags,skill_gems.gem_description,skill_gems.primary_attribute,&where=skill_gems.is_vaal_skill_gem%3D"No"+AND+(skill_gems.gem_tags+HOLDS+LIKE+'%25attack%25'+OR+skill_gems.gem_tags+HOLDS+LIKE+'%25trap%25')%0D%0A&limit=500&format=json

export interface GeneratedBuild {
    classNode: Node;
    keystones: Node[];
    skillGem: unknown;
}

export class BuildGenerator {
    private _tree: PassiveTree;
    private _selectedNodes: Node[] = [];
    private _selectedKeystones: Node[] = [];

    public constructor(tree: PassiveTree) {
        this._tree = tree;
    }

    /**
     * Generates a random build based on the provided passive tree and class ID.
     * If no class ID is provided, a random class will be picked.
     *
     * @param tree - The passive tree object.
     * @param classId - The ID of the class to generate the build for.
     * @returns A GeneratedBuild object representing the generated build, or null if no valid build could be generated.
     */
    public generate(classId?: number): GeneratedBuild | null {
        classId = this.getClassId(classId);

        const classNode = this._tree.classes[classId];
        let iteration = 0;

        while (++iteration < 100) {
            this._selectedNodes = [classNode];
            this._selectedKeystones = [];

            let subIteration = 0;

            do {
                const [keystone, node] = this.pickKeystone() ?? [null, null];

                if (!keystone || !node) {
                    continue;
                }
                
                this.markPath(node.id, keystone.id);
                this._selectedKeystones.push(keystone);
            } while (this._selectedKeystones.length < NUMBER_OF_KEYSTONES && ++subIteration < 15);

            if (this._selectedKeystones.length !== NUMBER_OF_KEYSTONES) {
                continue;
            }

            return {
                classNode: classNode,
                keystones: this._selectedKeystones,
                skillGem: null,
            };
        }

        return null;
    }

    /**
     * Picks a keystone node from the passive tree that meets the specified criteria.
     * 
     * @param tree - The passive tree.
     * @param selectedNodes - The nodes that have already been selected.
     * @param selectedKeystones - The keystone nodes that have already been selected.
     * @returns An array containing the picked keystone node and its shortest path from the selected nodes.
     */
    pickKeystone() {
        const usedKeystones: Node[] = [];
        const keystones = shuffleArray(this._tree.keystones.filter(x => !usedKeystones.includes(x) && !this._selectedKeystones.includes(x))
            .filter((x) => getShortestPath(x, this._tree, this._selectedNodes).length <= MAX_DISTANCE_BETWEEN_KEYSTONES));

        return [keystones[0], getShortestPath(keystones[0], this._tree, this._selectedNodes)[0]];
    }

    /**
     * Marks a path between two nodes in the tree.
     * 
     * @param from - The starting node ID.
     * @param to - The ending node ID.
     */
    markPath(from: number, to: number) {
        const path = this._tree.findPath(from, to);

        for (const node of path) {
            if (this._selectedNodes.map((x) => x.id).includes(from)) {
                continue;
            }

            this._selectedNodes.push(node);
        }
    }

    /**
     * Retrieves the class ID for the passive tree generator.
     * If a class ID is provided, it is returned. Otherwise, a random class ID is generated.
     *
     * @param tree - The passive tree object.
     * @param classId - Optional class ID.
     * @returns The class ID for the passive tree generator.
     */
    getClassId(classId?: number) {
        if (classId) {
            return classId;
        }

        do {
            classId = +getRandomElement(Object.keys(this._tree.classes).map((x) => +x));
        } while (this._tree.classes[classId].classStartIndex === 0);

        return classId;
    }
}
