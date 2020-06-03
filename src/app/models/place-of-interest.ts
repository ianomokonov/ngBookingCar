import { Translate } from './translate';

export interface PlaceOfInterest{
    id?: number;
    img: string;
    name: Translate,
    description: Translate,
    road: Translate,
    rating: number
}