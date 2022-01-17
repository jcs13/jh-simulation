import { IBlocDefinition } from 'app/entities/bloc-definition/bloc-definition.model';

export interface IElement {
  id?: number;
  name?: string;
  path?: string;
  blocDefinition?: IBlocDefinition | null;
}

export class Element implements IElement {
  constructor(public id?: number, public name?: string, public path?: string, public blocDefinition?: IBlocDefinition | null) {}
}

export function getElementIdentifier(element: IElement): number | undefined {
  return element.id;
}
