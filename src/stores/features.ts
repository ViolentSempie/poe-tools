import { Tab } from "@/settings/settings-modal";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export type Feature = {
    name: string;
    enabled: boolean;
};

export type FeatureStore = {
    features: {
        exileLeveling: Feature;
        hotkeyHelperText: Feature;
    },
    getTabs: () => Tab[];
    enableFeature: (feature: keyof FeatureStore["features"]) => void;
    disableFeature: (feature: keyof FeatureStore["features"]) => void;
    setFeature: (feature: keyof FeatureStore["features"], enabled: boolean) => void;
};

export const useFeatureStore = create<FeatureStore>()(
    devtools(
        persist(
            (set, get) => ({
                features: {
                    exileLeveling: {
                        name: "exile leveling",
                        enabled: false,
                    },
                    hotkeyHelperText: {
                        name: "hotkey helper text",
                        enabled: true,
                    },
                },
                getTabs() {
                    const features = get().features;

                    console.log(features);
                    return Object.keys(features).map((feature) => ({
                        name: features[feature as keyof typeof features].name,
                        isActive: features[feature as keyof typeof features].enabled,
                        current: false,
                    }));
                },
                enableFeature(feature) {
                    set((state) => ({
                        ...state,
                        features: {
                            ...state.features,
                            [feature]: {
                                ...state.features[feature],
                                enabled: true,
                            }
                        }
                    }));
                },
                disableFeature(feature) {
                    set((state) => ({
                        ...state,
                        features: {
                            ...state.features,
                            [feature]: {
                                ...state.features[feature],
                                enabled: false,
                            }
                        }
                    }));
                },
                setFeature(feature, enabled) {
                    set((state) => ({
                        ...state,
                        features: {
                            ...state.features,
                            [feature]: {
                                ...state.features[feature],
                                enabled,
                            }
                        }
                    }));
                },
            }),
            {
                name: "feature-store.v2",
            }
        )
    )
);
