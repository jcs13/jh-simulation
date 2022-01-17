import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IEtapeTransition, getEtapeTransitionIdentifier } from '../etape-transition.model';

export type EntityResponseType = HttpResponse<IEtapeTransition>;
export type EntityArrayResponseType = HttpResponse<IEtapeTransition[]>;

@Injectable({ providedIn: 'root' })
export class EtapeTransitionService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/etape-transitions');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(etapeTransition: IEtapeTransition): Observable<EntityResponseType> {
    return this.http.post<IEtapeTransition>(this.resourceUrl, etapeTransition, { observe: 'response' });
  }

  update(etapeTransition: IEtapeTransition): Observable<EntityResponseType> {
    return this.http.put<IEtapeTransition>(
      `${this.resourceUrl}/${getEtapeTransitionIdentifier(etapeTransition) as number}`,
      etapeTransition,
      { observe: 'response' }
    );
  }

  partialUpdate(etapeTransition: IEtapeTransition): Observable<EntityResponseType> {
    return this.http.patch<IEtapeTransition>(
      `${this.resourceUrl}/${getEtapeTransitionIdentifier(etapeTransition) as number}`,
      etapeTransition,
      { observe: 'response' }
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IEtapeTransition>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IEtapeTransition[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addEtapeTransitionToCollectionIfMissing(
    etapeTransitionCollection: IEtapeTransition[],
    ...etapeTransitionsToCheck: (IEtapeTransition | null | undefined)[]
  ): IEtapeTransition[] {
    const etapeTransitions: IEtapeTransition[] = etapeTransitionsToCheck.filter(isPresent);
    if (etapeTransitions.length > 0) {
      const etapeTransitionCollectionIdentifiers = etapeTransitionCollection.map(
        etapeTransitionItem => getEtapeTransitionIdentifier(etapeTransitionItem)!
      );
      const etapeTransitionsToAdd = etapeTransitions.filter(etapeTransitionItem => {
        const etapeTransitionIdentifier = getEtapeTransitionIdentifier(etapeTransitionItem);
        if (etapeTransitionIdentifier == null || etapeTransitionCollectionIdentifiers.includes(etapeTransitionIdentifier)) {
          return false;
        }
        etapeTransitionCollectionIdentifiers.push(etapeTransitionIdentifier);
        return true;
      });
      return [...etapeTransitionsToAdd, ...etapeTransitionCollection];
    }
    return etapeTransitionCollection;
  }
}
