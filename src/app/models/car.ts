import { DateRange } from './order';
import { Translate } from './translate';

export interface Car {
  id?: number;
  img: string;
  name: string;
  description: Translate;
  fuelType: string;
  bodyType: string;
  engineVolume?: number;
  enginePower: number;
  speed?: number;
  time?: number;
  consumption?: number;
  kpp: string;
  driveUnit: string;
  places: number;
  backVolume?: number;
  license?: string;
  createYear?: number;
  dates?: DateRange[];
  class?: string;
  summerPrice: number;
  winterPrice: number;
  minAge: number;
  ac: boolean;
  abs: boolean;
  airBags: boolean;
  doors: number;

  summerPrices: any;
  winterPrices: any;
}
