import { Node, PassiveTree as PassiveTreeType } from "./types/passive-tree";
import createGraph from "ngraph.graph";
import path from "ngraph.path";
import { DEFAULT_VERSION, VERSION_MAPPING } from "../constants";
import { BuildGenerator } from "../generator";

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
    private _loaded: boolean;

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
        this._loaded = false;
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

    get isLoaded() {
        return this._loaded;
    }

    /**
     * Loads the passive skill tree data.
     */
    async load() {
        const response = await fetch(VERSION_MAPPING[this._version].url);
        const data = await response.json();

        this.processData(data);
        this._loaded = true;

        const build = BuildGenerator.importBuildString(this, "eJx1VNtu2zgQfU6-guAzt-JFV8BK4SQbI0CcZtfZ9rGgpXHMliJdkXLjv1-QkjZOgH0bDQ9nzpw51OLza6fREXqnrKkx-0QxAtPYVpmXGv_zfPdHiT9fXS6epN9_2V0PSoeTq8uLRYyRhiPoGjOOkZf9C_ivcynxnWJ0kMbvwZq1_GH7lW1r_GgNYLSVplV-_mq0dO5RdlDjb8o3e4yka8C0N2_5CbiXvWw89A-h7XLwdm1bqLHvB8Cok8psbPMT_Kq3w6HGDKOjgt8j5n799OXv5zNKypxTCiMlcaYQPfcASDZeHWFzgCaUurq8uFiED9RJ56E__bnbQeNdjd_RvW9rTDEytgVX4yxN04JkOS0yIoRglGS8ykla5RkjomRFTsoqLYngnFHCWV6UJCs4zwkXWUpJxooyJ7zMipQIkaUZYSUVgqQ5rTjJWMUFScuiKIko8oIRXuRZRXKRc0pEmleEi7RgJMuzsiJZSkvCWFoVhIuSMFryighOK0bSlFFBOC0ZJ4IVVGDkoLGmlf1p-X44ozRGvgc42zRPpyUGgBilSoJWUdUgZgg2P5XWDjnb-xV07vp0-7S5U6DbGt_YbqsMtLdPGzzrHtAb8HGN7-7M-25hJwcd8n8NUit_isq_ZR9Gbxrbd1Kv5avqhg4jt7e_N8PhMFZ8Ph3CnpYPD-PJUvupWGhX453UDqbdT4SQamc_TMnovOUb6xupGxd5K9PooYV7czdoHalH-bTcBmbhqcmthvbcwWd1_mtzsVhBN4FX2m6l5vOV6QFyitELdEH_NXjZSi-Tew-dS8IcSSy3gu6ut85fW-0f7VFidJS9ksaHW19t7-EVIxeQIfEB-utM4ikOqNtRbfyOHJvJfRivsYMZ92lkNz2sqW8yyjkSnfwz6R09NHonhHGqySMhni0yONhEy34DebAmpoPYsdgE_F_Q2U4XyQSOfWO3EN1Ys1Pxx5fM4SL58Ff8F6LjqBU");
        console.log(build);
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
            const imageData = data.sprites[spriteKey]["0.3835"] ?? data.sprites[spriteKey][1] ?? data.sprites[spriteKey][+(Object.keys(data.sprites[spriteKey])[0] ?? null)];

            if (imageData === undefined) {
                console.log(data.sprites[spriteKey]);
                continue;
            }

            for (const coord in imageData.coords) {
                if (this._imageCoordinates[coord] !== undefined) {
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