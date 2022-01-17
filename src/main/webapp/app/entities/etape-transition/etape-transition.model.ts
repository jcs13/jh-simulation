import { IParcoursDefinition } from 'app/entities/parcours-definition/parcours-definition.model';
import { IEtapeDefinition } from 'app/entities/etape-definition/etape-definition.model';

export interface IEtapeTransition {
  id?: number;
  transition?: number;
  parcoursDefinition?: IParcoursDefinition | null;
  current?: IEtapeDefinition | null;
  next?: IEtapeDefinition | null;
}

export class EtapeTransition implements IEtapeTransition {
  constructor(
    public id?: number,
    public transition?: number,
    public parcoursDefinition?: IParcoursDefinition | null,
    public current?: IEtapeDefinition | null,
    public next?: IEtapeDefinition | null
  ) {}
}

export function getEtapeTransitionIdentifier(etapeTransition: IEtapeTransition): number | undefined {
  return etapeTransition.id;
}
