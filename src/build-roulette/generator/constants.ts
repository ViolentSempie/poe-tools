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
    ["Chaos Inoculation", "Ghost Reaver"],
    ["Chaos Inoculation", "The Agnostic"],
    ["Runebinder", "Ancestral Bond"],
    ["Minion Instability", "Ancestral Bond"],
    ["Solipsism", "Magebane"],
];

export interface XMLType {
	"?xml": {
		"@_encoding": string;
		"@_version": string;
	};
	"PathOfBuilding": {
		Build: {
			"@_ascendClassName": string;
			"@_bandit": string;
			"@_characterLevelAutoMode": string;
			"@_className": string;
			"@_level": string;
			"@_mainSocketGroup": string;
			"@_pantheonMajorGod": string;
			"@_pantheonMinorGod": string;
			"@_targetVersion": string;
			"@_viewMode": string;
		};
		Config: unknown;
		Items: {
			"@_activeItemSet": string;
			"@_useSecondWeaponSet": string;
			ItemSet: {
				"@_id": string;
				"@_useSecondWeaponSet": string;
			}[];
		};
		Skills: {
			"@_activeSkillSet": string;
			"@_defaultGemLevel": string;
			"@_defaultGemQuality": string;
			"@_showAltQualityGems": string;
			"@_showSupportGemTypes": string;
			"@_sortGemsByDPS": string;
			"@_sortGemsByDPSField": string;
			SkillSet: {
				"@_id": string;
				Skill: {
					"@_enabled": string;
					"@_includeInFullDPS": string;
					"@_label": string;
					"@_mainActiveSkill": string;
					"@_mainActiveSkillCalcs": string;
					Gem: {
						"@_count": string;
						"@_enableGlobal1": string;
						"@_enableGlobal2": string;
						"@_enabled": string;
						"@_gemId": string;
						"@_level": string;
						"@_nameSpec": string;
						"@_quality": string;
						"@_qualityId": string;
						"@_skillId": string;
						"@_variantId": string;
					};
				};
			}[];
		};
		Tree: {
			"@_activeSpec": string;
			Spec: {
				"@_ascendClassId": string;
				"@_classId": string;
				"@_masteryEffects": string;
				"@_nodes": string;
				"@_secondaryAscendClassId": string;
				"@_treeVersion": string;
			}[];
		};
	};
}

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
				<Gem enableGlobal2="true" level="1" gemId="{GEM_ID}" variantId="{VARIANT_ID}" skillId="{SKILL_ID}" quality="0" qualityId="Default" enableGlobal1="true" enabled="true" count="1" nameSpec="{GEM_NAME}"/>
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