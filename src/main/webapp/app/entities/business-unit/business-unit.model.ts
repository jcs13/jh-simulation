import { IOffre } from 'app/entities/offre/offre.model';

export interface IBusinessUnit {
  id?: number;
  code?: string;
  name?: string;
  label?: string;
  offres?: IOffre[] | null;
}

export class BusinessUnit implements IBusinessUnit {
  constructor(public id?: number, public code?: string, public name?: string, public label?: string, public offres?: IOffre[] | null) {}
}

export function getBusinessUnitIdentifier(businessUnit: IBusinessUnit): number | undefined {
  return businessUnit.id;
}
