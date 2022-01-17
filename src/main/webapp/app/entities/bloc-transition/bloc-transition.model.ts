import { IEtapeDefinition } from 'app/entities/etape-definition/etape-definition.model';
import { IParcoursDefinition } from 'app/entities/parcours-definition/parcours-definition.model';
import { IBlocDefinition } from 'app/entities/bloc-definition/bloc-definition.model';

export interface IBlocTransition {
  id?: number;
  transition?: number;
  etapeDefinition?: IEtapeDefinition | null;
  parcoursDefinition?: IParcoursDefinition | null;
  current?: IBlocDefinition | null;
  next?: IBlocDefinition | null;
}

export class BlocTransition implements IBlocTransition {
  constructor(
    public id?: number,
    public transition?: number,
    public etapeDefinition?: IEtapeDefinition | null,
    public parcoursDefinition?: IParcoursDefinition | null,
    public current?: IBlocDefinition | null,
    public next?: IBlocDefinition | null
  ) {}
}

export function getBlocTransitionIdentifier(blocTransition: IBlocTransition): number | undefined {
  return blocTransition.id;
}
