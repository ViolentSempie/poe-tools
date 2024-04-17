export const DEFAULT_VERSION = "3.24.0";
export const MAX_DISTANCE_BETWEEN_KEYSTONES = 12;
export const NUMBER_OF_KEYSTONES = 4;


function createVersion(versionName: string, versionTag: string) {
    return {
        name: versionName,
        tag: versionTag,
        url: `https://raw.githubusercontent.com/poe-tool-dev/passive-skill-tree-json/master/${versionTag}/SkillTree.json`,
    };
}

export const VERSION_MAPPING = {
    "3.24.0": createVersion("3.24.0", "3.24.0-pre"),
};