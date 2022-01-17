import { IEtape } from 'app/entities/etape/etape.model';
import { ISimulation } from 'app/entities/simulation/simulation.model';

export interface IParcours {
  id?: number;
  name?: string;
  label?: string;
  offreId?: string;
  etapes?: IEtape[] | null;
  simulation?: ISimulation | null;
}

export class Parcours implements IParcours {
  constructor(
    public id?: number,
    public name?: string,
    public label?: string,
    public offreId?: string,
    public etapes?: IEtape[] | null,
    public simulation?: ISimulation | null
  ) {}
}

export function getParcoursIdentifier(parcours: IParcours): number | undefined {
  return parcours.id;
}
