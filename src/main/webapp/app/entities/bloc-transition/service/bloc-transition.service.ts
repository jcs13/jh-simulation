import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IBlocTransition, getBlocTransitionIdentifier } from '../bloc-transition.model';

export type EntityResponseType = HttpResponse<IBlocTransition>;
export type EntityArrayResponseType = HttpResponse<IBlocTransition[]>;

@Injectable({ providedIn: 'root' })
export class BlocTransitionService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/bloc-transitions');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(blocTransition: IBlocTransition): Observable<EntityResponseType> {
    return this.http.post<IBlocTransition>(this.resourceUrl, blocTransition, { observe: 'response' });
  }

  update(blocTransition: IBlocTransition): Observable<EntityResponseType> {
    return this.http.put<IBlocTransition>(`${this.resourceUrl}/${getBlocTransitionIdentifier(blocTransition) as number}`, blocTransition, {
      observe: 'response',
    });
  }

  partialUpdate(blocTransition: IBlocTransition): Observable<EntityResponseType> {
    return this.http.patch<IBlocTransition>(
      `${this.resourceUrl}/${getBlocTransitionIdentifier(blocTransition) as number}`,
      blocTransition,
      { observe: 'response' }
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IBlocTransition>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IBlocTransition[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addBlocTransitionToCollectionIfMissing(
    blocTransitionCollection: IBlocTransition[],
    ...blocTransitionsToCheck: (IBlocTransition | null | undefined)[]
  ): IBlocTransition[] {
    const blocTransitions: IBlocTransition[] = blocTransitionsToCheck.filter(isPresent);
    if (blocTransitions.length > 0) {
      const blocTransitionCollectionIdentifiers = blocTransitionCollection.map(
        blocTransitionItem => getBlocTransitionIdentifier(blocTransitionItem)!
      );
      const blocTransitionsToAdd = blocTransitions.filter(blocTransitionItem => {
        const blocTransitionIdentifier = getBlocTransitionIdentifier(blocTransitionItem);
        if (blocTransitionIdentifier == null || blocTransitionCollectionIdentifiers.includes(blocTransitionIdentifier)) {
          return false;
        }
        blocTransitionCollectionIdentifiers.push(blocTransitionIdentifier);
        return true;
      });
      return [...blocTransitionsToAdd, ...blocTransitionCollection];
    }
    return blocTransitionCollection;
  }
}
