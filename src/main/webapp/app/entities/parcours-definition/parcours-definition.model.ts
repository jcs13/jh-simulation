export interface IParcoursDefinition {
  id?: number;
  name?: string;
  label?: string;
}

export class ParcoursDefinition implements IParcoursDefinition {
  constructor(public id?: number, public name?: string, public label?: string) {}
}

export function getParcoursDefinitionIdentifier(parcoursDefinition: IParcoursDefinition): number | undefined {
  return parcoursDefinition.id;
}
