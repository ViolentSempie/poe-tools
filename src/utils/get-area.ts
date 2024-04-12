import { GameData } from '@/data/types';
import data from '../data/areas.json';

export function getArea(id: string) {
    const areas = data as GameData.Areas;
    return areas[id];
}
