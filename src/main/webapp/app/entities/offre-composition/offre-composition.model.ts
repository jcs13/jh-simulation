import { IOffre } from 'app/entities/offre/offre.model';
import { IParcoursDefinition } from 'app/entities/parcours-definition/parcours-definition.model';

export interface IOffreComposition {
  id?: number;
  inheritanceOrder?: number;
  offre?: IOffre | null;
  parcoursParent?: IParcoursDefinition | null;
  parcoursChild?: IParcoursDefinition | null;
}

export class OffreComposition implements IOffreComposition {
  constructor(
    public id?: number,
    public inheritanceOrder?: number,
    public offre?: IOffre | null,
    public parcoursParent?: IParcoursDefinition | null,
    public parcoursChild?: IParcoursDefinition | null
  ) {}
}

export function getOffreCompositionIdentifier(offreComposition: IOffreComposition): number | undefined {
  return offreComposition.id;
}
