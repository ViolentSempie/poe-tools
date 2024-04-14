import { GameData } from '@/data/types';
import data from '../data/quests.json';

export function getQuest(id: string) {
    const quests = data as GameData.Quests;
    return quests[id];
}
