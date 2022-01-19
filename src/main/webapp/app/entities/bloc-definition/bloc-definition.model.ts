import { IElement } from 'app/entities/element/element.model';
import { IEtapeDefinition } from 'app/entities/etape-definition/etape-definition.model';
import { IParcoursDefinition } from 'app/entities/parcours-definition/parcours-definition.model';

export interface IBlocDefinition {
  id?: number;
  name?: string;
  label?: string;
  element?: IElement | null;
  etapeDefinition?: IEtapeDefinition | null;
  parcoursDefinition?: IParcoursDefinition | null;
}

export class BlocDefinition implements IBlocDefinition {
  constructor(
    public id?: number,
    public name?: string,
    public label?: string,
    public element?: IElement | null,
    public etapeDefinition?: IEtapeDefinition | null,
    public parcoursDefinition?: IParcoursDefinition | null
  ) {}
}

export function getBlocDefinitionIdentifier(blocDefinition: IBlocDefinition): number | undefined {
  return blocDefinition.id;
}
