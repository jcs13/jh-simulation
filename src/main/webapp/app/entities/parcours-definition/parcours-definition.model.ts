import { IEtapeDefinition } from 'app/entities/etape-definition/etape-definition.model';
import { IOffre } from 'app/entities/offre/offre.model';

export interface IParcoursDefinition {
  id?: number;
  name?: string;
  label?: string;
  etapeDefinitions?: IEtapeDefinition[] | null;
  offre?: IOffre | null;
}

export class ParcoursDefinition implements IParcoursDefinition {
  constructor(
    public id?: number,
    public name?: string,
    public label?: string,
    public etapeDefinitions?: IEtapeDefinition[] | null,
    public offre?: IOffre | null
  ) {}
}

export function getParcoursDefinitionIdentifier(parcoursDefinition: IParcoursDefinition): number | undefined {
  return parcoursDefinition.id;
}
