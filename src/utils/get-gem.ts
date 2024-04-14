import { GameData } from '@/data/types';
import data from '../data/gems.json';

export function getGem(id: string) {
    const gems = data as GameData.Gems;
    return gems[id];
}
