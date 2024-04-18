interface SkillGemTypeWiki {
    "_pageTitle": string;
    "gem description": string;
    "gem tags": string[];
    "primary attribute": string;
}

interface SkillTypeWiki {
    _pageTitle: string;
    "skill icon": string;
    "stat text": string;
    "max level": number;
}

interface ItemTypeWiki {
    _pageTitle: string;
    "base item id": string;
    class: string;
    "class id": string;
}

export type SkillGem = {
    name: string;
    description: string;
    icon: string;
    tags: string[];
    stats: string[];
    primaryAttribute: string;
};

const bannedTags = [
    "Warcry",
    "Mark",
    "Hex",
    "Curse",
    "Brand",
    "Support",
    "Aura",
    "Trigger",
    "Guard",
];

const bannedGems = [
    "Blood Rage",
    "Portal",
    "Devouring Totem",
    "Decoy Totem",
];

async function executeQuery<T>(table: string, fields: string[], where: string[], offset = 0): Promise<T[]> {
    const url = `https://www.poewiki.net/index.php?title=Special:CargoExport&tables=${table}&fields=${fields.join(",")}&where=${where.join("+AND+")}&offset=${offset}&limit=500&format=json`;
    const response = await fetch(url);
    const json = await response.json() as T[];

    if (json.length === 500) {
        return json.concat(await executeQuery<T>(table, fields, where, offset + 500));
    }

    return json;
}

export async function getSkills(): Promise<SkillGem[]> {
    const skillGems = await executeQuery<SkillGemTypeWiki>("skill_gems", [
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
        "items.icon",
        "items.inventory_icon",
    ], [
        "items.class=\"Skill Gem\"",
    ]);

    const skills = await executeQuery<SkillTypeWiki>("skill", [
        "_pageTitle",
        "skill_icon",
        "stat_text",
        "max_level",
    ], [
        "skill_icon IS NOT NULL",
        "_pageName NOT LIKE \"Skill:%\"",
    ]);

    return skillGems.map((skillGem) => {
        const item = items.find((item) => item._pageTitle === skillGem["_pageTitle"]);
        const skill = skills.find((skill) => skill._pageTitle === skillGem["_pageTitle"]);

        if (!skill || !item) {
            return null;
        }

        if (item['base item id'] !== null) {
            return null;
        }

        if (skillGem._pageTitle.includes("/")) {
            return null;
        }

        if (bannedGems.includes(skillGem._pageTitle)) {
            return null;
        }

        if (skillGem['gem tags'].some((tag) => bannedTags.includes(tag))) {
            return null;
        }

        return {
            name: skillGem["_pageTitle"],
            description: skillGem["gem description"],
            stats: skill["stat text"]?.split("&lt;br&gt;") ?? "",
            icon: `https://www.poewiki.net/wiki/Special:FilePath/${skill["skill icon"]}`,
            tags: skillGem["gem tags"],
            primaryAttribute: skillGem["primary attribute"],
        };
    }).filter((x) => x) as SkillGem[];
}