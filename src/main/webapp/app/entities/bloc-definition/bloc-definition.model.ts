import { IElement } from 'app/entities/element/element.model';

export interface IBlocDefinition {
  id?: number;
  name?: string;
  label?: string;
  element?: IElement | null;
}

export class BlocDefinition implements IBlocDefinition {
  constructor(public id?: number, public name?: string, public label?: string, public element?: IElement | null) {}
}

export function getBlocDefinitionIdentifier(blocDefinition: IBlocDefinition): number | undefined {
  return blocDefinition.id;
}
