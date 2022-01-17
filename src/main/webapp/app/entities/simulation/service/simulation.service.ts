import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ISimulation, getSimulationIdentifier } from '../simulation.model';

export type EntityResponseType = HttpResponse<ISimulation>;
export type EntityArrayResponseType = HttpResponse<ISimulation[]>;

@Injectable({ providedIn: 'root' })
export class SimulationService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/simulations');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(simulation: ISimulation): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(simulation);
    return this.http
      .post<ISimulation>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(simulation: ISimulation): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(simulation);
    return this.http
      .put<ISimulation>(`${this.resourceUrl}/${getSimulationIdentifier(simulation) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(simulation: ISimulation): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(simulation);
    return this.http
      .patch<ISimulation>(`${this.resourceUrl}/${getSimulationIdentifier(simulation) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<ISimulation>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<ISimulation[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addSimulationToCollectionIfMissing(
    simulationCollection: ISimulation[],
    ...simulationsToCheck: (ISimulation | null | undefined)[]
  ): ISimulation[] {
    const simulations: ISimulation[] = simulationsToCheck.filter(isPresent);
    if (simulations.length > 0) {
      const simulationCollectionIdentifiers = simulationCollection.map(simulationItem => getSimulationIdentifier(simulationItem)!);
      const simulationsToAdd = simulations.filter(simulationItem => {
        const simulationIdentifier = getSimulationIdentifier(simulationItem);
        if (simulationIdentifier == null || simulationCollectionIdentifiers.includes(simulationIdentifier)) {
          return false;
        }
        simulationCollectionIdentifiers.push(simulationIdentifier);
        return true;
      });
      return [...simulationsToAdd, ...simulationCollection];
    }
    return simulationCollection;
  }

  protected convertDateFromClient(simulation: ISimulation): ISimulation {
    return Object.assign({}, simulation, {
      created: simulation.created?.isValid() ? simulation.created.format(DATE_FORMAT) : undefined,
      modifier: simulation.modifier?.isValid() ? simulation.modifier.format(DATE_FORMAT) : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.created = res.body.created ? dayjs(res.body.created) : undefined;
      res.body.modifier = res.body.modifier ? dayjs(res.body.modifier) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((simulation: ISimulation) => {
        simulation.created = simulation.created ? dayjs(simulation.created) : undefined;
        simulation.modifier = simulation.modifier ? dayjs(simulation.modifier) : undefined;
      });
    }
    return res;
  }
}
