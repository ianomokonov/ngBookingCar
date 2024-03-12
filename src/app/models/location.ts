import { Translate } from './translate';

export interface LocationShort {
  path: string;
  name: Translate;
}

export interface Location {
  id: number;
  path: string;
  name: Translate;
  sections: LocationSection[];
}

export interface LocationSection {
  id: number;
  name: Translate;
  description: Translate;
  img?: string;
}
