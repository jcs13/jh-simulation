import { IBusinessUnit } from 'app/entities/business-unit/business-unit.model';

export interface IOffre {
  id?: number;
  name?: string;
  label?: string;
  businessUnit?: IBusinessUnit | null;
}

export class Offre implements IOffre {
  constructor(public id?: number, public name?: string, public label?: string, public businessUnit?: IBusinessUnit | null) {}
}

export function getOffreIdentifier(offre: IOffre): number | undefined {
  return offre.id;
}
