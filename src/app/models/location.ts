import { Translate } from './translate';

export interface LocationShort {
  path: string;
  name: Translate;
}

export interface Location {
  path: string;
  name: Translate;
  sections: LocationSection[];
}

export interface LocationSection {
  name: Translate;
  description: Translate;
  img?: string;
}
