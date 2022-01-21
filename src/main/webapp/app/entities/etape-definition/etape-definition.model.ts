export interface IEtapeDefinition {
  id?: number;
  name?: string;
  label?: string;
  display?: boolean;
}

export class EtapeDefinition implements IEtapeDefinition {
  constructor(public id?: number, public name?: string, public label?: string, public display?: boolean) {
    this.display = this.display ?? false;
  }
}

export function getEtapeDefinitionIdentifier(etapeDefinition: IEtapeDefinition): number | undefined {
  return etapeDefinition.id;
}
