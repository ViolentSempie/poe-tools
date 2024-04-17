interface SkillTypeWiki {
    "_pageTitle": string;
    "gem description": string;
    "gem tags": string[];
    "primary attribute": string;
}

interface ItemTypeWiki {
    _pageTitle: string;
    "base item id": string;
    class: string;
    "class id": string;
}

const bannedTags = [
    "Warcry",
    "Mark",
    "Hex",
    "Curse",
    "Brand",
    "Support",
    "Totem",
    "Aura",
    "Trigger",
];

const bannedGems = [
    "Blood Rage",
];

async function executeQuery<T>(table: string, fields: string[], where: string[]) {
    const url = `https://www.poewiki.net/index.php?title=Special:CargoExport&tables=${table}&fields=${fields.join(",")}&where=${where.join("+AND+")}&limit=500&format=json`;
    return (await (await fetch(url)).json()) as T[];
}

export async function getSkills() {
    const skillGems = await executeQuery<SkillTypeWiki>("skill_gems", [
        "skill_gems._pageTitle",
        "skill_gems.gem_tags",
        "skill_gems.gem_description",
        "skill_gems.primary_attribute",
    ], [
        "skill_gems.is_vaal_skill_gem=\"No\"",
    ]);

    const items = await executeQuery<ItemTypeWiki>("items", [
        "items._pageTitle",
        "items.base_item_id",
        "items.class",
        "items.class_id",
    ], [
        "items.class=\"Skill Gem\"",
    ]);
    
    return skillGems.map((skill) => {
        const item = items.find((item) => item._pageTitle === skill["_pageTitle"]);

        if (item?.['base item id'] !== null) {
            return null;
        }

        if (skill._pageTitle.includes("/")) {
            return null;
        }

        if (bannedGems.includes(skill._pageTitle)) {
            return null;
        }

        if (skill['gem tags'].some((tag) => bannedTags.includes(tag))) {
            return null;
        }

        return {
            name: skill["_pageTitle"],
            description: skill["gem description"],
            tags: skill["gem tags"],
            primaryAttribute: skill["primary attribute"],
        };
    }).filter((x) => x);
}