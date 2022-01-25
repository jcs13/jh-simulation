import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IOffreComposition, getOffreCompositionIdentifier } from '../offre-composition.model';

export type EntityResponseType = HttpResponse<IOffreComposition>;
export type EntityArrayResponseType = HttpResponse<IOffreComposition[]>;

@Injectable({ providedIn: 'root' })
export class OffreCompositionService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/offre-compositions');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(offreComposition: IOffreComposition): Observable<EntityResponseType> {
    return this.http.post<IOffreComposition>(this.resourceUrl, offreComposition, { observe: 'response' });
  }

  update(offreComposition: IOffreComposition): Observable<EntityResponseType> {
    return this.http.put<IOffreComposition>(
      `${this.resourceUrl}/${getOffreCompositionIdentifier(offreComposition) as number}`,
      offreComposition,
      { observe: 'response' }
    );
  }

  partialUpdate(offreComposition: IOffreComposition): Observable<EntityResponseType> {
    return this.http.patch<IOffreComposition>(
      `${this.resourceUrl}/${getOffreCompositionIdentifier(offreComposition) as number}`,
      offreComposition,
      { observe: 'response' }
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IOffreComposition>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IOffreComposition[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addOffreCompositionToCollectionIfMissing(
    offreCompositionCollection: IOffreComposition[],
    ...offreCompositionsToCheck: (IOffreComposition | null | undefined)[]
  ): IOffreComposition[] {
    const offreCompositions: IOffreComposition[] = offreCompositionsToCheck.filter(isPresent);
    if (offreCompositions.length > 0) {
      const offreCompositionCollectionIdentifiers = offreCompositionCollection.map(
        offreCompositionItem => getOffreCompositionIdentifier(offreCompositionItem)!
      );
      const offreCompositionsToAdd = offreCompositions.filter(offreCompositionItem => {
        const offreCompositionIdentifier = getOffreCompositionIdentifier(offreCompositionItem);
        if (offreCompositionIdentifier == null || offreCompositionCollectionIdentifiers.includes(offreCompositionIdentifier)) {
          return false;
        }
        offreCompositionCollectionIdentifiers.push(offreCompositionIdentifier);
        return true;
      });
      return [...offreCompositionsToAdd, ...offreCompositionCollection];
    }
    return offreCompositionCollection;
  }
}
