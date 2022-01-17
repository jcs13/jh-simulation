import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IParcoursComposition, getParcoursCompositionIdentifier } from '../parcours-composition.model';

export type EntityResponseType = HttpResponse<IParcoursComposition>;
export type EntityArrayResponseType = HttpResponse<IParcoursComposition[]>;

@Injectable({ providedIn: 'root' })
export class ParcoursCompositionService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/parcours-compositions');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(parcoursComposition: IParcoursComposition): Observable<EntityResponseType> {
    return this.http.post<IParcoursComposition>(this.resourceUrl, parcoursComposition, { observe: 'response' });
  }

  update(parcoursComposition: IParcoursComposition): Observable<EntityResponseType> {
    return this.http.put<IParcoursComposition>(
      `${this.resourceUrl}/${getParcoursCompositionIdentifier(parcoursComposition) as number}`,
      parcoursComposition,
      { observe: 'response' }
    );
  }

  partialUpdate(parcoursComposition: IParcoursComposition): Observable<EntityResponseType> {
    return this.http.patch<IParcoursComposition>(
      `${this.resourceUrl}/${getParcoursCompositionIdentifier(parcoursComposition) as number}`,
      parcoursComposition,
      { observe: 'response' }
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IParcoursComposition>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IParcoursComposition[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addParcoursCompositionToCollectionIfMissing(
    parcoursCompositionCollection: IParcoursComposition[],
    ...parcoursCompositionsToCheck: (IParcoursComposition | null | undefined)[]
  ): IParcoursComposition[] {
    const parcoursCompositions: IParcoursComposition[] = parcoursCompositionsToCheck.filter(isPresent);
    if (parcoursCompositions.length > 0) {
      const parcoursCompositionCollectionIdentifiers = parcoursCompositionCollection.map(
        parcoursCompositionItem => getParcoursCompositionIdentifier(parcoursCompositionItem)!
      );
      const parcoursCompositionsToAdd = parcoursCompositions.filter(parcoursCompositionItem => {
        const parcoursCompositionIdentifier = getParcoursCompositionIdentifier(parcoursCompositionItem);
        if (parcoursCompositionIdentifier == null || parcoursCompositionCollectionIdentifiers.includes(parcoursCompositionIdentifier)) {
          return false;
        }
        parcoursCompositionCollectionIdentifiers.push(parcoursCompositionIdentifier);
        return true;
      });
      return [...parcoursCompositionsToAdd, ...parcoursCompositionCollection];
    }
    return parcoursCompositionCollection;
  }
}
