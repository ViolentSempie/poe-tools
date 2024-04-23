import { getRandomElement, getShortestPath } from "./utils";
import { BANNED_COMBINATIONS, EXPORT_BASE, MAX_DISTANCE_BETWEEN_KEYSTONES, NUMBER_OF_KEYSTONES, XMLType } from "./constants";
import { PassiveTree } from "./passive-tree/passive-tree";
import { Node } from "./passive-tree/types/passive-tree";
import { shuffleArray } from "@/utils/shuffle-array";
import URLSafeBase64 from 'urlsafe-base64';
import { SkillGem } from "../skills";
import { XMLParser } from "fast-xml-parser";

export interface GeneratedBuild {
    classNode: Node;
    keystones: Node[];
    path: Node[];
    skillGem: SkillGem | null;
    skillGemId: string;
    exportString: string;
}

export class BuildGenerator {
    private _tree: PassiveTree;
    private _selectedNodes: Node[] = [];
    private _selectedKeystones: Node[] = [];
    private _keystoneBlacklist: Node[] = [];
    private _gem: SkillGem;

    public constructor(tree: PassiveTree, gem: SkillGem) {
        this._tree = tree;
        this._gem = gem;
    }

    public static importBuildString(tree: PassiveTree, buildString: string, gemFinder?: (gemId: string) => SkillGem | null): GeneratedBuild | null {
        const xml = new TextDecoder().decode(window.electron.inflate(Buffer.from(URLSafeBase64.decode(buildString))));
        const parser = new XMLParser({
            ignoreAttributes: false,
            isArray: (name, jpath) => {
                return [
                    "PathOfBuilding.Skills.SkillSet",
                    "PathOfBuilding.Tree.Spec",
                    "PathOfBuilding.Items.ItemSet",
                ].includes(jpath);
            },
        });

        const data = parser.parse(xml) as XMLType;

        // todo: validate the xml somehow

        const selectedNodesList = data.PathOfBuilding.Tree.Spec[0]["@_nodes"].split(',').map((x) => +x);
        const selectedNodes = selectedNodesList.map((id) => tree.nodes[id]);
        const selectedKeystones = selectedNodes.filter((node) => node.isKeystone);

        const build: GeneratedBuild = {
            classNode: tree.classes[+data.PathOfBuilding.Tree.Spec[0]["@_classId"]],
            keystones: selectedKeystones,
            path: selectedNodes,
            exportString: buildString,
            skillGem: gemFinder?.(data.PathOfBuilding.Skills.SkillSet[0].Skill.Gem["@_gemId"]) ?? null,
            skillGemId: data.PathOfBuilding.Skills.SkillSet[0].Skill.Gem["@_gemId"],
        };

        return build;
    }

    public generateFromExisting(build: GeneratedBuild, blacklist: Node[]) {
        this._keystoneBlacklist = blacklist;

        const classNode = build.classNode;
        let iteration = 0;

        while (++iteration < 100) {
            this._selectedNodes = [classNode];
            this._selectedKeystones = build.keystones.filter(x => !blacklist.includes(x));

            for (const keystone of this._selectedKeystones) {
                const shortestPath = getShortestPath(keystone, this._tree, this._selectedNodes)[0];

                this.markPath(shortestPath.id, keystone.id);
            }

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
                path: this._selectedNodes,
                exportString: this.exportBuildString(classNode),
                skillGem: this._gem,
                skillGemId: this._gem.id,
            };
        }

        return null;
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
                path: this._selectedNodes,
                exportString: this.exportBuildString(classNode),
                skillGem: this._gem,
                skillGemId: this._gem.id,
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
            .filter((x) => getShortestPath(x, this._tree, this._selectedNodes).length <= MAX_DISTANCE_BETWEEN_KEYSTONES))
            .filter((x) => !this.isBanned(x));

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
            this._selectedNodes.push(node);
        }

        this._selectedNodes = this._selectedNodes.filter((item, index) => this._selectedNodes.indexOf(item) === index);
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

    /**
     * Checks if a keystone is banned based on the selected keystones.
     *
     * @param keystone - The keystone to check.
     * @returns True if the keystone is banned, false otherwise.
     */
    private isBanned(keystone: Node) {
        if (this._keystoneBlacklist.includes(keystone)) {
            return true;
        }

        const bannedList = BANNED_COMBINATIONS.filter(x => x.includes(keystone.name));

        for (const bannedCombination of bannedList) {
            let [a, b] = bannedCombination;

            if (b === keystone.name) {
                [a, b] = [b, a];
            }

            if (this._selectedKeystones.some((keystone) => keystone.name === b)) {
                return true;
            }
        }

        return false;
    }

    private exportBuildString(classNode: Node): string {
        const className = this._tree.classes[classNode.classStartIndex!].name;
        const nodes = this._selectedNodes.map(node => node.id).join(',');
        const xml = EXPORT_BASE
            .replace("{CLASS_NAME}", className)
            .replace("{CLASS_ID}", classNode.classStartIndex!.toString())
            .replace("{TREE_NODES}", nodes)
            .replace("{GEM_ID}", this._gem.id)
            .replace("{SKILL_ID}", this._gem.skillId)
            .replace("{GEM_NAME}", this._gem.name)
            .replace("{VARIANT_ID}", this._gem.name.replace(" ", ""));

        return URLSafeBase64.encode(Buffer.from(window.electron.deflate(Buffer.from(new TextEncoder().encode(xml)))));
    }
}
