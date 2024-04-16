import { Node, PassiveTree as PassiveTreeType } from "./types/passive-tree";
import createGraph from "ngraph.graph";
import path from "ngraph.path";

function createVersion(versionName: string, versionTag: string) {
    return {
        name: versionName,
        tag: versionTag,
        url: `https://raw.githubusercontent.com/poe-tool-dev/passive-skill-tree-json/master/${versionTag}/SkillTree.json`,
        assetsUrl: `https://raw.githubusercontent.com/poe-tool-dev/passive-skill-tree-json/master/${versionTag}/assets`,
    };
}

const DEFAULT_VERSION = "3.24.0";
const versionMapping = {
    "3.24.0": createVersion("3.24.0", "3.24.0-pre"),
};
type VersionType = keyof typeof versionMapping;

export class PassiveTree
{
    private _version: VersionType;
    private _graph: ReturnType<typeof createGraph> | null;
    private _nodes: Record<number, Node>;
    private _keystones: Node[];
    private _notables: Node[];
    private _classes: Record<number, Node>;
    private _pathFinder: path.PathFinder<unknown> | null;

    constructor(version: VersionType = DEFAULT_VERSION) {
        this._version = version;
        this._graph = null;
        this._nodes = {};
        this._keystones = [];
        this._notables = [];
        this._classes = {};
        this._pathFinder = null;
    }

    get classes() {
        return this._classes;
    }

    get nodes() {
        return this._nodes;
    }

    get keystones() {
        return this._keystones;
    }

    get graph() {
        return this._graph;
    }

    async load() {
        const response = await fetch(versionMapping[this._version].url);
        const data = await response.json();

        this.processData(data);
    }

    public findNodeById(nodeId: number): Node | null {
        return this._nodes[nodeId] ?? null;
    }

    public findNodeByName(name: string): number | null {
        for (const nodeId in this._nodes) {
            const node = this._nodes[nodeId];

            if (node.name.toLowerCase() === name.toLowerCase()) {
                return node.id;
            }
        }

        return null;
    }

    public findPath(from: number, to: number): Node[] {
        return this._pathFinder?.find(from, to).map((item) => this.findNodeById(+item.id)!) ?? [];
    }

    private processData(data: PassiveTreeType) {
        this._keystones = [];
        this._notables = [];
        this._nodes = {};
        this._classes = {};
        this._graph = createGraph();

        for (const nodeKey in data.nodes) {
            const node = data.nodes[nodeKey];
            const links = [...(node.in ?? []), ...(node.out ?? [])];

            if (links.length === 0) {
                continue;
            }

            if (node.ascendancyName !== undefined) {
                // ascendancy node, we dont care about those
                continue;
            }

            node.id = +nodeKey;

            if (node.isKeystone) {
                this._keystones.push(node);
            }

            if (node.isNotable) {
                this._notables.push(node);
            }

            if (node.classStartIndex !== undefined) {
                this._classes[node.classStartIndex] = node;
            }

            for (const nodeId of links) {
                this._graph.addLink(+nodeKey, +nodeId);
            }

            this._graph.addNode(+nodeKey);
            this._nodes[+nodeKey] = node;
        }

        this._pathFinder = path.aStar(this._graph!);
    }
}