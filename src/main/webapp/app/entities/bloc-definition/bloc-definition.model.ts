import { IElement } from 'app/entities/element/element.model';
import { IEtapeDefinition } from 'app/entities/etape-definition/etape-definition.model';

export interface IBlocDefinition {
  id?: number;
  name?: string;
  label?: string;
  element?: IElement | null;
  etapeDefinition?: IEtapeDefinition | null;
}

export class BlocDefinition implements IBlocDefinition {
  constructor(
    public id?: number,
    public name?: string,
    public label?: string,
    public element?: IElement | null,
    public etapeDefinition?: IEtapeDefinition | null
  ) {}
}

export function getBlocDefinitionIdentifier(blocDefinition: IBlocDefinition): number | undefined {
  return blocDefinition.id;
}
