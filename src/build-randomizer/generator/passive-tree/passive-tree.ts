import { Node, PassiveTree as PassiveTreeType } from "./types/passive-tree";
import createGraph from "ngraph.graph";
import path from "ngraph.path";
import { DEFAULT_VERSION, VERSION_MAPPING } from "../constants";

export interface ImageCoordinate {
    x: number;
    y: number;
    w: number;
    h: number;
    url: string;
}

type VersionType = keyof typeof VERSION_MAPPING;

export class PassiveTree
{
    private _version: VersionType;
    private _graph: ReturnType<typeof createGraph> | null;
    private _nodes: Record<number, Node>;
    private _keystones: Node[];
    private _notables: Node[];
    private _classes: Record<number, Node>;
    private _pathFinder: path.PathFinder<unknown> | null;
    private _imageCoordinates: Record<string, ImageCoordinate>;

    /**
     * Creates an instance of PassiveTree.
     * @param version The version of the passive skill tree.
     */
    constructor(version: VersionType = DEFAULT_VERSION) {
        this._version = version;
        this._graph = null;
        this._nodes = {};
        this._keystones = [];
        this._notables = [];
        this._classes = {};
        this._imageCoordinates = {};
        this._pathFinder = null;
    }

    /**
     * Gets the classes in the passive skill tree.
     */
    get classes() {
        return this._classes;
    }

    /**
     * Gets the nodes in the passive skill tree.
     */
    get nodes() {
        return this._nodes;
    }

    /**
     * Gets the keystones in the passive skill tree.
     */
    get keystones() {
        return this._keystones;
    }

    /**
     * Gets the graph representation of the passive skill tree.
     */
    get graph() {
        return this._graph;
    }

    /**
     * Gets the image coordinates of the passive skill tree.
     */
    get imageCoordinates() {
        return this._imageCoordinates;
    }

    /**
     * Loads the passive skill tree data.
     */
    async load() {
        const response = await fetch(VERSION_MAPPING[this._version].url);
        const data = await response.json();

        console.log(data);

        this.processData(data);
    }

    /**
     * Finds a node in the passive skill tree by its ID.
     * @param nodeId The ID of the node to find.
     * @returns The node with the specified ID, or null if not found.
     */
    public findNodeById(nodeId: number): Node | null {
        return this._nodes[nodeId] ?? null;
    }

    /**
     * Finds a node in the passive skill tree by its name.
     * @param name The name of the node to find.
     * @returns The ID of the node with the specified name, or null if not found.
     */
    public findNodeByName(name: string): number | null {
        for (const nodeId in this._nodes) {
            const node = this._nodes[nodeId];

            if (node.name.toLowerCase() === name.toLowerCase()) {
                return node.id;
            }
        }

        return null;
    }

    /**
     * Finds a path between two nodes in the passive skill tree.
     * @param from The ID of the starting node.
     * @param to The ID of the target node.
     * @returns An array of nodes representing the path between the two nodes.
     */
    public findPath(from: number, to: number): Node[] {
        return (
            this._pathFinder?.find(from, to).map((item) => this.findNodeById(+item.id)).filter((item) => item) ?? []
        ) as Node[];
    }

    /**
     * Processes the data for the passive tree.
     * 
     * @param data - The data for the passive tree.
     */
    private processData(data: PassiveTreeType) {
        this._keystones = [];
        this._notables = [];
        this._nodes = {};
        this._classes = {};
        this._imageCoordinates = {};
        this._graph = createGraph();

        this.processSprites(data);
        this.processNodes(data);

        this._pathFinder = path.aStar(this._graph);
    }

    /**
     * Processes the nodes in the passive tree data.
     * 
     * @param data - The passive tree data.
     */
    private processNodes(data: PassiveTreeType) {
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
                node.name = data.classes[node.classStartIndex].name;
                node.grantedIntelligence = data.classes[node.classStartIndex].base_int;
                node.grantedDexterity = data.classes[node.classStartIndex].base_dex;
                node.grantedStrength = data.classes[node.classStartIndex].base_str;

                this._classes[node.classStartIndex] = node;
            }

            for (const nodeId of links) {
                this._graph?.addLink(+nodeKey, +nodeId);
            }

            this._graph?.addNode(+nodeKey);
            this._nodes[+nodeKey] = node;
        }
    }

    /**
     * Processes the sprites data and updates the image coordinates.
     * 
     * @param data - The passive tree data containing the sprites.
     */
    private processSprites(data: PassiveTreeType) {
        for (const spriteKey in data.sprites) {
            const imageData = data.sprites[spriteKey]["0.3835"] ?? data.sprites[spriteKey][1] ?? data.sprites[spriteKey][+Object.keys(data.sprites[spriteKey])[0] ?? null];

            if (imageData === undefined) {
                console.log(data.sprites[spriteKey]);
                continue;
            }

            for (const coord in imageData.coords) {
                if (this._imageCoordinates[coord] !== undefined) {
                    console.log("possible error?", this._imageCoordinates, coord);
                    continue;
                }

                this._imageCoordinates[coord] = {
                    x: imageData.coords[coord].x,
                    y: imageData.coords[coord].y,
                    w: imageData.coords[coord].w,
                    h: imageData.coords[coord].h,
                    url: imageData.filename,
                };
            }
        }
    }
}