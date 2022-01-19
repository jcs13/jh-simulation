export interface IEtapeDefinition {
  id?: number;
  name?: string;
  label?: string;
}

export class EtapeDefinition implements IEtapeDefinition {
  constructor(public id?: number, public name?: string, public label?: string) {}
}

export function getEtapeDefinitionIdentifier(etapeDefinition: IEtapeDefinition): number | undefined {
  return etapeDefinition.id;
}
