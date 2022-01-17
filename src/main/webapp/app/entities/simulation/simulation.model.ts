import dayjs from 'dayjs/esm';
import { IParcours } from 'app/entities/parcours/parcours.model';

export interface ISimulation {
  id?: number;
  name?: string;
  affaire?: string | null;
  client?: string | null;
  parc?: string | null;
  adresseInstallation?: string | null;
  status?: string | null;
  created?: dayjs.Dayjs;
  modifier?: dayjs.Dayjs | null;
  parcours?: IParcours | null;
  parent?: ISimulation | null;
}

export class Simulation implements ISimulation {
  constructor(
    public id?: number,
    public name?: string,
    public affaire?: string | null,
    public client?: string | null,
    public parc?: string | null,
    public adresseInstallation?: string | null,
    public status?: string | null,
    public created?: dayjs.Dayjs,
    public modifier?: dayjs.Dayjs | null,
    public parcours?: IParcours | null,
    public parent?: ISimulation | null
  ) {}
}

export function getSimulationIdentifier(simulation: ISimulation): number | undefined {
  return simulation.id;
}
