import { IOffre } from 'app/entities/offre/offre.model';
import { IParcoursDefinition } from 'app/entities/parcours-definition/parcours-definition.model';

export interface IParcoursComposition {
  id?: number;
  inheritanceOrder?: number;
  offre?: IOffre | null;
  parcoursParent?: IParcoursDefinition | null;
  parcoursChild?: IParcoursDefinition | null;
}

export class ParcoursComposition implements IParcoursComposition {
  constructor(
    public id?: number,
    public inheritanceOrder?: number,
    public offre?: IOffre | null,
    public parcoursParent?: IParcoursDefinition | null,
    public parcoursChild?: IParcoursDefinition | null
  ) {}
}

export function getParcoursCompositionIdentifier(parcoursComposition: IParcoursComposition): number | undefined {
  return parcoursComposition.id;
}
