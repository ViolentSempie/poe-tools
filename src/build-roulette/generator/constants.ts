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

export const BANNED_COMBINATIONS = [
    ["Chaos Inoculation", "Pain Attunement"],
    ["Runebinder", "Ancestral Bond"],
    ["Minion Instability", "Ancestral Bond"],
    ["Solipsism", "Magebane"],
];

export const EXPORT_BASE = `<?xml version="1.0" encoding="UTF-8"?>
<PathOfBuilding>
	<Build level="12" targetVersion="3_0" pantheonMajorGod="None" bandit="None" className="{CLASS_NAME}" ascendClassName="None" characterLevelAutoMode="true" mainSocketGroup="1" viewMode="IMPORT" pantheonMinorGod="None">
	</Build>
	<Tree activeSpec="1">
		<Spec masteryEffects="" ascendClassId="0" nodes="{TREE_NODES}" secondaryAscendClassId="nil" treeVersion="3_24" classId="{CLASS_ID}">
		</Spec>
	</Tree>
	<Skills sortGemsByDPSField="CombinedDPS" activeSkillSet="1" sortGemsByDPS="true" defaultGemQuality="0" defaultGemLevel="normalMaximum" showSupportGemTypes="ALL" showAltQualityGems="false">
		<SkillSet id="1">
			<Skill mainActiveSkillCalcs="1" includeInFullDPS="nil" label="" enabled="true" mainActiveSkill="1">
				<Gem enableGlobal2="true" level="20" gemId="{GEM_ID}" variantId="{VARIANT_ID}" skillId="{SKILL_ID}" quality="0" qualityId="Default" enableGlobal1="true" enabled="true" count="1" nameSpec="{GEM_NAME}"/>
			</Skill>
		</SkillSet>
	</Skills>
	<Items activeItemSet="1" useSecondWeaponSet="nil">
		<ItemSet useSecondWeaponSet="nil" id="1">
		</ItemSet>
	</Items>
	<Config>
	</Config>
</PathOfBuilding>`;