import { IElement } from 'app/entities/element/element.model';

export interface IBlocDefinition {
  id?: number;
  name?: string;
  label?: string;
  display?: boolean;
  element?: IElement | null;
}

export class BlocDefinition implements IBlocDefinition {
  constructor(public id?: number, public name?: string, public label?: string, public display?: boolean, public element?: IElement | null) {
    this.display = this.display ?? false;
  }
}

export function getBlocDefinitionIdentifier(blocDefinition: IBlocDefinition): number | undefined {
  return blocDefinition.id;
}
