import { IEtape } from 'app/entities/etape/etape.model';

export interface IBloc {
  id?: number;
  name?: string;
  label?: string;
  elementName?: string;
  elementPath?: string;
  etapeDefinitionId?: string;
  blocDefinitionId?: string;
  display?: boolean;
  etape?: IEtape | null;
}

export class Bloc implements IBloc {
  constructor(
    public id?: number,
    public name?: string,
    public label?: string,
    public elementName?: string,
    public elementPath?: string,
    public etapeDefinitionId?: string,
    public blocDefinitionId?: string,
    public display?: boolean,
    public etape?: IEtape | null
  ) {
    this.display = this.display ?? false;
  }
}

export function getBlocIdentifier(bloc: IBloc): number | undefined {
  return bloc.id;
}
